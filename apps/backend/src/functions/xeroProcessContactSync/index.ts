import { SQSEvent } from 'aws-lambda';
import {
  BankAccountType,
  BankHolderType,
  Contact,
  ContactStatus,
  XeroSyncStatus,
  ContactType,
} from 'dependency-layer/API';
import { XeroClient } from 'xero-node';
import {
  updateRecord,
  createRecord,
  getRecord,
} from 'dependency-layer/dynamoDB';
import { initializeXeroClientWithTokenSet } from 'dependency-layer/xero';
const {
  TABLE_CONTACT,
  TABLE_ENTITY,
  TABLE_XERO_TOKEN,
  AUTH_USERPOOLID,
  TABLE_USER,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
} = process.env;

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    // parse message body
    let messageAttributes;
    try {
      messageAttributes = record.messageAttributes;
    } catch (err) {
      console.log('ERROR parsing message: ', err);
    }

    // get message attributes
    const entityId = messageAttributes?.entityId.stringValue ?? '';
    const xeroTenantId = messageAttributes?.xeroTenantId.stringValue ?? '';
    const userId = messageAttributes?.userId.stringValue ?? '';
    console.log('entityId: ', entityId);
    console.log('userId: ', userId);

    //get xeroLastContactSyncAt from entity
    let xeroLastContactSyncAt;
    let taxNumber: string;
    try {
      const entity = await getRecord(TABLE_ENTITY ?? '', { id: entityId });
      taxNumber = entity.taxNumber.toString();
      console.log('taxNumber: ', taxNumber);
      xeroLastContactSyncAt = new Date(entity.xeroLastContactSyncAt);
      console.log(
        'Success getting xeroLastContactSyncAt: ',
        xeroLastContactSyncAt
      );
    } catch (err: any) {
      console.error('Error getting entity: ', err);
      throw new Error(err.message);
    }

    // get xeroTokenSet
    let xeroTokenSet;
    try {
      const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', { id: userId });
      xeroTokenSet = xeroToken.xeroTokenSet;
      console.log('Success getting tokenSet: ', xeroTokenSet);
    } catch (err: any) {
      console.error('Error getting tokenSet: ', err);
      throw new Error(err.message);
    }

    //initialize xero client
    let xero: XeroClient;
    try {
      xero = await initializeXeroClientWithTokenSet(xeroTokenSet);
      console.log('Success initialize xero: ', xero);
    } catch (err: any) {
      console.error('ERROR initialize xero: ', err);
      throw new Error(err.message);
    }

    //read token set
    const newXeroTokenSet = xero.readTokenSet();
    //update token set if changed
    if (newXeroTokenSet?.expires_at !== xeroTokenSet.expires_at) {
      try {
        const updateTokenParams = { xeroTokenSet: newXeroTokenSet };
        const xeroToken = await updateRecord(
          TABLE_XERO_TOKEN ?? '',
          { id: userId },
          updateTokenParams
        );
        console.log('Success update xero token table: ', xeroToken);
      } catch (err: any) {
        console.error('ERROR update xero token table: ', err);
        throw new Error(err.message);
      }
    }

    // get xeroOrganization
    const xeroTenant = xero.tenants?.find(
      (tenant) => tenant.tenantId === xeroTenantId
    );
    let xeroOrganization = null;
    try {
      const rlt = await xero.accountingApi.getOrganisations(xeroTenantId);
      xeroOrganization = rlt.body.organisations?.[0];
      console.log('Success getting xero organization: ', xeroOrganization);
    } catch (err: any) {
      console.error('ERROR getting xeroOrganization: ', err);
      throw new Error(err.message);
    }

    if (xeroOrganization && xeroTenant) {
      //get xero contacts
      let xeroContacts;
      try {
        const rlt = await xero.accountingApi.getContacts(
          xeroTenantId,
          xeroLastContactSyncAt ? new Date(xeroLastContactSyncAt) : undefined
        );
        xeroContacts = rlt.body.contacts;
        console.log('Success getting xero contacts: ', xeroContacts);
      } catch (err: any) {
        console.error('ERROR getting xero contacts: ', err);
        throw new Error(err.message);
      }

      if (!xeroContacts || xeroContacts.length === 0) {
        console.log('No matching contacts found');
        try {
          const updateEntityParams = {
            xeroContactSyncStatus: XeroSyncStatus.UNSYNCED,
          };
          await updateRecord(
            TABLE_ENTITY ?? '',
            { id: entityId },
            updateEntityParams
          );
          console.log(
            'Success update entity xeroContactSyncStatus as Unsynced'
          );
        } catch (err: any) {
          console.error('ERROR update entity xeroContactSyncStatus: ', err);
          throw new Error(err.message);
        }
        return;
      } else {
        //create contact records
        const createdAt = new Date().toISOString();
        for (const xeroContact of xeroContacts) {
          const contactParam: Contact = {
            id: xeroContact.contactID ?? '',
            entityId: entityId,
            xeroTenantId: xeroTenant.tenantId,
            entityType: xeroTenant.tenantType,
            firstName: xeroContact.firstName,
            lastName: xeroContact.lastName,
            email: xeroContact.emailAddress,
            phone: xeroContact.phones?.[0]?.phoneNumber ?? null,
            // taxNumber: taxNumber,
            name: xeroContact.name ?? null,
            legalName: xeroContact.name ?? null,
            companyName: xeroContact.name ?? null,
            searchName: xeroContact.name ?? null,
            status:
              xeroContact.contactStatus === undefined
                ? ContactStatus.ARCHIVED
                : ContactStatus.ACTIVE,
            createdAt: xeroContact.updatedDateUTC?.toString(),
            updatedAt: xeroContact.updatedDateUTC?.toString(),
            contactType: xeroContact.isSupplier
              ? ContactType.CLIENT
              : ContactType.NORMAL,
            bank: {
              id: xeroContact.batchPayments?.bankAccountNumber ?? null,
              accountName: xeroContact.batchPayments?.bankAccountName ?? '',
              bankName: null,
              accountNumber: xeroContact.batchPayments?.bankAccountNumber ?? '',
              routingNumber: xeroContact.batchPayments?.code ?? '',
              holderType: BankHolderType.business,
              accountType: BankAccountType.checking,
              country: null,
              __typename: 'ContactBankAccount',
            },
            bpay: null,
            bulkUploadFileKey: null,
            owner: userId,
            __typename: 'Contact',
          };

          try {
            const contact = await createRecord(
              TABLE_CONTACT ?? '',
              contactParam
            );
            console.log('Success create contact record: ', contact);
          } catch (err: any) {
            console.error('ERROR create contact table: ', err);
            throw new Error(err.message);
          }
        }

        //update entity xeroContactSyncStatus
        try {
          const updateEntityParams = {
            xeroContactSyncStatus: XeroSyncStatus.SYNCED,
            xeroLastContactSyncAt: createdAt,
            xeroTenantId: xeroTenantId,
          };
          await updateRecord(
            TABLE_ENTITY ?? '',
            { id: entityId },
            updateEntityParams
          );
          console.log('Success update entity xeroContactSyncStatus as Synced');
        } catch (err: any) {
          console.error('ERROR update entity xeroContactSyncStatus: ', err);
          throw new Error(err.message);
        }
      }
    } else {
      console.log('No matching organization found');
      try {
        const updateEntityParams = {
          xeroContactSyncStatus: XeroSyncStatus.UNSYNCED,
        };
        await updateRecord(
          TABLE_ENTITY ?? '',
          { id: entityId },
          updateEntityParams
        );
        console.log('Success update entity xeroContactSyncStatus as Unsynced');
      } catch (err: any) {
        console.error('ERROR update entity xeroContactSyncStatus: ', err);
        throw new Error(err.message);
      }
      return;
    }
    return;
  }
};
