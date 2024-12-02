const {
  TABLE_CONTACT,
  TABLE_ENTITY,
  TABLE_INCREMENT,
  TABLE_PAYMENT,
  TABLE_PAYMENT_ACCOUNT,
  TABLE_TASK,
} = process.env;
import {
  Contact,
  Entity,
  FromToType,
  Payment,
  Task,
  TaskDirection,
  TaskStatus,
} from 'dependency-layer/API';
import {
  PaymentAccount,
  PaymentAccountDirection,
  PaymentAccountType,
} from 'dependency-layer/be.types';
import {
  createRecord,
  getRecord,
  incrementRecord,
  queryRecords,
  updateRecord,
} from 'dependency-layer/dynamoDB';
import { sendEmailEntityUsers } from 'dependency-layer/entity';
import {
  CreateBankRequest,
  createBpayAccount,
  CreateBpayAccountRequest,
  CreateZaiAuthTokenResponse,
  createZaiBankAccount,
  getCustomDescriptor,
  getZaiUserWallet,
  GetZaiUserWalletResponse,
  PayoutDetails,
  refundZaiItem,
  ZaiBatchTransactionsWebhookEvent,
} from 'dependency-layer/zai';
import {
  payBpayBill,
  withdrawFunds,
} from 'dependency-layer/zai/walletAccounts';
import { randomUUID } from 'crypto';

interface GetPayoutDetailsData {
  compositeId?: string;
  bankName?: string;
  accountName?: string;
  accountType?: 'savings' | 'checking';
  holderType?: 'personal' | 'business';
  accountNumber?: string;
  routingNumber?: string; // bsb
  billerCode?: number;
  bpayReferenceNumber?: string;
  firstName: string;
  lastName: string;
  name: string;
  legalName: string;
  taxNumber: string;
  //idOwner: string;
  //idOwnerType: string;
}

