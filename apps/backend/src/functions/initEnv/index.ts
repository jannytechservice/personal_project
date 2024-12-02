const { ENV, TABLE_ENTITY, ZAI_WEBHOOK_LISTENER_DOMAIN } = process.env;
const isProd = ENV === 'prod';
import { CreateZaiAuthTokenResponse, initZai } from 'dependency-layer/zai';
import { createZaiFee, listZaiFees } from 'dependency-layer/zai/fee';
import {
  createZaiWebhook,
  createZaiWebhookSecret,
  GetZaiWebhookResponse,
} from 'dependency-layer/zai/webhook';
import { Handler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { createRecord } from 'dependency-layer/dynamoDB';

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;
let zaiWebhookSecret: string;

export const handler: Handler = async (event) => {
  console.log('EVENT RECEIVED: ', event);

  // create zai webhooks - Ensure once completed, to generate a secret key and create it with zai api (via postman or equivalent)
  if (event.trigger === 'ZAI_WEBHOOKS') {
    const zaiTokenData = await initZai({
      zaiAuthToken,
      zaiClientSecret,
      zaiWebhookSecret,
    });
    zaiAuthToken = zaiTokenData.zaiAuthToken;
    zaiClientSecret = zaiTokenData.zaiClientSecret;
    zaiWebhookSecret = zaiTokenData.zaiWebhookSecret;

    if (!zaiWebhookSecret) {
      throw new Error(
        'Zai Webhook Secret not found, cannot create webhook endpoints'
      );
    }
    // create zai webhook secret
    try {
      const response = await createZaiWebhookSecret(
        zaiAuthToken?.access_token,
        {
          secret_key: zaiWebhookSecret,
        }
      );
      console.log('createZaiWebhookSecret response: ', response);
    } catch (err: any) {
      console.log('ERROR createZaiWebhookSecret: ', err);
      throw new Error(err.message);
    }

    // create zai webhooks
    const requests: Promise<GetZaiWebhookResponse>[] = [];
    const endpoints = [
      'accounts',
      'batch_transactions',
      'items',
      // 'users',
      'transactions', //to be notified of incoming funds debited from your user’s bank account and reconciled on the digital wallet that’s associated with the user.
      'disbursements',
      'virtual_accounts',
      'pay_ids',
      'payto_agreements', // to be notified about the agreement status changes
      'payto_payments', // to be notified about payment initiation request status changes.
      'transaction_failure_advice', // to be notified if the PayTo payment reconciliation failed on your user's wallet.
    ];

    const zaiEnv = isProd ? 'prod' : 'dev';
    console.log('ZAI_WEBHOOK_LISTENER_DOMAIN: ', ZAI_WEBHOOK_LISTENER_DOMAIN);

    endpoints.forEach((endpoint) => {
      const request = createZaiWebhook(zaiAuthToken?.access_token, {
        url: `https://${ZAI_WEBHOOK_LISTENER_DOMAIN}` ?? '',
        object_type: endpoint,
        description: `${zaiEnv.toUpperCase()}_${endpoint.toUpperCase()}_WEBHOOK`,
      });

      requests.push(request);
    });

    // create zai webhooks
    try {
      const response = await Promise.all(requests);
      console.log('createZaiWebhook response: ', response);
    } catch (err: any) {
      console.log('ERROR createZaiWebhook promise.all: ', err);
      throw new Error(err.message);
    }
  }

  if (event.trigger === 'ZAI_FEE') {
    // set zai api auth
    const zaiTokenData = await initZai({
      zaiAuthToken,
      zaiClientSecret,
      zaiWebhookSecret,
    });
    zaiAuthToken = zaiTokenData.zaiAuthToken;
    zaiClientSecret = zaiTokenData.zaiClientSecret;
    zaiWebhookSecret = zaiTokenData.zaiWebhookSecret;

    // list fee to make sure it doesn't exist

    let zaiFees = [];
    try {
      const data = await listZaiFees(zaiAuthToken?.access_token, {
        limit: 200,
        offset: 0,
      });
      zaiFees = data.fees;
      console.log('zaiFees: ', zaiFees);
    } catch (err: any) {
      console.log('ERROR listZaiFees: ', err);
      throw new Error(err.message);
    }

    // card 2.2%
    if (!zaiFees.find((fee) => fee.name === 'CARD_220')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'CARD_220',
          fee_type_id: '2',
          amount: 220, // 2.2%
          to: 'buyer',
        });
        console.log('createZaiFee CARD_220 response: ', response);
      } catch (err: any) {
        console.log('ERROR CARD_220 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // card 2.1%
    if (!zaiFees.find((fee) => fee.name === 'CARD_210')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'CARD_210',
          fee_type_id: '2',
          amount: 210, // 2.1%
          to: 'buyer',
        });
        console.log('createZaiFee CARD_210 response: ', response);
      } catch (err: any) {
        console.log('ERROR CARD_210 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // card 2.0%
    if (!zaiFees.find((fee) => fee.name === 'CARD_200')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'CARD_200',
          fee_type_id: '2',
          amount: 200, // 2.0%
          to: 'buyer',
        });
        console.log('createZaiFee CARD_200 response: ', response);
      } catch (err: any) {
        console.log('ERROR CARD_200 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // bank 90 cents
    if (!zaiFees.find((fee) => fee.name === 'BANK_90')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BANK_90',
          fee_type_id: '1',
          amount: 90, // 90 cents
          to: 'buyer',
        });
        console.log('createZaiFee BANK_90 response: ', response);
      } catch (err: any) {
        console.log('ERROR BANK_90 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // bank 60 cents
    if (!zaiFees.find((fee) => fee.name === 'BANK_60')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BANK_60',
          fee_type_id: '1',
          amount: 60, // 60 cents
          to: 'buyer',
        });
        console.log('createZaiFee BANK_90 response: ', response);
      } catch (err: any) {
        console.log('ERROR BANK_90 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // bank 30 cents
    if (!zaiFees.find((fee) => fee.name === 'BANK_30')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BANK_30',
          fee_type_id: '1',
          amount: 30, // 30 cents
          to: 'buyer',
        });
        console.log('createZaiFee BANK_90 response: ', response);
      } catch (err: any) {
        console.log('ERROR BANK_90 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // ato plan 88 dollars
    if (!zaiFees.find((fee) => fee.name === 'ATO_PLAN_88')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'ATO_PLAN_88',
          fee_type_id: '1',
          amount: 8800, // 88 dollars
          to: 'buyer',
        });
        console.log('createZaiFee ATO_PLAN_88 response: ', response);
      } catch (err: any) {
        console.log('ERROR ATO_PLAN_88 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // business plan 2.6%
    if (!zaiFees.find((fee) => fee.name === 'BUSINESS_PLAN_260')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BUSINESS_PLAN_260',
          fee_type_id: '2',
          amount: 260, // 2.6%
          to: 'buyer',
        });
        console.log('createZaiFee BUSINESS_PLAN_260 response: ', response);
      } catch (err: any) {
        console.log('ERROR BUSINESS_PLAN_260 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // installments
  }

  // create bpay companies
  if (event.trigger === 'ZAI_BPAY_COMPANIES') {
    const zaiTokenData = await initZai({
      zaiAuthToken,
      zaiClientSecret,
      zaiWebhookSecret,
    });
    zaiAuthToken = zaiTokenData.zaiAuthToken;
    zaiClientSecret = zaiTokenData.zaiClientSecret;
    zaiWebhookSecret = zaiTokenData.zaiWebhookSecret;
    // https://www.ato.gov.au/individuals-and-families/paying-the-ato/how-to-pay/other-payment-options
    const bpayCompanies = [
      // Existing Australian Tax Office (ATO) entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TAX',
          taxNumber: '51824753556',
          email: 'payment@ato.gov.au',
          name: 'Australian Tax Office (ATO)',
          legalName: 'AUSTRALIAN TAXATION OFFICE',
          address: {
            address1: 'Locked Bag 1936',
            country: 'AUS',
            state: 'NSW',
            postalCode: '1936',
          },
          contact: {
            firstName: 'Australian Tax Office',
            lastName: 'Australian Tax Office',
            phone: '1800815886',
            email: 'payment@ato.gov.au',
          },
          firstName: 'Australian Tax Office',
          lastName: 'Australian Tax Office',
          phone: '1800815886',
          logo: null,
          billerCode: 75556,
          country: 'AUS',
        },
        company: {
          name: 'Australian Tax Office (ATO)',
          legal_name: 'AUSTRALIAN TAXATION OFFICE',
          tax_number: '51824753556',
          address: 'Locked Bag 1936, ALBURY, NSW 1936',
          phone: '1800815886',
          country: 'AUS',
        },
      },
      // New ASIC entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TAX',
          taxNumber: '86768265615',
          email: 'BN.lodgements@asic.gov.au',
          name: 'ASIC',
          legalName: 'AUSTRALIAN SECURITIES AND INVESTMENTS COMMISSION',
          address: {
            address1: 'Locked Bag 5000 Gippsland Mail Centre VIC 3841',
            country: 'AUS',
            state: 'VIC',
            postalCode: '3841',
          },
          contact: {
            firstName: 'ASIC',
            lastName: 'ASIC',
            phone: '1300300630',
            email: 'payment@asic.gov.au',
          },
          firstName: 'ASIC',
          lastName: 'ASIC',
          phone: '1300300630',
          logo: null,
          billerCode: 17301,
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'AUSTRALIAN SECURITIES AND INVESTMENTS COMMISSION',
          legal_name: 'AUSTRALIAN SECURITIES AND INVESTMENTS COMMISSION',
          tax_number: '86768265615',
          address: 'Level 5, 100 Market Street, Sydney NSW 2000',
          phone: '1300300630',
          country: 'AUS',
        },
      },
      // New Waverley Council entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'COUNCIL RATES',
          taxNumber: '12502583608',
          email: 'info@waverley.nsw.gov.au',
          name: 'Waverley Council',
          legalName: 'Waverley Council',
          address: {
            address1: 'Locked Bag W127, Sydney, NSW, 1292',
            country: 'AUS',
            state: 'NSW',
            postalCode: '1292',
          },
          contact: {
            firstName: 'Waverley Council',
            lastName: 'Waverley Council',
            phone: '(02)90838000',
            email: 'info@waverley.nsw.gov.au',
          },
          firstName: 'WAVERLEY COUNCIL',
          lastName: 'WAVERLEY COUNCIL',
          phone: '(02)90838000',
          logo: null,
          billerCode: 1610,
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'Waverley Council',
          legal_name: 'Waverley Council',
          tax_number: '12502583608',
          address: 'Locked Bag W127, Sydney, NSW, 1292',
          phone: '(02)90838000',
          country: 'AUS',
        },
      },
      // New Optus entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TELECOMMUNICATIONS',
          taxNumber: '95088011536',
          email: 'myaccount@optus.com.au',
          name: 'Optus',
          legalName: 'Optus Billing Services Pty. Ltd',
          address: {
            address1: '1 Lyonpark Road Macquarie Park, NSW, 2113',
            country: 'AUS',
            state: 'NSW',
            postalCode: '2113',
          },
          contact: {
            firstName: 'Optus',
            lastName: 'Optus',
            phone: '1800505201',
            email: 'myaccount@optus.com.au',
          },
          firstName: 'Optus',
          lastName: 'Optus',
          phone: '1800505201',
          logo: null,
          billerCode: 959197,
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'Optus',
          legal_name: 'Optus Billing Services Pty. Ltd',
          tax_number: '95088011536',
          address: '1 Lyonpark Road Macquarie Park, NSW, 2113',
          phone: '1800 505 201',
          country: 'AUS',
        },
      },
    ];

    for (let i = 0; i < bpayCompanies.length; i++) {
      const bpayCompany = bpayCompanies[i];
      //const userId = randomUUID();
      const createdAt = new Date().toISOString();
      const entity = {
        ...bpayCompany.entity,
        createdAt,
        updatedAt: createdAt,
      };

      try {
        await createRecord(TABLE_ENTITY ?? '', entity);
      } catch (err: any) {
        console.log('ERROR create entity: ', err);
      }
    }
  }
};
