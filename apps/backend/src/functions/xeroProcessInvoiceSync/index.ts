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
  TABLE_TASK,
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

    //get xeroLastInvoiceSyncAt from entity
    let xeroLastInvoiceSyncAt;
    let taxNumber: string;
    try {
      const entity = await getRecord(TABLE_ENTITY ?? '', { id: entityId });
      taxNumber = entity.taxNumber.toString();
      console.log('taxNumber: ', taxNumber);
      xeroLastInvoiceSyncAt = new Date(entity.xeroLastInvoiceSyncAt);
      console.log(
        'Success getting xeroLastInvoiceSyncAt: ',
        xeroLastInvoiceSyncAt
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
      //get xero invoices
      let xeroInvoices;
      try {
        const rlt = await xero.accountingApi.getInvoices(
          xeroTenantId,
          xeroLastInvoiceSyncAt ? new Date(xeroLastInvoiceSyncAt) : undefined
        );
        xeroInvoices = rlt.body.invoices;
        console.log('Success getting xero invoices: ', xeroInvoices);
      } catch (err: any) {
        console.error('ERROR getting xero invoices: ', err);
        throw new Error(err.message);
      }

      if (!xeroInvoices || xeroInvoices.length === 0) {
        console.log('No matching invoices found');
        try {
          const updateEntityParams = {
            xeroInvoiceSyncStatus: XeroSyncStatus.UNSYNCED,
          };
          await updateRecord(
            TABLE_ENTITY ?? '',
            { id: entityId },
            updateEntityParams
          );
          console.log(
            'Success update entity xeroInvoiceSyncStatus as Unsynced'
          );
        } catch (err: any) {
          console.error('ERROR update entity xeroInvoiceSyncStatus: ', err);
          throw new Error(err.message);
        }
        return;
      } else {
        //create contact records
        const createdAt = new Date().toISOString();
        for (const xeroInvoice of xeroInvoices) {
          const param = {
            entityId,
            xeroTenantId,
            id: xeroInvoice.invoiceID,
            invoiceStatus: xeroInvoice.status,
            amount: xeroInvoice.total,
            contactId: xeroInvoice.contact?.contactID,
            searchName: xeroInvoice.contact?.name,
            paymentStatus: xeroInvoice.payments?.[0]?.status,
            type: xeroInvoice.type,
            documents: xeroInvoice.attachments,
            numberOfPayments: xeroInvoice.payments?.length,
            paymentFrequency: xeroInvoice.payments?.[0]?.paymentType,
            paymentTypes: xeroInvoice.payments?.[0]?.paymentType,
            reference: xeroInvoice.reference,
            signers: xeroInvoice.contact?.name,
            createdBy: userId,
            entityIdBy: entityId,
            dueAt: xeroInvoice.dueDate,
            paymentAt: xeroInvoice.payments?.[0]?.date,
            lodgementAt: xeroInvoice.date,
            createdAt: xeroInvoice.updatedDateUTC,
            updatedAt: xeroInvoice.updatedDateUTC,
            paidAt: xeroInvoice.fullyPaidOnDate,
            completedAt: xeroInvoice.fullyPaidOnDate,
            lineItems: xeroInvoice.lineItems,
            // status: xeroInvoice.status,
            // taskNumber:
            // entityIdFrom:
            // annotations:
            // agreementUuid:
            // fromId:
            // fromType:
            // toId:
            // toType:
            // entityIdTo:
            // contactIdFrom:
            // contactIdTo:
            // fromSearchStatus:
            // toSearchStatus:
            // entityByIdContactId:
            // signatureStatus:
            // category:
            // bpayReferenceNumber:
            // settlementStatus:
            // notes:
            // direction:
            // readBy:
            // gstInclusive:
            // viewedAt:
            // readAt:
            // owner:
            __typename: 'TASK',
          };
          try {
            const task = await createRecord(TABLE_TASK ?? '', param);
            console.log('Success create invoice record: ', task);
          } catch (err: any) {
            console.error('ERROR create invoice table: ', err);
            throw new Error(err.message);
          }
        }

        //update entity xeroInvoiceSyncStatus
        try {
          const updateEntityParams = {
            xeroInvoiceSyncStatus: XeroSyncStatus.SYNCED,
            xeroLastInvoiceSyncAt: createdAt,
            xeroTenantId: xeroTenantId,
          };
          await updateRecord(
            TABLE_ENTITY ?? '',
            { id: entityId },
            updateEntityParams
          );
          console.log('Success update entity xeroInvoiceSyncStatus as Synced');
        } catch (err: any) {
          console.error('ERROR update entity xeroInvoiceSyncStatus: ', err);
          throw new Error(err.message);
        }
      }
    } else {
      console.log('No matching organization found');
      try {
        const updateEntityParams = {
          xeroInvoiceSyncStatus: XeroSyncStatus.UNSYNCED,
        };
        await updateRecord(
          TABLE_ENTITY ?? '',
          { id: entityId },
          updateEntityParams
        );
        console.log('Success update entity xeroInvoiceSyncStatus as Unsynced');
      } catch (err: any) {
        console.error('ERROR update entity xeroInvoiceSyncStatus: ', err);
        throw new Error(err.message);
      }
      return;
    }
    return;
  }
};