export const getCreatePayoutDetails = async (
  zaiAuthToken: CreateZaiAuthTokenResponse,
  paymentRecord: Payment
): Promise<PayoutDetails | Record<any, any>> => {
  let entityFromRecord: Entity | null = null;
  let contactFromRecord: Contact | null = null;

  if (!paymentRecord.netAmount && paymentRecord.netAmount !== 0) {
    console.log('PAYOUT_NO_AMOUNT');
    return {};
  }

  // details to do payout
  const payoutDetails: PayoutDetails = {
    payoutMethod: PaymentAccountType.BANK,
    fromEmail: '',
    amount: paymentRecord.netAmount,
    customDescriptor: '',
    reference: '',
    providerAccountId: '',
  };

  // details to create a new paymentAccount record
  const paymentAccountDetails: GetPayoutDetailsData = {
    compositeId: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',

    // Zai mentioned we can just use default values as not validated by bank
    holderType: 'personal',
    accountType: 'checking',

    //billerCode: '',
    bpayReferenceNumber: '',

    firstName: '',
    lastName: '',
    name: '',
    legalName: '',
    taxNumber: '',
    //idOwner: '',
    //idOwnerType: '',
  };

  // GET TASK RECORD
  let taskRecord: Task | null = null;
  try {
    taskRecord = await getRecord(TABLE_TASK ?? '', {
      id: paymentRecord?.taskId,
      entityId: paymentRecord?.entityId,
    });
    console.log('task: ', taskRecord);
    payoutDetails.customDescriptor = getCustomDescriptor({
      name: taskRecord?.reference ?? '',
    });
  } catch (err: any) {
    console.log('ERROR get task: ', err);
  }

  // PAYOUT TO AN ENTITY
  if (paymentRecord?.fromType === FromToType.ENTITY) {
    try {
      entityFromRecord = await getRecord(TABLE_ENTITY ?? '', {
        id: paymentRecord?.fromId,
      });

      console.log('entityFromRecord: ', entityFromRecord);

      if (!entityFromRecord) {
        console.log('NO FROM ENTITY RECORD FOUND');
        return {};
      }

      payoutDetails.fromEmail = entityFromRecord?.contact?.email ?? '';

      // if fromType is entity, currently payout is only to BPAY
      if (taskRecord?.direction === TaskDirection.RECEIVING) {
        payoutDetails.payoutMethod = PaymentAccountType.BPAY;
        paymentAccountDetails.compositeId = `${paymentRecord.sellerId}#${entityFromRecord?.billerCode}#${taskRecord?.bpayReferenceNumber}`;
        paymentAccountDetails.bpayReferenceNumber =
          taskRecord?.bpayReferenceNumber ?? '';
        paymentAccountDetails.billerCode =
          entityFromRecord?.billerCode ?? undefined;
        paymentAccountDetails.firstName =
          entityFromRecord?.contact?.firstName ?? '';
        paymentAccountDetails.lastName =
          entityFromRecord?.contact?.lastName ?? '';
        paymentAccountDetails.name = entityFromRecord?.name ?? '';
        paymentAccountDetails.legalName = entityFromRecord?.legalName ?? '';
        paymentAccountDetails.taxNumber = entityFromRecord?.taxNumber ?? '';
      }

      // if fromType is entity and direction is sending, currently payout is only to BANK
      else if (taskRecord?.direction === TaskDirection.SENDING) {
        payoutDetails.payoutMethod = PaymentAccountType.BANK;
        payoutDetails.providerAccountId =
          entityFromRecord?.disbursementMethodId ?? '';
        //payoutDetails.providerWalletId = entityFromRecord?. ?? ''; // TODO: is this necessary - will need to save to entity on creation of wallet?
      }
    } catch (err: any) {
      console.log('ERROR get entity: ', err);
    }
  }

  // PAYOUT TO A CONTACT - Only for RECEIVING - Paying own bill. We are required to create a paymentAccount record
  else if (paymentRecord?.fromType === FromToType.CONTACT) {
    try {
      contactFromRecord = await getRecord(TABLE_CONTACT ?? '', {
        id: paymentRecord?.fromId,
      });
      console.log('contactFromRecord: ', contactFromRecord);

      if (!contactFromRecord) {
        console.log('NO FROM CONTACT RECORD FOUND');
        return {};
      }

      payoutDetails.fromEmail = contactFromRecord?.email ?? '';
      paymentAccountDetails.firstName = contactFromRecord?.firstName ?? '';
      paymentAccountDetails.lastName = contactFromRecord?.lastName ?? '';
      paymentAccountDetails.name = contactFromRecord?.name ?? '';
      paymentAccountDetails.legalName =
        contactFromRecord?.legalName ?? contactFromRecord?.name ?? '';
      paymentAccountDetails.taxNumber = contactFromRecord?.taxNumber ?? '';

      // BANK PAYOUT - Least costs - see if contact can be paid to bank
      if (
        contactFromRecord?.bank?.accountNumber &&
        contactFromRecord?.bank?.routingNumber
      ) {
        payoutDetails.payoutMethod = PaymentAccountType.BANK;
        paymentAccountDetails.bankName =
          contactFromRecord?.bank?.bankName ?? '';
        paymentAccountDetails.accountName =
          contactFromRecord?.bank?.accountName ?? '';
        paymentAccountDetails.accountNumber =
          contactFromRecord?.bank?.accountNumber ?? '';
        paymentAccountDetails.routingNumber =
          contactFromRecord?.bank?.routingNumber ?? '';
        paymentAccountDetails.compositeId = `${paymentRecord.sellerId ?? ''}#${
          contactFromRecord?.bank?.accountNumber ?? ''
        }#${contactFromRecord?.bank?.routingNumber ?? ''}`;
      }

      // BPAY PAYOUT - otherwise, bpay payout
      else if (contactFromRecord?.bpay?.billerCode) {
        payoutDetails.payoutMethod = PaymentAccountType.BPAY;
        paymentAccountDetails.billerCode =
          contactFromRecord?.bpay?.billerCode ?? undefined;
        paymentAccountDetails.compositeId = `${paymentRecord.sellerId ?? ''}#${
          contactFromRecord?.bpay?.billerCode ?? ''
        }#${taskRecord?.bpayReferenceNumber ?? ''}`;
        paymentAccountDetails.bpayReferenceNumber =
          taskRecord?.bpayReferenceNumber ?? '';
      }

      // NO VALID PAYOUT METHOD - should not happen
      else {
        console.log('NO VALID PAYOUT DETAILS FOR CONTACT: ', contactFromRecord);
        return {};
      }
    } catch (err: any) {
      console.log('ERROR get contact: ', err);
    }
  }

  console.log('payoutAccountDetails: ', paymentAccountDetails);

  if (paymentAccountDetails.compositeId) {
    let paymentAccountRecord;
    try {
      paymentAccountRecord = await queryRecords({
        tableName: TABLE_PAYMENT_ACCOUNT ?? '',
        indexName: 'paymentAccountsByCompositeId',
        keys: {
          compositeId: paymentAccountDetails.compositeId,
        },
      });
      console.log(
        'paymentAccountRecord (may not be defined - if not, we create): ',
        paymentAccountRecord
      );
    } catch (err: any) {
      console.log('ERROR get payment account record: ', err);
    }

    if (paymentAccountRecord?.[0]) {
      // set payout account
      payoutDetails.providerAccountId =
        paymentAccountRecord[0].providerAccountId;
    }

    // create payment account
    else {
      console.log('payoutDetails.payoutMethod: ', payoutDetails.payoutMethod);

      // create bank payout method
      if (payoutDetails.payoutMethod === 'BANK') {
        // create zai bank account
        const bankAccount: CreateBankRequest = {
          account_type: paymentAccountDetails.accountType ?? 'checking', // Zai informed to use default from dev docs
          holder_type: paymentAccountDetails.holderType ?? 'personal', // Zai informed to use default from dev docs
          user_id: paymentRecord.sellerId ?? '',
          bank_name: paymentAccountDetails.bankName ?? '',
          account_number: paymentAccountDetails.accountNumber ?? '',
          routing_number: paymentAccountDetails.routingNumber ?? '',
          account_name: paymentAccountDetails.name ?? '',
          country: 'AUS',
        };

        try {
          const zaiBankAccountData = await createZaiBankAccount(
            zaiAuthToken?.access_token,
            bankAccount
          );
          payoutDetails.providerAccountId =
            zaiBankAccountData?.bank_accounts?.id;
          console.log('zaiBankAccount: ', zaiBankAccountData);
        } catch (err: any) {
          console.log('ERROR create zai bank account: ', err);
        }
      }

      // create bpay payout method
      else if (
        payoutDetails.payoutMethod === 'BPAY' &&
        paymentAccountDetails.billerCode
      ) {
        const bpayParams: CreateBpayAccountRequest = {
          account_name: paymentAccountDetails.name ?? '',
          biller_code: paymentAccountDetails.billerCode ?? undefined,
          bpay_crn: paymentAccountDetails.bpayReferenceNumber ?? '',
          user_id: paymentRecord.sellerId ?? '',
          //country: 'AU'
        };

        console.log('zaiBpayAccount bpay params: ', bpayParams);

        try {
          const zaiBpayAccount = await createBpayAccount(
            zaiAuthToken?.access_token,
            bpayParams
          );
          console.log('zaiBpayAccount: ', zaiBpayAccount);
          payoutDetails.providerAccountId = zaiBpayAccount?.bpay_accounts?.id;
        } catch (err: any) {
          console.log('ERROR create zai bpay account: ', err);
        }
      }

      // create payment account
      const createdAt = new Date().toISOString();
      const paymentAccount: PaymentAccount = {
        provider: 'ZAI',
        paymentAccountType: payoutDetails.payoutMethod,
        id: randomUUID(),
        compositeId: paymentAccountDetails.compositeId,
        direction: PaymentAccountDirection.PAY_OUT,
        //entityId: '',
        //idOwner: '',
        //idOwnerType: undefined,
        //paymentAccountType: undefined,
        providerAccountId: payoutDetails.providerAccountId,
        paymentUserId: paymentRecord.sellerId ?? '',
        billerCode: paymentAccountDetails.billerCode,
        bpayReferenceNumber: paymentAccountDetails.bpayReferenceNumber,
        updatedAt: createdAt,
        createdAt,
      };

      try {
        await createRecord(TABLE_PAYMENT_ACCOUNT ?? '', paymentAccount);
      } catch (err: any) {
        console.log('ERROR create payment account: ', err);
      }
    }
  }
  // update increment table  - update expression current to add + 1
  let referenceRecord: { type: string; current: number } | null = null;
  try {
    referenceRecord = (await incrementRecord({
      tableName: TABLE_INCREMENT ?? '',
      key: {
        type: 'PAY_OUT',
      },
      attributeToUpdate: 'current',
    })) as { type: string; current: number } | null;
    console.log('increment reference record: ', referenceRecord);
    if (referenceRecord?.current) {
      payoutDetails.reference = referenceRecord.current.toString();
    }
  } catch (err: any) {
    console.log('ERROR get incrementRecord', err);
  }

  console.log('payoutDetails: ', payoutDetails);

  return payoutDetails;
};

