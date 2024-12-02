import { createIndex } from 'dependency-layer/openSearch';
import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  console.log('EVENT RECEIVED: ', event);

  // open search index for entities
  const entityIndexSettings = {
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0,
      analysis: {
        analyzer: {
          default: {
            type: 'standard',
          },
        },
      },
    },
    mappings: {
      properties: {
        id: { type: 'keyword' },
        type: { type: 'keyword' },
        taxNumber: { type: 'keyword' },
        companyNumber: { type: 'keyword' },
        billerCode: { type: 'integer' },
        name: { type: 'text', analyzer: 'default' },
        legalName: { type: 'text', analyzer: 'default' },
        searchName: { type: 'text', analyzer: 'default' },
        owner: { type: 'keyword' },
        status: { type: 'keyword' },
        address: { type: 'object' },
        logo: { type: 'object' },
        gstRegistered: { type: 'boolean' },
        providerEntityId: { type: 'keyword' },
        providerCompanyId: { type: 'keyword' },
        providerBillUserCompanyId: { type: 'keyword' },
        providerBankAccountId: { type: 'keyword' },
        providerDigitalWalletId: { type: 'keyword' },
        providerBpayCrn: { type: 'keyword' },
        contact: { type: 'object' },
        paymentMethodId: { type: 'keyword' },
        paymentUserId: { type: 'keyword' },
        disbursementMethodId: { type: 'keyword' },
        ubosCreated: { type: 'boolean' },
        numUbosCreated: { type: 'integer' },
        subCategory: { type: 'text' },
        clientsStatus: { type: 'keyword' },
        ocrEmail: { type: 'keyword' },
        verificationStatus: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
      },
    },
  };

  try {
    const response = await createIndex('entity', entityIndexSettings);
    console.log('Entity index created: ', response);
  } catch (err: any) {
    if (err.response) {
      console.error('Failed to create entity index', err.response.data);
    } else {
      console.error('Failed to create entity index', err.message);
    }
  }

  const contactIndexSettings = {
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0,
      analysis: {
        analyzer: {
          default: {
            type: 'standard',
          },
        },
      },
    },
    mappings: {
      properties: {
        id: { type: 'keyword' },
        entityId: { type: 'keyword' },
        firstName: { type: 'text', analyzer: 'default' },
        lastName: { type: 'text', analyzer: 'default' },
        email: { type: 'keyword' },
        phone: { type: 'keyword' },
        taxNumber: { type: 'keyword' },
        name: { type: 'text', analyzer: 'default' },
        legalName: { type: 'text', analyzer: 'default' },
        companyName: { type: 'text', analyzer: 'default' },
        searchName: { type: 'text', analyzer: 'default' },
        status: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        contactType: { type: 'keyword' },
        bank: { type: 'object' },
        bpay: { type: 'object' },
        bulkUploadFileKey: { type: 'keyword' },
        owner: { type: 'keyword' },
      },
    },
  };

  try {
    const response = await createIndex('contact', contactIndexSettings);
    console.log('Contact index created: ', response);
  } catch (err) {
    console.error('Failed to create contact index', err);
  }

  const autocompleteResultIndexSettings = {
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0,
      analysis: {
        analyzer: {
          default: {
            type: 'standard',
          },
        },
      },
    },
    mappings: {
      properties: {
        id: { type: 'keyword' },
        value: { type: 'text', analyzer: 'default' },
        label: { type: 'text', analyzer: 'default' },
        info: { type: 'text', analyzer: 'default' },
        type: { type: 'keyword' },
        searchName: { type: 'text', analyzer: 'default' },
        metadata: { type: 'object' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
      },
    },
  };

  try {
    const response = await createIndex(
      'autocomplete-result',
      autocompleteResultIndexSettings
    );
    console.log('Autocomplete Result index created: ', response);
  } catch (err) {
    console.error('Failed to create autocomplete result index', err);
  }
};
