import { APIGatewayProxyHandler } from 'aws-lambda';
const {
  TABLE_CONTACT,
  TABLE_ENTITY,
  TABLE_XERO_TOKEN,
  TABLE_TASK,
  TABLE_ENTITY_USER,
  AUTH_USERPOOLID,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
} = process.env;
import { XeroClient } from 'xero-node';
import {
  updateRecord,
  getRecord,
  queryRecords,
  createRecord,
} from 'dependency-layer/dynamoDB';
import { validateIsEntityUser } from 'dependency-layer/entity';
import {
  BankAccountType,
  BankHolderType,
  ContactStatus,
  ContactType,
} from 'dependency-layer/API';
import { initializeXeroClientWithTokenSet } from 'dependency-layer/xero';
import { Contact, EntityType } from 'dependency-layer/API';

enum XeroEventType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

enum XeroEventCategory {
  CONTACT = 'CONTACT',
  INVOICE = 'INVOICE',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

enum XeroTenantType {
  ORGANISATION = 'ORGANISATION',
  PRACTICEMANAGER = 'PRACTICEMANAGER',
  PRACTICE = 'PRACTICE',
}

type XeroEvent = {
  resourceUrl: string;
  resourceId: string;
  tenantId: string;
  tenantType: XeroTenantType;
  eventCategory: XeroEventCategory;
  eventType: XeroEventType;
  eventDateUtc: string;
};

const processInvoiceEvent = async (event: XeroEvent) => {
  console.log('Processing invoice event:', event);
  if (event.eventType === XeroEventType.UPDATE) {
    let task;
    try {
      task = await getRecord(TABLE_TASK ?? '', { id: event.resourceId });
      console.log('Success getting task: ', task);
    } catch (err: any) {
      console.error('Error getting task: ', err);
      throw new Error(err.message);
    }

    if (task) {
      const xeroEventDateUtc = new Date(event.eventDateUtc);
      const taskUpdatedAt = new Date(task.updatedAt);
      if (xeroEventDateUtc <= taskUpdatedAt) {
        console.log('Task already updated');
      } else {
        // get xeroTokenSet
        let xeroTokenSet;
        try {
          const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', {
            id: task.createdBy,
          });
          xeroTokenSet = xeroToken.xeroTokenSet;
          console.log('Success getting tokenSet: ', xeroTokenSet);
        } catch (err: any) {
          console.error('Error getting tokenSet: ', err);
          throw new Error(err.message);
        }

        if (!xeroTokenSet) {
          console.error('No xero token set for user');
          throw new Error('No xero token set for user');
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
              { id: task.createdBy },
              updateTokenParams
            );
            console.log('Success update xero token table: ', xeroToken);
          } catch (err: any) {
            console.error('ERROR update xero token table: ', err);
            throw new Error(err.message);
          }
        }

        // get contact from xero
        let xeroInvoice;
        try {
          const invoiceRes = await xero.accountingApi.getInvoice(
            event.tenantId,
            event.resourceId
          );
          xeroInvoice = invoiceRes.body.invoices?.[0];
          if (!xeroInvoice) {
            console.log('Error getting xero contact: ');
            throw new Error('Error getting xero contact');
          } else {
            console.log('Success getting xero contact: ', xeroInvoice);
          }
        } catch (err: any) {
          console.error('Error getting xero contact: ', err);
          throw new Error(err.message);
        }

        //update contact table
        try {
          const updateTaskParam = {
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
            dueAt: xeroInvoice.dueDate,
            paymentAt: xeroInvoice.payments?.[0]?.date,
            lodgementAt: xeroInvoice.date,
            createdAt: xeroInvoice.updatedDateUTC,
            updatedAt: xeroInvoice.updatedDateUTC,
            paidAt: xeroInvoice.fullyPaidOnDate,
            completedAt: xeroInvoice.fullyPaidOnDate,
            lineItems: xeroInvoice.lineItems,
            __typename: 'TASK',
          };
          const contact = await updateRecord(
            TABLE_TASK ?? '',
            { id: task.id },
            updateTaskParam
          );
          console.log('Success updating task: ', contact);
        } catch (err: any) {
          console.error('Error updating task: ', err);
          throw new Error(err.message);
        }

