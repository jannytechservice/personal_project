import {
  AppSyncIdentityCognito,
  Context,
  DynamoDBPutItemRequest,
  util,
} from '@aws-appsync/utils';
import { Entity, EntityClientsStatus, VerificationStatus } from '../API';
import { dynamodbPutRequest } from '../helpers/dynamodb';
import { toTitleCase } from '../helpers/entity';
import { generateEntityEmail } from '../helpers/ocr';

// creates the entity record
export function request(ctx: Context): DynamoDBPutItemRequest {
  const { sub, claims, sourceIp } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { given_name, family_name, phone_number, email } = claims;

  console.log('sourceIp: ', sourceIp);

  const key = { id: util.autoId() };
  const createdAt = util.time.nowISO8601();
  const ocrEmail = generateEntityEmail(input.name ?? '');
  const ipArray = Array.isArray(sourceIp) ? sourceIp : [sourceIp];
  const ipAddress = ipArray.pop() ?? '';
  const data: Entity = {
    ...input,
    name: toTitleCase(input.name),
    legalName: toTitleCase(input.legalName),
    owner: sub,
    paymentMethodId: null,
    searchName: input.name.toLowerCase() ?? '',
    contact: {
      firstName: given_name || toTitleCase(input.firstName),
      lastName: family_name || toTitleCase(input.lastName),
      email,
      phone: phone_number,
    },
    ubosCreated: null,
    verificationStatus: VerificationStatus.UNCHECKED,
    clientsStatus: input.isFirm
      ? EntityClientsStatus.REVIEW
      : EntityClientsStatus.DISABLED,
    ipAddress, // for initial entity zai user creation
    createdAt,
    updatedAt: createdAt,
    ocrEmail,
    ownerIdentityId: claims['custom:identityId'],
    __typename: 'Entity',
  };

  const condition = {
    id: { attributeExists: false },
  };
  return dynamodbPutRequest({ key, data, condition });
}

export function response(ctx: Context) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
