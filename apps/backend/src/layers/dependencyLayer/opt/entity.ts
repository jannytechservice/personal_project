import { generate5DigitNumber } from 'dependency-layer/code';
import { getRecord, queryRecords } from 'dependency-layer/dynamoDB';
import { sendEmail } from 'dependency-layer/pinpoint';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
const { OCR_EMAIL_DOMAIN } = process.env;

const DdbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DdbClient);

export const validateIsEntityUser = async ({
  entityId,
  userId,
}: {
  entityId: string;
  userId: string;
}) => {
  const { TABLE_ENTITY_USER } = process.env;
  const params = {
    TableName: TABLE_ENTITY_USER ?? '',
    IndexName: 'entityUsersByEntity',
    Key: {
      entityId,
      userId,
    },
  };

  const command = new GetCommand(params);
  const userData = await docClient.send(command);

  if (!userData.Item) {
    throw new Error('Not authorised to upload for entity');
  }

  return userData.Item ?? null;
};

export const generateEntityEmail = (name: string) => {
  // Convert name to an array and use reduce to filter and accumulate only alphanumeric characters
  const subdomainFriendly = name.split('').reduce((acc, char) => {
    const isAlphanumeric =
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      (char >= '0' && char <= '9');
    return isAlphanumeric ? acc + char.toLowerCase() : acc;
  }, '');

  const uniqueString = generate5DigitNumber();
  return `${subdomainFriendly}_${uniqueString}@${OCR_EMAIL_DOMAIN}`;
};

export const sendEmailEntityUsers = async ({
  entityId,
  templateName,
  templateData,
}: {
  entityId: string;
  templateName: string;
  templateData: Record<any, any>;
}): Promise<any[]> => {
  const { TABLE_ENTITY_USER, FROM_EMAIL, TABLE_USER } = process.env;
  // query entity users by entity
  let entityUsers = [];
  try {
    entityUsers = await queryRecords({
      tableName: TABLE_ENTITY_USER ?? '',
      indexName: 'entityUsersByEntity',
      keys: {
        entityId,
      },
    });

    console.log('entityUsers: ', entityUsers);
  } catch (err: any) {
    console.log('ERROR query entity users: ', err);
  }

  if (entityUsers.length > 0) {
    const emailRequests = [];
    for (let i = 0; i < entityUsers.length; i++) {
      const entityUser = entityUsers[i];
      console.log('entityUser: ', entityUser);

      // get user
      let user;
      try {
        user = await getRecord(TABLE_USER ?? '', {
          id: entityUser.userId,
        });

        console.log('user: ', user);
      } catch (err: any) {
        console.log('ERROR query user: ', err);
      }

      if (user?.email) {
        const request = sendEmail({
          senderAddress: FROM_EMAIL ?? '',
          toAddresses: [user.email],
          templateName,
          templateData: {
            ...templateData,
            user,
          },
        });

        emailRequests.push(request);
      }
    }

    return Promise.all(emailRequests);
  }

  return Promise.all([]);
};
