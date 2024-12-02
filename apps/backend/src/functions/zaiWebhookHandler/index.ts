const { TABLE_PAYTO_AGREEMENT } = process.env;
import { PayToAgreement } from 'dependency-layer/API';
import { updateRecord } from 'dependency-layer/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  initZai,
  ZaiAccountsWebhookEvent,
  ZaiBatchTransactionsWebhookEvent,
  ZaiCompanyWebhookEvent,
  ZaiDisbursementWebhookEvent,
  ZaiItemWebhookEvent,
  ZaiPayIdsWebhookEvent,
  ZaiPaytoAgreementWebhook,
  ZaiPayToAgreementWebhookEventType,
  ZaiPaytoPaymentsWebhookEvent,
  ZaiPayToPaymentWebhookEventType,
  ZaiPayToWebhookEvent,
  ZaiTransactionFailureAdviceWebhookEvent,
  ZaiTransactionWebhookEvent,
  ZaiUserWebhookEvent,
  ZaiVirtualAccountWebhookEvent,
} from 'dependency-layer/zai';
import { handleBatchTransactionsEvent } from './batchTransactions';
import { handleItemsEvent } from './items';
import { handleTransactionsEvent } from './transactions';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

interface ZaiWebhookHandlerEvent {
  webhookEvent: {
    payload:
      | ZaiBatchTransactionsWebhookEvent
      | ZaiItemWebhookEvent
      | ZaiUserWebhookEvent
      | ZaiDisbursementWebhookEvent
      | ZaiTransactionWebhookEvent
      | ZaiAccountsWebhookEvent
      | ZaiCompanyWebhookEvent
      | ZaiVirtualAccountWebhookEvent
      | ZaiPayIdsWebhookEvent
      | ZaiPaytoAgreementWebhook
      | ZaiPaytoPaymentsWebhookEvent
      | ZaiTransactionFailureAdviceWebhookEvent
      | ZaiPayToWebhookEvent;
  };
}

const webhookEventHandler = {
  transactions: handleTransactionsEvent,
  batch_transactions: handleBatchTransactionsEvent,
  items: handleItemsEvent,
};