        //update entity table
        try {
          const updateEntityParam = {
            xeroLastInvoiceSyncAt: event.eventDateUtc,
          };
          const entity = await updateRecord(
            TABLE_ENTITY ?? '',
            { id: task.entityId },
            updateEntityParam
          );
          console.log('Success updating entity: ', entity);
        } catch (err: any) {
          console.error('Error updating entity: ', err);
          throw new Error(err.message);
        }
      }
    }
  } else if (event.eventType === XeroEventType.CREATE) {
    // get contact if exists
    let tasks;
    try {
      tasks = await queryRecords({
        tableName: TABLE_TASK ?? '',
        keys: { xeroTenantId: event.tenantId },
        indexName: 'tasksByXeroTenantId',
        limit: 1,
      });
      console.log('Success quering one task: ', tasks);
    } catch (err: any) {
      console.error('Error quering task: ', err);
      throw new Error(err.message);
    }

    if (!tasks || tasks.length === 0) {
      console.log('No connected admiin entity to xero organisation');
    } else {
      // validate entity user
      let entityUser;
      try {
        entityUser = await validateIsEntityUser({
          entityId: tasks[0].entityId,
          userId: tasks[0].createdBy,
        });
        console.log('Success validate entity user: ', entityUser);
      } catch (err: any) {
        console.error('ERROR validate entity user: ', err);
        throw new Error(err.message);
      }

      // get xeroTokenSet
      let xeroTokenSet;
      try {
        const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', {
          id: entityUser.userId,
        });
        xeroTokenSet = xeroToken.xeroTokenSet;
        console.log('Success getting tokenSet: ', xeroTokenSet);
      } catch (err: any) {
        console.error('Error getting tokenSet: ', err);
        throw new Error(err.message);
      }

      if (!xeroTokenSet) {
        console.log('No xero token set for user');
        return;
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
            { id: entityUser.userId },
            updateTokenParams
          );
          console.log('Success update xero token table: ', xeroToken);
        } catch (err: any) {
          console.error('ERROR update xero token table: ', err);
          throw new Error(err.message);
        }
      }

      // get contact from xero
      let xeroInvoice;
      try {
        const invoiceRes = await xero.accountingApi.getInvoice(
          event.tenantId,
          event.resourceId
        );
        xeroInvoice = invoiceRes.body.invoices?.[0];
        if (!xeroInvoice) {
          console.log('Error getting xero invoice: ');
          throw new Error('Error getting xero invoice');
        } else {
          console.log('Success getting xero contact: ', xeroInvoice);
        }
      } catch (err: any) {
        console.error('Error getting xero contact: ', err);
        throw new Error(err.message);
      }

      // new task param
      const taskParam = {
        entityId: entityUser.entityId,
        xeroTenantId: event.tenantId,
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
        createdBy: entityUser.userId,
        entityIdBy: entityUser.entityId,
        dueAt: xeroInvoice.dueDate,
        paymentAt: xeroInvoice.payments?.[0]?.date,
        lodgementAt: xeroInvoice.date,
        createdAt: xeroInvoice.updatedDateUTC,
        updatedAt: xeroInvoice.updatedDateUTC,
        paidAt: xeroInvoice.fullyPaidOnDate,
        completedAt: xeroInvoice.fullyPaidOnDate,
        lineItems: xeroInvoice.lineItems,
        __typename: 'TASK',
      };

      //create record in contact table
      try {
        const task = await createRecord(TABLE_TASK ?? '', taskParam);
        console.log('Success create task record: ', task);
      } catch (err: any) {
        console.error('ERROR create task table: ', err);
        throw new Error(err.message);
      }

      //update entity table with last contact sync date
      try {
        const updateEntityParams = {
          xeroLastInvoiceSyncAt: event.eventDateUtc,
        };
        const entity = await updateRecord(
          TABLE_ENTITY ?? '',
          { id: entityUser.entityId },
          updateEntityParams
        );
        console.log(
          'Success update entity xeroLastInvoiceSyncAt in xero webhook: ',
          entity
        );
      } catch (err: any) {
        console.error(
          'ERROR update entity xeroLastInvoiceSyncAt in xero webhook: ',
          err
        );
        throw new Error(err.message);
      }
    }
  } else {
    console.log('Unknown event type:', event.eventType);
  }
  return;
};

