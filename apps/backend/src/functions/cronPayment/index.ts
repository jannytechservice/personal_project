const { TABLE_PAYMENT } = process.env;
import { Payment, PaymentStatus } from 'dependency-layer/API';
import { updateRecord } from 'dependency-layer/dynamoDB';
import {
  CreateZaiAuthTokenResponse,
  createZaiItem,
  CreateZaiItemRequest,
  getPaymentFromToData,
  getZaiItem,
  initZai,
  ItemStatuses,
  makeZaiPayment,
  updateZaiItem,
} from 'dependency-layer/zai';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ScheduledEvent, Handler } from 'aws-lambda';
import { DateTime } from 'luxon';

const DdbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DdbClient);

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

const queryScheduledPayments = async (date: string) => {
  console.log('queryScheduledPayments date: ', date);

  let nextToken = undefined;
  let allItems: (Payment | Record<string, any>)[] = [];

  do {
    const params = {
      TableName: TABLE_PAYMENT,
      IndexName: 'paymentsByStatus',
      KeyConditionExpression: '#status = :status AND #scheduledAt <= :today',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#scheduledAt': 'scheduledAt',
      },
      ExpressionAttributeValues: {
        ':status': PaymentStatus.USER_CONFIRMED,
        ':today': date,
      },
      ExclusiveStartKey: nextToken,
    };

    const command: QueryCommand = new QueryCommand(params);
    const data = await docClient.send(command);
    if (data.Items) {
      allItems = [...allItems, ...data.Items];
    }
    nextToken = data.LastEvaluatedKey;
  } while (nextToken);

  return allItems;
};

export interface TestEvent {
  date: string;
}

export const handler: Handler = async (event: ScheduledEvent | TestEvent) => {
  console.log('Cron Lambda triggered with event:', event);

  let date = DateTime.now().setZone('Australia/Sydney').toISODate() ?? '';
  if ('date' in event) {
    date = (event as TestEvent).date;
  }

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  let payments;
  try {
    payments = await queryScheduledPayments(date);
  } catch (err: any) {
    console.log('ERROR queryScheduledPayments: ', err);
    throw new Error(err.message);
  }

  console.log('scheduled payments: ', payments);

  if (payments?.length > 0) {
    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i] as Payment; //TODO: payment BE type
      console.log('payment: ', payment);

      if (
        !payment.amount ||
        !payment.fromId ||
        !payment.toId ||
        !payment.toType ||
        !payment.fromType
      ) {
        console.log('MISSING MANDATORY PAYMENT FIELDS: ', payment);
      }
      // able to do payment
      else {
        let buyerId,
          sellerId,
          sellerPhone,
          buyerPaymentMethodId,
          customDescriptor;

        try {
          ({
            buyerId,
            sellerId,
            sellerPhone,
            buyerPaymentMethodId,
            customDescriptor,
          } = await getPaymentFromToData(payment));
        } catch (err) {
          //TODO: track in sentry or equivalent. Admiin should be notified in this use case
          console.log('ERROR in getPaymentFromToData: ', err);
          continue; // Skip to the next iteration if an error occurs
        }

        let zaiItem;
        // get zai item
        try {
          const zaiItemData = await getZaiItem(
            zaiAuthToken?.access_token,
            payment.id
          );
          zaiItem = zaiItemData?.items;
        } catch (err: any) {
          console.log('ERROR getZaiItem: ', err);
          //throw new Error(err.message);
        }

        // existing zai item - update it
        if (zaiItem) {
          try {
            const zaiItemData = await updateZaiItem(
              zaiAuthToken?.access_token,
              payment.id,
              {
                amount: payment.amount,
                name: `task: ${payment.taskId}`,
                buyer_id: buyerId,
                seller_id: sellerId,
                custom_descriptor: customDescriptor,
              }
            );
            zaiItem = zaiItemData?.items;
          } catch (err: any) {
            console.log('ERROR updateZaiItem: ', err);
            //throw new Error(err.message);
          }
        }

        // new zai item, create it
        else {
          try {
            const itemParams: CreateZaiItemRequest = {
              id: payment.id,
              name: `task: ${payment.taskId}`,
              amount: payment.amount,
              currency: 'AUD',
              payment_type: 2,
              buyer_id: buyerId,
              seller_id: sellerId,
              custom_descriptor: customDescriptor,
            };

            //TODO: do we need to check payment method id is CARD or BANK and only apply fee, as may update?
            if (payment.feeIds) {
              itemParams.fee_ids = payment.feeIds.join(',');
            }

            console.log('create item params: ', itemParams);

            const zaiItemData = await createZaiItem(
              zaiAuthToken?.access_token,
              itemParams
            );
            zaiItem = zaiItemData?.items;
            console.log('zaiItemData: ', zaiItemData);
          } catch (err: any) {
            console.log('ERROR createZaiItem err: ', err);
            console.log('ERROR createZaiItem err?.errors: ', err?.errors);
            continue;
          }
        }

        console.log('zaiItem: ', zaiItem);
        if (!zaiItem) {
          console.log('NO ZAI ITEM');
        } else {
          let itemPaymentData;
          const itemPaymentParams = {
            account_id: buyerPaymentMethodId,
            ip_address: payment.ipAddress ?? '',
            merchant_phone: sellerPhone,
          };

          try {
            itemPaymentData = await makeZaiPayment(
              zaiAuthToken?.access_token,
              zaiItem.id,
              itemPaymentParams
            );
            console.log('makeZaiPayment data: ', itemPaymentData);
            zaiItem = itemPaymentData?.items;
          } catch (err: any) {
            console.log('ERROR makeZaiPayment: ', JSON.stringify(err));
            //throw new Error(err.message);

            // set payment status to failed, with reason

            const now = DateTime.now().setZone('Australia/Sydney');
            const paymentParams: Partial<Payment> = {
              status: PaymentStatus.DECLINED,
              declinedReason: err?.message ?? 'Scheduled payment declined',
              declinedAt: now.toISO(),
              updatedAt: now.toISO(),
            };

            try {
              await updateRecord(
                TABLE_PAYMENT ?? '',
                { id: zaiItem.id },
                paymentParams
              );
            } catch (err: any) {
              console.log('ERROR update payment record', err);
            }

            continue;
          }

          // UPDATE PAYMENT
          let paymentParams: any = {
            status: ItemStatuses[zaiItem.status],
            updatedAt: zaiItem.updated_at,
          };

          if (zaiItem?.state === 'completed') {
            paymentParams = {
              ...paymentParams,
              amount: zaiItem.total_amount,
              netAmount: zaiItem.net_amount,
              payerFees: zaiItem.buyer_fees,
              totalAmount: zaiItem.total_amount,
              paidAt: new Date().toISOString(),
            };

            try {
              await updateRecord(
                TABLE_PAYMENT ?? '',
                { id: zaiItem.id },
                paymentParams
              );
            } catch (err: any) {
              console.log('ERROR update payment record', err);
            }
          }
        }
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Payment cron job executed successfully' }),
  };
};
