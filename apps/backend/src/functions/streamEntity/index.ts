const {
  TABLE_AUTOCOMPLETE_RESULT,
  TABLE_BENEFICIAL_OWNER,
  TABLE_ENTITY,
  TABLE_ENTITY_BENEFICIAL_OWNER,
} = process.env;

import { abrLookupByAbn } from 'dependency-layer/abr';
import {
  BeneficialOwner,
  VerificationStatus,
  EntityType,
  Entity,
} from 'dependency-layer/API';
import { BEEntity } from 'dependency-layer/be.types';
import {
  createRecord,
  updateRecord,
  queryRecords,
} from 'dependency-layer/dynamoDB';
import { FrankieOneEntityTypeMap, initApi } from 'dependency-layer/frankieone';
import {
  AddressObject,
  EntityObject,
  EnumAddressType,
  EnumEntityType,
  EnumKVPType,
} from 'dependency-layer/frankieone/frankieone.types';
import { putOpenSearchItem } from 'dependency-layer/openSearch';
import {
  CreateZaiAuthTokenResponse,
  createZaiCompany,
  createZaiUser,
  CreateZaiUserRequest,
  initZai,
  updateZaiCompany,
  UpdateZaiCompanyRequest,
} from 'dependency-layer/zai';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { generateEntityEmail } from '../../helpers/ocr';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // set zai api auth
  const zaiTokenData = await initZai({ zaiAuthToken, zaiClientSecret });
  zaiAuthToken = zaiTokenData.zaiAuthToken;
  zaiClientSecret = zaiTokenData.zaiClientSecret;

  const frankieOne = initApi();

  for (let i = 0; i < event.Records.length; i++) {
    const data = event.Records[i];

    // record created
    if (data.eventName === 'INSERT' && data?.dynamodb?.NewImage) {
      const entity = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      ) as BEEntity;
      console.log('entity: ', entity);
      let updateEntityParams: Partial<Entity> = {};

      // update ocrEmail is not unique
      let entities;
      entities = await queryRecords({
        tableName: TABLE_ENTITY ?? '',
        keys: {
          ocrEmail: entity.ocrEmail,
        },
        indexName: 'entityByOcrEmail',
        limit: 2,
      });

      if (entities.length > 1) {
        let isUnique = false;
        let ocrEmail;
        while (!isUnique) {
          ocrEmail = generateEntityEmail(entity.name ?? '');
          try {
            entities = await queryRecords({
              tableName: TABLE_ENTITY ?? '',
              keys: {
                ocrEmail: ocrEmail,
              },
              indexName: 'entityByOcrEmail',
              limit: 1,
            });
            isUnique = entities.length === 0;
          } catch (err: any) {
            console.log('ERROR queryRecords: ', err);
            throw new Error(err.message);
          }
        }

        updateEntityParams = {
          ...updateEntityParams,
          ocrEmail,
        };
      }

      // non-individual entity
      let abrDetails;
      if (entity.taxNumber) {
        try {
          abrDetails = await abrLookupByAbn(entity.taxNumber);
          console.log('abrDetails: ', abrDetails);
        } catch (err) {
          console.log('ERROR abrLookupByAbn: ', err);
        }
      }

      if (abrDetails) {
        updateEntityParams = {
          ...updateEntityParams,
          gstRegistered: !!abrDetails?.gst,
        };
      }

      // Create autocomplete result for bpay entities
      if (entity.type === EntityType.BPAY) {
        try {
          const createdAt = new Date().toISOString();
          await createRecord(TABLE_AUTOCOMPLETE_RESULT ?? '', {
            id: entity.id,
            value: entity.id,
            label: entity.name,
            type: 'ENTITY',
            searchName: entity.name.toLowerCase(),
            createdAt,
            metadata: {
              //payoutMethod: entity.type === 'BPAY' ? 'BPAY' : 'EFT',
              subCategory: entity.subCategory,
            },
            updatedAt: createdAt,
            __typename: 'AutocompleteResult',
          });
        } catch (err) {
          console.log('ERROR createRecord TABLE_AUTOCOMPLETE_RESULT: ', err);
        }
      }
      // create frankieone entity for non-individual entity
      else {
        const entityType = FrankieOneEntityTypeMap[entity.type as EntityType];
        const frankieOneEntityParams: EntityObject = {
          //entityId: entity.id,
          entityType,
          entityProfile: 'auto',
          extraData: [
            {
              kvpKey: 'Admiin.entityId',
              kvpValue: entity.id,
              kvpType: EnumKVPType.IdExternal,
            },
            {
              kvpKey: 'customer_reference',
              kvpValue: entity.id,
              kvpType: EnumKVPType.IdExternal,
            },
            {
              kvpKey: 'Admiin.AdmiinVerifyType',
              kvpValue: 'ENTITY',
              kvpType: EnumKVPType.GeneralString,
            },
          ],
          organisationData: {
            registeredName: entity.name,
          },
        };

        if (abrDetails?.abn) {
          frankieOneEntityParams?.extraData?.push({
            kvpKey: 'ABN',
            kvpValue: abrDetails.abn,
            kvpType: EnumKVPType.IdExternal,
          });
        }

        if (abrDetails?.acn) {
          frankieOneEntityParams?.extraData?.push({
            kvpKey: 'ACN',
            kvpValue: abrDetails.acn,
            kvpType: EnumKVPType.IdExternal,
          });
        }

        let createdFrankieOneEntity;
        try {
          console.log('frankieOneEntityParams: ', frankieOneEntityParams);
          createdFrankieOneEntity = await frankieOne.entity.createEntity(
            frankieOneEntityParams
          );
          console.log(
            'createdFrankieOneEntity: ',
            JSON.stringify(createdFrankieOneEntity)
          );
        } catch (err: any) {
          console.log('ERROR createdFrankieOneEntity: ', JSON.stringify(err));
        }

        // update entity with frankieOne entity id
        if (createdFrankieOneEntity?.data.entity.entityId) {
          updateEntityParams = {
            ...updateEntityParams,
            providerEntityId: createdFrankieOneEntity.data.entity.entityId,
          };
        }
      }

      // create zai users for entity
      let zaiUser;
      let zaiBillPayUser;
      const sanitisedEmail =
        entity?.contact?.email?.replace(/\+.+@/, '@') ?? '';
      const [username, domain] = sanitisedEmail.split('@');
      const zaiEmail = `${username}+${entity.id}@${domain}`; // make unique email address for Zai (as email for users must be unique)
      try {
        const zaiUserData: CreateZaiUserRequest = {
          id: entity.id,
          first_name: entity?.contact?.firstName ?? '',
          last_name: entity?.contact?.lastName ?? '',
          email: zaiEmail,
          mobile: entity?.contact?.phone ?? '',
          country: 'AUS',
          ip_address: entity.ipAddress,
          authorized_signer_title: entity?.contact?.role ?? '',
        };

        console.log('zaiUserData: ', zaiUserData);
        const requests = [
          createZaiUser(zaiAuthToken?.access_token, zaiUserData),
          createZaiUser(zaiAuthToken?.access_token, {
            ...zaiUserData,
            id: `${entity.id}_BILLPAY`,
          }),
        ];

        const [zaiUserResponse, zaiBillPayUserResponse] = await Promise.all(
          requests
        );
        console.log('Zai user response: ', zaiUserResponse);
        console.log('Zai bill pay user response: ', zaiBillPayUserResponse);
        zaiUser = zaiUserResponse.users;
        zaiBillPayUser = zaiBillPayUserResponse.users;
        updateEntityParams.paymentUserId = zaiUser.id;
      } catch (err) {
        console.log('ERROR create zai user: ', err);
      }

      // create zai companies
      if (entity.taxNumber && zaiUser?.id && zaiBillPayUser?.id) {
        const companyParams = {
          user_id: zaiUser.id,
          name: entity.name,
          legal_name: entity.name,
          tax_number: entity.taxNumber,
          //charge_tax: false,
          phone: entity?.contact?.phone ?? '',
          country: 'AUS',
        };
        try {
          const requests = [
            createZaiCompany(zaiAuthToken?.access_token, companyParams),
            createZaiCompany(zaiAuthToken?.access_token, {
              ...companyParams,
              user_id: zaiBillPayUser.id,
            }),
          ];
          const [zaiCompanyResponse, zaiBillPayCompanyResponse] =
            await Promise.all(requests);
          console.log('Created Zai company response: ', zaiCompanyResponse);
          console.log(
            'Created Zai bill pay company response: ',
            zaiBillPayCompanyResponse
          );
          updateEntityParams.providerCompanyId =
            zaiCompanyResponse.companies.id;
          updateEntityParams.providerBillUserCompanyId =
            zaiBillPayCompanyResponse.companies.id;
        } catch (err: any) {
          console.log('ERROR create zai company: ', err);
        }
      }

      if (Object.keys(updateEntityParams).length > 0) {
        updateEntityParams = {
          ...updateEntityParams,
          updatedAt: new Date().toISOString(),
        };
        let updatedEntity;
        try {
          updatedEntity = await updateRecord(
            TABLE_ENTITY ?? '',
            { id: entity.id },
            updateEntityParams
          );

          console.log('Updated entity: ', updatedEntity);
        } catch (err: any) {
          console.log('ERROR updateRecord TABLE_ENTITY: ', err);
        }
      }

      try {
        const response = await putOpenSearchItem({
          indexName: 'entity',
          id: entity.id,
          data: entity,
        });
        console.log('response putOpenSearchItem entity: ', response);
      } catch (err) {
        console.error('Failed to index entity', err);
      }
    }

    // record updated
    if (
      data.eventName === 'MODIFY' &&
      data?.dynamodb?.NewImage &&
      data?.dynamodb?.OldImage
    ) {
      const newEntity = unmarshall(
        data.dynamodb.NewImage as { [key: string]: AttributeValue }
      ) as Entity;
      const oldEntity = unmarshall(
        data.dynamodb.OldImage as { [key: string]: AttributeValue }
      ) as Entity;
      console.log('newEntity: ', newEntity);
      console.log('oldEntity: ', oldEntity);

      // update zai company if non-individual and has ABN
      if (
        newEntity.taxNumber &&
        (!oldEntity.address || !oldEntity.address.address1) &&
        newEntity.address &&
        newEntity.providerCompanyId &&
        newEntity.providerBillUserCompanyId
      ) {
        const zaiCompany: UpdateZaiCompanyRequest = {
          name: newEntity.name,
          legal_name: newEntity.name, //TODO: need to collect legal trading name?
          tax_number: newEntity.taxNumber,
          // mobile: newEntity.mobile, //TODO: add user mobile to entity?
          user_id: newEntity.id,
          country: 'AUS',
        };

        if (newEntity.address) {
          zaiCompany.address_line1 = `${
            newEntity.address.unitNumber
              ? `${newEntity.address.unitNumber}/`
              : ''
          }${newEntity.address.streetNumber ?? ''} ${
            newEntity.address.streetName ?? ''
          }`; // newEntity.address.address1; //TODO: NOT CORRECT? Should it be streetNumber + streetName + streetType?
          //zaiEntity.address_line2 = newEntity.address.address2;
          zaiCompany.city = newEntity.address.city;
          zaiCompany.state = newEntity.address.state;
          zaiCompany.zip = newEntity.address.postalCode;
          zaiCompany.country = newEntity.address.country; //TODO: need to collect country code?
        }

        console.log('zaiCompany: ', zaiCompany);
        const requests = [
          updateZaiCompany(
            zaiAuthToken?.access_token,
            newEntity.providerCompanyId,
            zaiCompany
          ),
          updateZaiCompany(
            zaiAuthToken?.access_token,
            newEntity.providerBillUserCompanyId,
            zaiCompany
          ),
        ];

        try {
          const response = await Promise.all(requests);
          console.log('update zai company response: ', response);
        } catch (err) {
          console.log('ERROR updateZaiCompany: ', err);
        }

        //TODO: this is adding address, should it be updating?
        if (
          newEntity.providerEntityId &&
          newEntity.address &&
          !oldEntity.address
        ) {
          // update frankieone entity
          const address: AddressObject = {
            addressId: newEntity.address.addressId ?? '',
            addressType: EnumAddressType.PLACE_OF_BUSINESS,
            streetNumber: newEntity.address.streetNumber ?? '',
            streetName: newEntity.address.streetName,
            streetType: newEntity.address.streetType ?? '',
            town: newEntity.address.city,
            suburb: newEntity.address.city,
            state: newEntity.address.state,
            postalCode: newEntity.address.postalCode,
            country: newEntity.address.country,
          };

          if (newEntity.address.unitNumber) {
            address.unitNumber = newEntity.address.unitNumber;
          }
          const updateFrankieOneEntity: EntityObject = {
            addresses: [address],
          };

          try {
            console.log(
              'updateFrankieOneEntity params: ',
              updateFrankieOneEntity
            );
            const response = await frankieOne.entity.updateEntity(
              newEntity.providerEntityId,
              updateFrankieOneEntity
            );
            console.log('frankieOne.entity.updateEntity response: ', response);
          } catch (err: any) {
            console.log('ERROR updateFrankieOneEntity: ', JSON.stringify(err));
          }
        }
      }

      try {
        const response = await putOpenSearchItem({
          indexName: 'entity',
          id: newEntity.id,
          data: newEntity,
        });
        console.log('response putOpenSearchItem entity: ', response);
      } catch (err) {
        console.error('Failed to index entity', err);
      }
    }
  }
};
