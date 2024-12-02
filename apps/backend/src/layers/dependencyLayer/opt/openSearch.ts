import { sign } from 'aws4';

const { OPENSEARCH_DOMAIN_ENDPOINT } = process.env;

interface Analysis {
  analyzer: {
    [key: string]: {
      type: string;
      tokenizer?: string;
      filter?: string[];
    };
  };
}

interface Mappings {
  properties: {
    [key: string]: {
      type: string;
      analyzer?: string;
    };
  };
}

interface IndexSettings {
  settings: {
    number_of_shards: number;
    number_of_replicas: number;
    analysis?: Analysis;
  };
  mappings?: Mappings;
}

export const createIndex = async (
  indexName: string,
  settings: IndexSettings
) => {
  const endpoint = `https://${OPENSEARCH_DOMAIN_ENDPOINT}/${indexName}`;

  const request = {
    host: OPENSEARCH_DOMAIN_ENDPOINT,
    method: 'PUT',
    path: `/${indexName}`,
    body: JSON.stringify(settings),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  sign(request);

  const response = await fetch(endpoint, request);
  if (!response.ok) {
    throw new Error(`Failed to create index: ${response.statusText}`);
  }

  return response;
};

interface putOpenSearchItem {
  indexName: string;
  id: string;
  data: any;
}

export const putOpenSearchItem = async ({
  indexName,
  id,
  data,
}: putOpenSearchItem) => {
  const endpoint = `https://${OPENSEARCH_DOMAIN_ENDPOINT}/${indexName}/_doc/${id}`;
  const request = {
    host: OPENSEARCH_DOMAIN_ENDPOINT,
    method: 'POST',
    path: `/${indexName}/_doc/${id}`,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('request: ', request);

  sign(request);

  const response = await fetch(endpoint, request);
  if (!response.ok) {
    console.log('Failed to put index document: ', response);
    const errorMessage = await response.text();
    console.log('Error message: ', errorMessage);
    throw new Error(`Failed to put document: ${errorMessage}`);
  }

  return response;
};

export const deleteOpenSearchItem = async ({
  indexName,
  id,
}: {
  indexName: string;
  id: string;
}) => {
  const endpoint = `https://${OPENSEARCH_DOMAIN_ENDPOINT}/${indexName}/_doc/${id}`;
  const request = {
    host: OPENSEARCH_DOMAIN_ENDPOINT,
    method: 'DELETE',
    path: `/${indexName}/_doc/${id}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  sign(request);

  const response = await fetch(endpoint, request);
  if (!response.ok) {
    const errorMessage = await response.text();
    console.log('Error message: ', errorMessage);
    throw new Error(`Failed to delete document: ${errorMessage}`);
  }
  return response;
};

export interface OpenSearchQueryParams {
  indexName: string;
  body: any;
}

export const queryOpenSearch = async ({
  indexName,
  body,
}: OpenSearchQueryParams) => {
  const endpoint = `https://${OPENSEARCH_DOMAIN_ENDPOINT}/${indexName}/_search`;
  const request = {
    host: OPENSEARCH_DOMAIN_ENDPOINT,
    method: 'POST',
    path: `/${indexName}/_search`,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  sign(request);

  const response = await fetch(endpoint, request);
  if (!response.ok) {
    const errorMessage = await response.text();
    console.log('Error message: ', errorMessage);
    throw new Error(`Failed to query document: ${errorMessage}`);
  }

  return response.json();
};
