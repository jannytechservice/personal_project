import { batchPut, getRecord } from 'dependency-layer/dynamoDB';
import { CdkCustomResourceEvent, Handler } from 'aws-lambda';

const { TABLE_INCREMENT } = process.env;

export const handler: Handler = async (event: CdkCustomResourceEvent) => {
  console.log('EVENT RECEIVED: ', event);

  let payoutRecord = null;
  try {
    payoutRecord = await getRecord(TABLE_INCREMENT ?? '', { type: 'PAYOUT' });
    console.log('payoutRecord: ', payoutRecord);
  } catch (err: any) {
    console.log('ERROR get payoutRecord', err);
    throw new Error(err.message);
  }

  const params = {
    tableName: TABLE_INCREMENT ?? '',
    items: [
      {
        type: 'PAY_OUT',
        current: 999999,
      },
      {
        type: 'PAY_IN',
        current: 999999,
      },
    ],
  };
  try {
    await batchPut(params);
  } catch (err: any) {
    console.log('ERROR create payoutRecord', err);
    throw new Error(err.message);
  }
};
