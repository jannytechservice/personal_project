const {
  AUTH_USERPOOLID,
  TABLE_USER,
  TABLE_XERO_TOKEN,
  TABLE_ENTITY,
  TABLE_ENTITY_USER,
  TABLE_CONTACT,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET,
} = process.env;
import { updateRecord, getRecord } from 'dependency-layer/dynamoDB';
import { validateIsEntityUser } from 'dependency-layer/entity';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { XeroClient } from 'xero-node';
import { initializeXeroClientWithTokenSet } from 'dependency-layer/xero';
import { XeroSyncStatus } from 'dependency-layer/API';

export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { entityId } = ctx.arguments.input;
  console.log('sub: ', sub);
  console.log('entityId: ', entityId);

  // get entity user
  try {
    const entityUser = await validateIsEntityUser({ entityId, userId: sub });
    console.log('Success validate entity user: ', entityUser);
  } catch (err: any) {
    console.error('ERROR validate entity user: ', err);
    throw new Error(err.message);
  }

  // get xeroTokenSet
  let xeroTokenSet;
  try {
    const xeroToken = await getRecord(TABLE_XERO_TOKEN ?? '', { id: sub });
    xeroTokenSet = xeroToken.xeroTokenSet;
    console.log('Success getting tokenSet: ', xeroTokenSet);
  } catch (err: any) {
    console.error('Error getting tokenSet: ', err);
    throw new Error(err.message);
  }

  if (!xeroTokenSet) {
    console.log('No xero token set for user');
    return false;
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

  //get xeroTenantId from entity table
  let xeroTenantId;
  try {
    const entity = await getRecord(TABLE_ENTITY ?? '', { id: entityId });
    xeroTenantId = entity.xeroTenantId;
    console.log('Success getting xeroTenantId: ', xeroTenantId);
  } catch (err: any) {
    console.error('Error getting xeroTenantId: ', err);
    throw new Error(err.message);
  }

  //read token set
  let newXeroTokenSet;
  newXeroTokenSet = xero.readTokenSet();

  if (
    xeroTenantId &&
    newXeroTokenSet?.access_token &&
    xero.tenants?.length > 0
  ) {
    try {
      await xero.disconnect(xeroTenantId);
      console.log('Success disconnected from: ', xeroTenantId);
    } catch (err: any) {
      console.error('ERROR disconnect xero: ', err);
      throw new Error(err.message);
    }
  } else {
    console.error('User failed to connect to Xero');
    return false;
  }

  // format the xero related fields from entity record
  try {
    const updateEntityParams = {
      xeroContactSyncStatus: XeroSyncStatus.UNSYNCED,
      xeroLastContactSyncAt: null,
      xeroTenantId: null,
    };
    const rlt = await updateRecord(
      TABLE_ENTITY ?? '',
      { id: entityId },
      updateEntityParams
    );
    console.log('Success update entity: ', rlt);
  } catch (err: any) {
    console.error('ERROR update entity: ', err);
    throw new Error(err.message);
  }

  //update xero token set
  newXeroTokenSet = xero.readTokenSet();
  try {
    const rlt = await updateRecord(
      TABLE_XERO_TOKEN ?? '',
      { id: sub },
      { xeroTokenSet: newXeroTokenSet }
    );
    console.log('Success erase xero token: ', rlt);
  } catch (err: any) {
    console.error('ERROR erase xero token: ', err);
    throw new Error(err.message);
  }
  return true;
};