export const handleBatchTransactionsEvent = async (
  zaiAuthToken: CreateZaiAuthTokenResponse,
  payload: ZaiBatchTransactionsWebhookEvent
) => {
  console.log('BATCH_TRANSACTIONS event: ', JSON.stringify(payload));
  const type = payload?.batch_transactions?.type;
  const typeMethod = payload?.batch_transactions?.type_method;
  const state = payload?.batch_transactions?.state;
  const accountId = payload?.batch_transactions?.account_id;

  // Appears to be a bug in the Zai API, unable to get batch transaction item
  /*
   returns {
   "links": {
   "self": "/items"
   },
   "meta": {
   "limit": 10,
   "offset": 0,
   "total": 0
   }
   }
   */

  //let zaiBatchTransactionItem;
  //try {
  //  const data = await getBatchTransactionItem(
  //    zaiAuthToken?.access_token,
  //    payload?.batch_transactions?.id
  //  );
  //  console.log('data: ', JSON.stringify(data));
  //  zaiBatchTransactionItem = data?.items?.[0];
  //  console.log(
  //    'zaiBatchTransactionItem: ',
  //    JSON.stringify(zaiBatchTransactionItem)
  //  );
  //} catch (err: any) {
  //  console.log('ERROR get zai batch transaction item: ', err);
  //}

  // direct credit payout

  // Checking the status of a direct debit / ACH payment

  // Checking the details of a disbursement for a User or Item

  // initiate a payout to a seller
  //type: payment_funding and type_method: credit_card with a status of successful. Additionally, you will also receive another callback for items with the value of released_amount equal to the value of the item amount.
  if (type === 'payment_funding') {
    if (typeMethod === 'credit_card') {
      if (state === 'successful') {
        // get payment record
        let paymentRecord: Payment | null = null;
        try {
          paymentRecord = await getRecord(TABLE_PAYMENT ?? '', {
            id: accountId,
          });

          console.log('paymentRecord: ', paymentRecord);
        } catch (err: any) {
          console.log('ERROR get payment: ', err);
        }

        if (!paymentRecord) {
          console.log('NO PAYMENT RECORD FOUND');
          return;
        }

        const {
          fromEmail,
          payoutMethod,
          amount,
          customDescriptor,
          reference,
          providerAccountId,
        } = await getCreatePayoutDetails(zaiAuthToken, paymentRecord);

        let zaiUserWallet: GetZaiUserWalletResponse | null = null;
        try {
          zaiUserWallet = await getZaiUserWallet(
            zaiAuthToken?.access_token,
            paymentRecord?.sellerId ?? ''
          );
          console.log('zaiUserWallet: ', zaiUserWallet);
        } catch (err: any) {
          console.log('ERROR get zai user wallet: ', err);
        }

        if (!fromEmail) {
          console.log('NO FROM EMAIL');
          return;
        }

        let task;
        try {
          task = await getRecord(TABLE_TASK ?? '', {
            id: paymentRecord?.taskId,
            entityId: paymentRecord?.entityId,
          });
          console.log('task: ', task);
        } catch (err: any) {
          console.log('ERROR get task: ', err);
        }

        // payout to bpay
        if (payoutMethod === PaymentAccountType.BPAY) {
          if (!providerAccountId || !amount) {
            console.log('BANK - NO ACCOUNT OR AMOUNT');
            return;
          }

          // do payout to zai seller's payment account
          const payBillParams = {
            account_id: providerAccountId,
            amount,
            reference_id: reference,
          };
          console.log('payBillParams: ', payBillParams);

          let payBillData;
          try {
            payBillData = await payBpayBill(
              zaiAuthToken?.access_token,
              providerAccountId ?? '',
              payBillParams
            );
            console.log('payBillData: ', payBillData);
          } catch (err: any) {
            console.log('ERROR payBill: ', JSON.stringify(err));
          }

          // TODO: do something with payment status?
          let updatedPaymentRecord;
          if (payBillData?.disbursements?.id) {
            try {
              updatedPaymentRecord = await updateRecord(
                TABLE_PAYMENT ?? '',
                { id: paymentRecord?.id },
                {
                  disbursementId: payBillData.disbursements.id,
                  payoutReferenceId: reference,
                  paidOutAt: new Date().toISOString(),
                }
              );

              console.log('updatedPaymentRecord: ', updatedPaymentRecord);
            } catch (err: any) {
              console.log('ERROR update payment record', err);
            }
          }
          // failed bpay payout
          else {
            //TODO: handle failed payout to bpay
          }
        }
        // payout to bank account
        else if (payoutMethod === PaymentAccountType.BANK) {
          if (!providerAccountId || !amount) {
            console.log('ERROR: BANK - NO ACCOUNT OR AMOUNT');
            return;
          }

          let zaiUserWallet: GetZaiUserWalletResponse | null = null;
          try {
            zaiUserWallet = await getZaiUserWallet(
              zaiAuthToken?.access_token,
              paymentRecord?.sellerId ?? ''
            );
            console.log('zaiUserWallet: ', zaiUserWallet);
          } catch (err: any) {
            console.log('ERROR get zai user wallet: ', err);
          }

          if (!zaiUserWallet) {
            console.log('NO ZAI USER WALLET');
            return;
          }

          // withdraw funds
          const withdrawFundsParams = {
            account_id: providerAccountId,
            amount: amount,
            custom_descriptor: customDescriptor,
            reference_id: reference,
          };

          let withdrawFundsData;
          try {
            withdrawFundsData = await withdrawFunds(
              zaiAuthToken?.access_token,
              zaiUserWallet?.wallet_accounts?.id ?? '',
              withdrawFundsParams
            );
            console.log('withdrawFundsData: ', withdrawFundsData);
          } catch (err: any) {
            console.log('ERROR withdraw funds: ', err);
          }

          // TODO: also update payment status?
          let updatedPaymentRecord;
          if (withdrawFundsData?.disbursements?.id) {
            try {
              updatedPaymentRecord = await updateRecord(
                TABLE_PAYMENT ?? '',
                { id: paymentRecord?.id },
                {
                  disbursementId: withdrawFundsData.disbursements.id,
                  payoutReferenceId: reference,
                  paidOutAt: new Date().toISOString(),
                }
              );

              console.log('updatedPaymentRecord: ', updatedPaymentRecord);
            } catch (err: any) {
              console.log('ERROR update payment record', err);
            }
          }
        }
      } else {
        console.log('UNHANDLED payment_funding STATE: ', state);
      }
    } else {
      console.log('UNHANDLED payment_funding method: ', typeMethod);
    }
  }

  // disbursement
  else if (type === 'disbursement') {
    console.log('DISBURSEMENT event');
    let refund = false;
    let success = false;

    if (typeMethod === 'bpay') {
      // successful bpay payout
      if (state === 'successful') {
        console.log('SUCCESSFUL bpay disbursement');
        success = true;
      }

      // invalid bpay details for payout
      else if (state === 'invalid_account_details') {
        console.log('FAILED bpay disbursement');
        refund = true;
      }
    } else if (typeMethod === 'bank') {
      // successful bank payout
      if (state === 'successful') {
        console.log('SUCCESSFUL bank disbursement');
        success = true;
      }

      // invalid bank details for payout
      else if (state === 'invalid_account_details') {
        console.log('FAILED bank disbursement');
        refund = true;
      }
    }

    // if payment paid out successfully
    if (success) {
      // can send email notification saying we have paid out funds
    }

    // refund item
    else if (refund && accountId) {
      let paymentRecord: Payment | null = null;
      try {
        paymentRecord = await getRecord(TABLE_PAYMENT ?? '', {
          id: accountId,
        });

        console.log('paymentRecord: ', paymentRecord);
      } catch (err: any) {
        console.log('ERROR get payment: ', err);

        let refundData;
        try {
          refundData = await refundZaiItem(
            zaiAuthToken?.access_token,
            accountId //TODO: check correct item id, documentation not clear and previous issues trying to get cc settlement notification
          );
          console.log('refundData: ', refundData);
        } catch (err: any) {
          console.log('ERROR refund item: ', err);
        }

        //TODO : disable payment method?

        // update task status to draft
        let updatedTask;
        try {
          updatedTask = await updateRecord(
            TABLE_TASK ?? '',
            {
              id: accountId,
              entityId: paymentRecord?.entityId,
            },
            {
              status: TaskStatus.DRAFT,
              refundedAt: new Date().toISOString(),
            }
          );
          console.log('updatedTask: ', updatedTask);
        } catch (err: any) {
          console.log('ERROR update task: ', err);
        }

        // if task direction is receiving, send receiving email

        if (updatedTask) {
          try {
            await sendEmailEntityUsers({
              entityId: paymentRecord?.entityId ?? '',
              templateName:
                updatedTask.direction === TaskDirection.RECEIVING
                  ? 'payment-incorrect-account-details-receiving'
                  : 'payment-incorrect-account-details-sending',
              templateData: {
                task: updatedTask,
                template: {
                  title: `Invoice Payout Failed`,
                  preheader: `Your Invoice Payout Details Are Incorrect`,
                },
              },
            });
          } catch (err: any) {
            console.log('ERROR send email entity users: ', err);
          }
        }
      }
    }
  }
  // get the entity To
  // ZAI comments - Please onboard a separate payout user for each unique CRN + Biller code. Please do not use a single user and attach CRNs to the same user.
};