export const handler = async (event: ZaiWebhookHandlerEvent) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const {
    webhookEvent: { payload },
  } = event;

  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  // Handle 'items' webhook event
  // Triggers: Any data changes for that Item. Typically used whenever the state of the object changes.
  if ('items' in payload && payload?.items) {
    await webhookEventHandler['items'](zaiAuthToken, payload);

    // Checking that an Item has had a payment made

    // state => pending. status => 22000. Do this on createPayment or here? maybe updatedAt will be the same

    // state => completed. status => 22500. Task to paid?

    // Checking if a payment has been held

    // Checking if a payment has been refunded
  }

  // Handle 'users' webhook event
  // Triggers: Any data changes for that User. Typically used whenever the state of the object changes.
  //not required
  //else if ('users' in payload && payload?.users) {
  //}

  // Handle 'batch_transactions' webhook event
  // Triggers: On creation of any Batch Transactions and whenever the state changes.
  else if ('batch_transactions' in payload && payload?.batch_transactions) {
    await webhookEventHandler['batch_transactions'](zaiAuthToken, payload);
  }

  // Handle 'accounts' webhook event
  // Triggers: When the state or enabled status of an account changes. This includes creating one and covers all types of accounts (bank, card, wallets...etc). No data can be changed on an existing account.
  // Examples: Checking if a bank account has invalid details, received after a failed disbursement
  else if ('accounts' in payload && payload?.accounts) {
    console.log('ACCOUNTS event: ', payload);
  }

  // Handle 'transactions' webhook event
  // Triggers: On creation of any Transactions and whenever the state changes.
  else if ('transactions' in payload && payload?.transactions) {
    await webhookEventHandler['transactions'](payload);
  }

  // Handle 'disbursements' webhook event
  // Triggers: On creation of any disbursement.
  else if ('disbursements' in payload && payload?.disbursements) {
    console.log('DISBURSEMENTS event: ', payload);

    // Checking that payout has been created for a seller or platform disbursement account
  }

  // Handle 'companies' webhook event
  // Triggers: On creation or change of a company.
  else if ('companies' in payload && payload?.companies) {
    console.log('COMPANIES event: ', payload);

    // Checking if a company's details have changed
  }

  // Handle 'virtual_accounts' webhook event
  // Triggers: When the virtual account status changes from pending_activation to active or pending_activation to activation_failed.
  else if ('virtual_accounts' in payload && payload?.virtual_accounts) {
    console.log('VIRTUAL_ACCOUNTS event: ', payload);

    // Checking if a virtual account's status has changed
  }

  // Handle 'pay_ids' webhook event
  // Triggers: When the PayID status changes from pending_activation to active or pending_activation to activation_failed.
  else if ('pay_ids' in payload && payload?.pay_ids) {
    console.log('PAY_IDS event: ', payload);

    //Checking if PayID status has changed
  }

  // Handle 'payto_agreements' webhook event
  // Triggers: Triggered whenever the agreement status changes.
  // Examples: This notification is triggered whenever the agreement status changes. Example - When the payer approves/rejects the agreement via their banking portal, Zai would notify you about the same.
  //TODO: does this webhook event trigger?
  else if ('payto_agreements' in payload && payload?.payto_agreements) {
    console.log('PAYTO_AGREEMENTS event: ', payload);
  }

  // Handle 'payto_payments' webhook event
  // Triggers: Triggered whenever the payment initiation request status changes.
  // Examples: This notification is triggered whenever the payment initiation request status changes. Example - when the payment initiation requested has been cleared and settled with the payer bank
  //TODO: does this webhook event trigger?
  else if ('payto_payments' in payload && payload?.payto_payments) {
    console.log('PAYTO_PAYMENTS event: ', payload);
  }

  // Handle 'transaction_failure_advice' webhook event
  // Triggers: Triggered whenever funds have been debited from the payer's bank account, however, failed to be matched with the payer's digital wallet in Zai.
  // Examples: This notification is triggered whenever reconciliation of funds (received via PayTo) fails on user's wallet.
  else if (
    'transaction_failure_advice' in payload &&
    payload?.transaction_failure_advice
  ) {
    console.log('TRANSACTION_FAILURE_ADVICE event: ', payload);

    // when the user is in held status in Zai due to any reason
  } else if ('event_type' in payload) {
    // Payment initiation request has completed - funds have been collected from debtor's account
    if (
      payload.event_type ===
      ZaiPayToPaymentWebhookEventType.PAYMENT_INITIATION_COMPLETED
    ) {
      // reconcile payment and potentially task occurs with transaction
      // TODO anything to do here?
      /*
       {
       "webhookEvent": {
       "payload": {
       "event_type": "PAYMENT_INITIATION_COMPLETED",
       "id": "f635e084-a9dd-4fa5-a1de-a1ac03063fe0",
       "original_request": {
       "priority": "UNATTENDED",
       "payment_info": {
       "instructed_amount": "95064",
       "last_payment": false
       }
       },
       "data": {
       "payment_request_uuid": "f635e084-a9dd-4fa5-a1de-a1ac03063fe0",
       "instruction_id": "PRTYAU31XXXI20240426000000000092340",
       "agreement_uuid": "77b463ec-aa23-4427-84a3-86e3b9a42485",
       "agreement_id": "38efd340036b11ef9cfb93cb0abf1f4f",
       "status": "PAYMENT_INITIATION_COMPLETED",
       "status_description": "Payment initiation request has completed - funds have been collected from debtor's account",
       "payment_reconciled": null,
       "created_at": "2024-04-26 01:21:34.445249",
       "updated_at": "2024-04-26 01:21:37.428646",
       "payment_info": {
       "instruction_id": "PRTYAU31XXXI20240426000000000092340",
       "instructed_amount": "95064",
       "last_payment": false
       }
       },
       "message": "SUCCESSFUL"
       }
       }
       }
       */
    }

    // Agreement updates
    else {
      let updatePayToAgreementParams: Partial<PayToAgreement> = {
        status: payload.data.status,
        updatedAt: new Date().toISOString(),
      };
      // PayTo agreement created
      //if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_CREATION_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_ACTIVATION_SUCCESS) {
      //}

      // PayTo agreement rejection
      if (
        payload.event_type ===
        ZaiPayToAgreementWebhookEventType.AGREEMENT_REJECTION_SUCCESS
      ) {
        updatePayToAgreementParams = {
          ...updatePayToAgreementParams,
          statusDescription: payload.data.status_description,
          statusReasonCode: payload.data.status_reason_code,
          statusReasonDescription: payload.data.status_reason_description,
        };
      }

      // paytopayment failed
      if (
        payload.event_type ===
        ZaiPayToPaymentWebhookEventType.PAYMENT_INITIATION_REJECTED
      ) {
        updatePayToAgreementParams = {
          ...updatePayToAgreementParams,
          statusDescription: payload.data.status_description,
          statusReasonCode: payload.data.status_reason_code,
          statusReasonDescription: payload.data.status_reason_description,
        };
      }

      //Payer fails to respond to the agreement authorisation request
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_EXPIRATION_SUCCESS) {
      //}

      // Payer fails to respond to the agreement authorisation request
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_PAUSE_SUCCESS) {
      //}

      // Agreement status change success
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_RESUME_SUCCESS) {
      //}

      //Agreement status change succes
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_CANCELLATION_SUCCESS) {
      //}

      //Unilateral amendment success
      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_AMENDMENT_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_AMENDMENT_REJECTION_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_AMENDMENT_EXPIRATION_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_RECALL_SUCCESS) {
      //}

      //else if (payload.event_type === ZaiPayToWebhookEventType.AGREEMENT_RECALL_REJECTED) {
      //}

      // TODO: updatedAt / ensure not overwriting newer changes.
      if (payload?.data?.agreement_uuid) {
        let updatedPayToAgreementRecord;
        try {
          updatedPayToAgreementRecord = await updateRecord(
            TABLE_PAYTO_AGREEMENT ?? '',
            {
              id: payload.data.agreement_uuid,
            },
            updatePayToAgreementParams
          );

          console.log(
            'updatedPayToAgreementRecord: ',
            updatedPayToAgreementRecord
          );
        } catch (err: any) {
          console.log('ERROR updateRecord: ', err);
        }
      }
    }
  }

  // unhandled webhook event
  else {
    console.log('UNHANDLED WEBHOOK EVENT: ', JSON.stringify(payload));
  }
};