const processSubscriptionEvent = async (event: XeroEvent) => {
  console.log('Processing supscription event:', event);
  // Todo Implement subscription processing logic
};

const processContactEvent = async (event: XeroEvent) => {
  console.log('Processing contact event:', event);
  if (event.eventType === XeroEventType.UPDATE) {
    let contact;
    try {
      contact = await getRecord(TABLE_CONTACT ?? '', { id: event.resourceId });
      console.log('Success getting contact: ', contact);
    } catch (err: any) {
      console.error('Error getting contact: ', err);
      throw new Error(err.message);
    }

    if (contact) {
      const xeroEventDateUtc = new Date(event.eventDateUtc);
      const contactUpdatedAt = new Date(contact.updatedAt);
      if (xeroEventDateUtc <= contactUpdatedAt) {
        console.log('Contact already updated');
      } else {
        // get xeroTokenSet
        let xeroTokenSet;
        try {
          const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', {
            id: contact.owner,
          });
          xeroTokenSet = xeroToken.xeroTokenSet;
          console.log('Success getting tokenSet: ', xeroTokenSet);
        } catch (err: any) {
          console.error('Error getting tokenSet: ', err);
          throw new Error(err.message);
        }

        if (!xeroTokenSet) {
          console.error('No xero token set for user');
          throw new Error('No xero token set for user');
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
              { id: contact.owner },
              updateTokenParams
            );
            console.log('Success update xero token table: ', xeroToken);
          } catch (err: any) {
            console.error('ERROR update xero token table: ', err);
            throw new Error(err.message);
          }
        }

        // get contact from xero
        let xeroContact;
        try {
          const contactRes = await xero.accountingApi.getContact(
            event.tenantId,
            event.resourceId
          );
          xeroContact = contactRes.body.contacts?.[0];
          if (!xeroContact) {
            console.log('Error getting xero contact: ');
            throw new Error('Error getting xero contact');
          } else {
            console.log('Success getting xero contact: ', xeroContact);
          }
        } catch (err: any) {
          console.error('Error getting xero contact: ', err);
          throw new Error(err.message);
        }

        //update contact table
        try {
          const updateContactParam = {
            entityType: event.tenantType ?? null,
            firstName: xeroContact.firstName ?? null,
            lastName: xeroContact.lastName ?? null,
            email: xeroContact.emailAddress ?? null,
            phone: xeroContact.phones?.[0]?.phoneNumber ?? null,
            name: xeroContact.name ?? null,
            legalName: xeroContact.name ?? null,
            companyName: xeroContact.name ?? null,
            searchName: xeroContact.name ?? null,
            status:
              xeroContact.contactStatus === undefined
                ? ContactStatus.ARCHIVED
                : ContactStatus.ACTIVE,
            updatedAt: event.eventDateUtc,
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
            __typename: 'Contact',
          };
          const contact = await updateRecord(
            TABLE_CONTACT ?? '',
            { id: event.resourceId },
            updateContactParam
          );
          console.log('Success updating contact: ', contact);
        } catch (err: any) {
          console.error('Error updating contact: ', err);
          throw new Error(err.message);
        }

        //update entity table
        try {
          const updateEntityParam = {
            xeroLastContactSyncAt: event.eventDateUtc,
          };
          const entity = await updateRecord(
            TABLE_ENTITY ?? '',
            { id: contact.entityId },
            updateEntityParam
          );
          console.log('Success updating entity: ', entity);
        } catch (err: any) {
          console.error('Error updating entity: ', err);
          throw new Error(err.message);
        }
      }
    }
  } else if (event.eventType === XeroEventType.CREATE) {
    // get contact if exists
    let contacts: Contact[] = [];
    try {
      contacts = await queryRecords({
        tableName: TABLE_CONTACT ?? '',
        keys: { xeroTenantId: event.tenantId },
        indexName: 'contactsByXeroTenantId',
        limit: 1,
      });
      console.log('Success quering one contact: ', contacts);
    } catch (err: any) {
      console.error('Error quering contact: ', err);
      throw new Error(err.message);
    }

    if (!contacts || contacts.length === 0) {
      console.log('No connected admiin entity to xero organisation');
    } else {
      // validate entity user
      try {
        const entityUser = await validateIsEntityUser({
          entityId: contacts[0].entityId,
          userId: contacts[0].owner ?? '',
        });
        console.log('Success validate entity user: ', entityUser);
      } catch (err: any) {
        console.error('ERROR validate entity user: ', err);
        throw new Error(err.message);
      }

      // get xeroTokenSet
      let xeroTokenSet;
      try {
        const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', {
          id: contacts[0].owner,
        });
        xeroTokenSet = xeroToken.xeroTokenSet;
        console.log('Success getting tokenSet: ', xeroTokenSet);
      } catch (err: any) {
        console.error('Error getting tokenSet: ', err);
        throw new Error(err.message);
      }

      if (!xeroTokenSet) {
        console.log('No xero token set for user');
        return;
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
            { id: contacts[0].owner },
            updateTokenParams
          );
          console.log('Success update xero token table: ', xeroToken);
        } catch (err: any) {
          console.error('ERROR update xero token table: ', err);
          throw new Error(err.message);
        }
      }

      // get contact from xero
      let xeroContact;
      try {
        const contactRes = await xero.accountingApi.getContact(
          event.tenantId,
          event.resourceId
        );
        xeroContact = contactRes.body.contacts?.[0];
        if (!xeroContact) {
          console.log('Error getting xero contact: ');
          throw new Error('Error getting xero contact');
        } else {
          console.log('Success getting xero contact: ', xeroContact);
        }
      } catch (err: any) {
        console.error('Error getting xero contact: ', err);
        throw new Error(err.message);
      }

      // new contact param
      const contactParam: Contact = {
        id: xeroContact.contactID ?? '',
        entityId: contacts[0].entityId,
        xeroTenantId: event.tenantId,
        entityType: event.tenantType ?? EntityType.COMPANY,
        firstName: xeroContact.firstName,
        lastName: xeroContact.lastName,
        email: xeroContact.emailAddress,
        phone: xeroContact.phones?.[0]?.phoneNumber ?? null,
        taxNumber: contacts[0].taxNumber,
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
        owner: contacts[0].owner,
        __typename: 'Contact',
      };

      //create record in contact table
      try {
        const contact = await createRecord(TABLE_CONTACT ?? '', contactParam);
        console.log('Success create contact record: ', contact);
      } catch (err: any) {
        console.error('ERROR create contact table: ', err);
        throw new Error(err.message);
      }

      //update entity table with last contact sync date
      try {
        const updateEntityParams = {
          xeroLastContactSyncAt: event.eventDateUtc,
        };
        const entity = await updateRecord(
          TABLE_ENTITY ?? '',
          { id: contacts[0].entityId },
          updateEntityParams
        );
        console.log(
          'Success update entity xeroLastContactSyncAt in xero webhook: ',
          entity
        );
      } catch (err: any) {
        console.error(
          'ERROR update entity xeroLastContactSyncAt in xero webhook: ',
          err
        );
        throw new Error(err.message);
      }
    }
  } else {
    console.log('Unknown event type:', event.eventType);
  }
  return;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  try {
    console.log('Xero Webhook Handler Invoked');
    const eventBody = JSON.parse(event.body || '{}');
    console.log('Parsed Event Body:', eventBody);

    if (eventBody.events && eventBody.events.length > 0) {
      for (const xeroEvent of eventBody.events) {
        switch (xeroEvent.eventCategory) {
          case XeroEventCategory.INVOICE:
            await processInvoiceEvent(xeroEvent);
            break;
          case XeroEventCategory.CONTACT:
            await processContactEvent(xeroEvent);
            break;
          case XeroEventCategory.SUBSCRIPTION:
            await processSubscriptionEvent(xeroEvent);
            break;
          default:
            console.log(`Unhandled event: ${xeroEvent}`);
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Xero Webhook Handler processed successfully',
      }),
    };
  } catch (error: any) {
    console.error('Error in Xero Webhook Handler:', error);
    throw new Error(error.message);
  }
};
