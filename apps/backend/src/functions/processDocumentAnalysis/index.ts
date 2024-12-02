const { AWS_REGION, TABLE_JOB } = process.env;
import {
  Block,
  ExpenseDocument,
  ExpenseField,
  GetDocumentAnalysisCommand,
  GetDocumentAnalysisResponse,
  GetExpenseAnalysisCommand,
  LineItemFields,
  LineItemGroup,
  TextractClient,
} from '@aws-sdk/client-textract';
import { SQSEvent } from 'aws-lambda';
import {
  DocumentAnalysis,
  DocumentAnalysisLineItemInput,
  DocumentAnalysisStatus,
  EntityType,
} from 'dependency-layer/API';
import { appSyncRequest } from 'dependency-layer/appsync';
import { queryRecords } from 'dependency-layer/dynamoDB';
import { updateDocumentAnalysis as UPDATE_DOCUMENT_ANALYSIS } from 'dependency-layer/graphql/mutations';
import { queryOpenSearch } from 'dependency-layer/openSearch';
import { DateTime } from 'luxon';

const textExtract = new TextractClient({ region: AWS_REGION });

const expenseFieldMapping = {
  VENDOR_ABN_NUMBER: 'newContact.taxNumber',
  INVOICE_RECEIPT_ID: 'task.reference',
  DUE_DATE: 'task.dueAt',
  PAYMENT_TERMS: 'task.notes',
  TOTAL: 'task.amount',
  AMOUNT_DUE: 'task.amount',
  SHIPPING_HANDLING_CHARGE: 'task.shippingAmount',
  //DESCRIPTION: 'task.lineItem.description',
  //QUANTITY: 'task.lineItem.quantity',
  //PRICE: 'task.lineItem.price',
  //UNIT_PRICE: 'task.lineItem.unitPrice',
  //PRODUCT_CODE: 'task.lineItem.code'
};

const queryFieldMapping = {
  BANK_BSB: 'payment.bank.routingNumber',
  BANK_ACCOUNT: 'payment.bank.accountNumber',
  BPAY_BILLER: 'payment.bpay.billerCode',
  BPAY_REFERENCE: 'payment.bpay.referenceNumber',
};

interface QueryBlock extends Block {
  Query?: {
    Alias?: string;
  };
}

const setNestedProperty = (
  obj: any,
  path: string,
  value: any = '',
  removeSpace: boolean
) => {
  const keys = path.split('.');
  let current = obj;

  while (keys.length > 1) {
    const key = keys.shift();
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  console.log('path: ', path);
  console.log('removeSpace: ', removeSpace);
  console.log('value: ', value);
  if (removeSpace && value) {
    value = value?.replace(/\s/g, '') ?? '';
  }

  current[keys[0]] = value;
};

const getQueryValue = (
  getResponse: GetDocumentAnalysisResponse,
  alias: string
) => {
  const block = getResponse?.Blocks?.find(
    (block: QueryBlock) =>
      block.BlockType === 'QUERY' && block.Query?.Alias === alias
  );

  if (block) {
    const relationshipIds = block?.Relationships?.[0]?.Ids;
    if (relationshipIds) {
      const relatedBlock = getResponse?.Blocks?.find(
        (block: Block) => block?.Id && relationshipIds?.includes(block.Id)
      );

      if (relatedBlock) {
        //extractedData[queryFieldMapping[alias]] = relatedBlock.Text;
        return relatedBlock.Text;
      }
    } else {
      console.log('Related block not found');
    }
  } else {
    console.log(`${alias} block not found`);
  }

  return null;
};

const convertCurrencyToInteger = (currency: string): number => {
  // Remove any non-numeric characters except the decimal point
  const cleanedString = currency?.replace(/[^0-9.]/g, '');

  // Convert the cleaned string to a float
  const floatValue = parseFloat(cleanedString);

  // Multiply by 100 to get the integer representation in cents
  return Math.round(floatValue * 100);
};

function parseDateToSydneyISO(dateString: string): string {
  console.log('dateString: ', dateString);
  const parsedDate = Date.parse(dateString);
  console.log('parsedDate: ', parsedDate);
  if (isNaN(parsedDate)) {
    return '';
  }

  const sydneyTime =
    DateTime.fromMillis(parsedDate).setZone('Australia/Sydney');
  return sydneyTime.toISODate() ?? '';
}

const extractFileKey = (filePath: string): string => {
  const parts = filePath.split('/');
  return parts[parts.length - 1];
};

export const handler = async (event: SQSEvent) => {
  console.log('event: ', event);
  for (const record of event.Records) {
    console.log('record: ', JSON.stringify(record));

    const body = JSON.parse(record.body);
    console.log('body: ', body);
    const message = JSON.parse(body.Message);
    console.log('message: ', message);

    const fileKey = extractFileKey(message.DocumentLocation.S3ObjectName);

    if (message.Status === 'SUCCEEDED') {
      const extractedData: any = {
        //TODO: refactor to DocumentAnalysis type
        task: null,
        payment: {
          bank: null,
          bpay: null,
        },
        newContact: null,
        //potentialContacts: [],
        matchedEntity: null,
        matchedContact: null,
        expenseStatus: null,
        queryStatus: null,
      };

      const jobId = message.JobId;
      console.log('jobId: ', jobId);
      const getParams = {
        JobId: jobId,
      };
      console.log('getParams: ', getParams);

      let jobRecord;
      try {
        const data = await queryRecords({
          tableName: TABLE_JOB ?? '',
          indexName: 'jobsByJobId',
          keys: { jobId },
          limit: 1,
        });
        jobRecord = data?.[0];
        console.log('ocr job record: ', jobRecord);
      } catch (err: any) {
        console.log('ERROR: query job records: ', err);
        throw new Error(err.message);
      }

      // expense analysis
      if (message.API === 'StartExpenseAnalysis') {
        extractedData.expenseStatus = DocumentAnalysisStatus.SCANNED;
        const getCommand = new GetExpenseAnalysisCommand(getParams);
        console.log('getCommand: ', getCommand);

        try {
          const getResponse = await textExtract.send(getCommand);
          console.log(
            'GetExpenseAnalysis response: ',
            JSON.stringify(getResponse)
          );

          getResponse?.ExpenseDocuments?.forEach((doc: ExpenseDocument) => {
            console.log('ExpenseDocument: ', doc);
            // specific fields
            let abn, total, amount;

            doc?.SummaryFields?.forEach((field: ExpenseField) => {
              switch (field.Type?.Text) {
                case 'VENDOR_ABN_NUMBER':
                  // remove whitespace and hyphens
                  console.log(
                    `${field.Type?.Text}: `,
                    field.ValueDetection?.Text
                  );
                  if (field.ValueDetection?.Text) {
                    abn =
                      field.ValueDetection?.Text?.replace(/\s|-/g, '') ?? '';
                    console.log('abn: ', abn);
                    setNestedProperty(
                      extractedData,
                      expenseFieldMapping[field.Type.Text],
                      abn,
                      true
                    );
                  }
                  break;
                case 'DUE_DATE':
                  console.log(
                    `${field.Type?.Text}: `,
                    field.ValueDetection?.Text
                  );
                  if (field.ValueDetection?.Text) {
                    const date = parseDateToSydneyISO(
                      field.ValueDetection.Text
                    );
                    setNestedProperty(
                      extractedData,
                      expenseFieldMapping[field.Type.Text],
                      date,
                      false
                    );
                  }
                  break;
                case 'TOTAL':
                  console.log(
                    `${field.Type?.Text}: `,
                    field.ValueDetection?.Text
                  );
                  if (field.ValueDetection?.Text) {
                    total = convertCurrencyToInteger(field.ValueDetection.Text);
                    setNestedProperty(
                      extractedData,
                      expenseFieldMapping[field.Type.Text],
                      total,
                      false
                    );
                  }
                  break;
                case 'AMOUNT_DUE':
                  console.log(
                    `${field.Type?.Text}: `,
                    field.ValueDetection?.Text
                  );
                  if (field.ValueDetection?.Text) {
                    amount = convertCurrencyToInteger(
                      field.ValueDetection?.Text
                    );
                    setNestedProperty(
                      extractedData,
                      expenseFieldMapping[field.Type.Text],
                      amount,
                      false
                    );
                  }
                  break;
                case 'SHIPPING_HANDLING_CHARGE':
                  console.log(
                    `${field.Type?.Text}: `,
                    field.ValueDetection?.Text
                  );
                  if (field.ValueDetection?.Text) {
                    const shippingAmount = convertCurrencyToInteger(
                      field.ValueDetection?.Text
                    );
                    setNestedProperty(
                      extractedData,
                      expenseFieldMapping[field.Type.Text],
                      shippingAmount,
                      false
                    );
                  }
                  break;
                case 'INVOICE_RECEIPT_ID':
                case 'PAYMENT_TERMS':
                  console.log(
                    `${field.Type?.Text}: `,
                    field.ValueDetection?.Text
                  );
                  setNestedProperty(
                    extractedData,
                    expenseFieldMapping[field.Type.Text],
                    field.ValueDetection?.Text,
                    false
                  );
                  break;
              }
            });

            // line items
            const lineItems: DocumentAnalysisLineItemInput[] = [];
            doc?.LineItemGroups?.forEach((items: LineItemGroup) => {
              items?.LineItems?.forEach((fields: LineItemFields) => {
                let quantity, description, unitPrice, price, productCode;

                fields?.LineItemExpenseFields?.forEach(
                  (expenseField: ExpenseField) => {
                    console.log('expenseField: ', expenseField);
                    switch (expenseField.Type?.Text) {
                      case 'QUANTITY': {
                        quantity = expenseField?.ValueDetection?.Text;

                        if (quantity && typeof quantity === 'string') {
                          quantity = parseFloat(quantity);
                        }
                        console.log('quantity: ', quantity);
                        break;
                      }
                      case 'ITEM':
                        description = expenseField?.ValueDetection?.Text;
                        console.log('description: ', description);
                        break;
                      case 'UNIT_PRICE':
                        if (expenseField?.ValueDetection?.Text) {
                          unitPrice = convertCurrencyToInteger(
                            expenseField?.ValueDetection?.Text
                          );
                          console.log('unitPrice: ', unitPrice);
                        }
                        break;
                      case 'PRICE':
                        if (expenseField?.ValueDetection?.Text) {
                          price = convertCurrencyToInteger(
                            expenseField?.ValueDetection?.Text
                          );
                          console.log('price: ', price);
                        }
                        break;
                      case 'PRODUCT_CODE':
                        productCode = expenseField?.ValueDetection?.Text;
                        console.log('productCode: ', productCode);
                        break;
                    }
                  }
                );

                console.log('Quantity: ', quantity);
                console.log('Description: ', description);
                console.log('Unit Price: ', unitPrice);
                console.log('price: ', price);

                lineItems.push({
                  quantity,
                  description,
                  unitPrice,
                  price,
                  productCode,
                });
              });
            });

            if (lineItems?.length > 0) {
              if (!extractedData.task) {
                extractedData.task = {};
              }

              extractedData.task.lineItems = lineItems;
            }
          });

          // Process the analysis results as needed
        } catch (err: any) {
          console.log('ERROR GetExpenseAnalysisCommand: ', err);
        }
      }

      // document analysis
      else if (message.API === 'StartDocumentAnalysis') {
        extractedData.queryStatus = DocumentAnalysisStatus.SCANNED;
        const getCommand = new GetDocumentAnalysisCommand(getParams);
        console.log('getCommand: ', getCommand);

        try {
          const getResponse: GetDocumentAnalysisResponse =
            await textExtract.send(getCommand);
          console.log(
            'GetDocumentAnalysis response: ',
            JSON.stringify(getResponse)
          );

          const bpayBiller = getQueryValue(getResponse, 'BPAY_BILLER');
          const bpayReference = getQueryValue(getResponse, 'BPAY_REFERENCE');
          const bankBsb = getQueryValue(getResponse, 'BANK_BSB');
          const bankAccount = getQueryValue(getResponse, 'BANK_ACCOUNT');

          if (bpayBiller && bpayBiller !== bankBsb) {
            //extractedData.payment.bpay.billerCode = bpayBiller;
            setNestedProperty(
              extractedData,
              queryFieldMapping['BPAY_BILLER'],
              bpayBiller,
              true
            );
          }

          if (bpayBiller && bpayBiller !== bankBsb) {
            //extractedData.payment.bpay.referenceNumber = bpayReference;
            setNestedProperty(
              extractedData,
              queryFieldMapping['BPAY_REFERENCE'],
              bpayReference,
              true
            );
          }

          if (bankBsb) {
            //extractedData.payment.bank.routingNumber = bankBsb;
            setNestedProperty(
              extractedData,
              queryFieldMapping['BANK_BSB'],
              bankBsb,
              true
            );
          }

          if (bankAccount) {
            //extractedData.payment.bank.accountNumber = bankAccount;
            setNestedProperty(
              extractedData,
              queryFieldMapping['BANK_ACCOUNT'],
              bankAccount,
              true
            );
          }

          //Object.keys(queryFieldMapping).forEach((alias) => {
          //  const block = getResponse?.Blocks?.find(
          //    (block: QueryBlock) =>
          //      block.BlockType === 'QUERY' && block.Query?.Alias === alias
          //  );
          //
          //  if (block) {
          //    const relationshipIds = block?.Relationships?.[0]?.Ids;
          //    if (relationshipIds) {
          //      const relatedBlock = getResponse?.Blocks?.find((block: Block) =>
          //        relationshipIds?.includes(block.Id)
          //      );
          //
          //      if (relatedBlock) {
          //        //extractedData[queryFieldMapping[alias]] = relatedBlock.Text;
          //        setNestedProperty(
          //          extractedData,
          //          queryFieldMapping[alias],
          //          relatedBlock.Text
          //        );
          //      }
          //    } else {
          //      console.log('Related block not found');
          //    }
          //  } else {
          //    console.log(`${alias} block not found`);
          //  }
          //});
          // Process the analysis results as needed
        } catch (err: any) {
          console.log('ERROR GetDocumentAnalysisCommand: ', err);
        }
      }

      if (extractedData?.payment?.bpay?.billerCode) {
        // query for bpay entity
        const queryBody = {
          query: {
            bool: {
              must: [
                {
                  term: {
                    billerCode: extractedData.payment.bpay.billerCode,
                  },
                },
                {
                  term: {
                    type: EntityType.BPAY,
                  },
                },
              ],
            },
          },
        };

        let response;
        try {
          response = await queryOpenSearch({
            indexName: 'entity',
            body: queryBody,
          });
          console.log('Query result: ', response);

          if (response?.hits?.total?.value > 0) {
            extractedData.matchedEntity = response.hits.hits[0]._source;
          }
        } catch (error) {
          console.error('Failed to query entity index: ', error);
        }
      }

      // query for contact entity
      else if (extractedData?.newContact?.taxNumber) {
        const queryBody = {
          query: {
            bool: {
              must: [
                {
                  term: {
                    entityId: jobRecord.entityId,
                  },
                },
                {
                  term: {
                    taxNumber: extractedData.newContact.taxNumber,
                  },
                },
              ],
            },
          },
        };

        let response;
        try {
          response = await queryOpenSearch({
            indexName: 'contact',
            body: queryBody,
          });
          console.log('Query result: ', response);

          if (response?.hits?.total?.value > 0) {
            extractedData.matchedContact = response.hits.hits[0]._source;
          }
        } catch (error) {
          console.error('Failed to query contact index: ', error);
        }
      }

      console.log('extractedData: ', JSON.stringify(extractedData));

      // update document analysis record with extracted data

      const updateDocumentAnalysisParams: Partial<DocumentAnalysis> = {
        status: DocumentAnalysisStatus.SCANNED, //TODO: need to consider, as 2 different types of analysis occur
        updatedAt: new Date().toISOString(),
      };

      if (extractedData.task) {
        updateDocumentAnalysisParams.task = extractedData.task;
      }

      if (extractedData?.payment?.bpay) {
        updateDocumentAnalysisParams.bpay = extractedData.payment.bpay;
      }

      if (extractedData?.payment?.bank) {
        updateDocumentAnalysisParams.bank = extractedData.payment.bank;
      }

      if (extractedData.matchedEntity) {
        updateDocumentAnalysisParams.matchedEntity =
          extractedData.matchedEntity;
      }

      if (extractedData.matchedContact?.id) {
        updateDocumentAnalysisParams.matchedContactId =
          extractedData.matchedContact.id;
      }

      //if (extractedData.potentialContacts) {
      //  updateDocumentAnalysisParams.potentialContacts =
      //    extractedData.potentialContacts;
      //}

      if (extractedData?.newContact) {
        updateDocumentAnalysisParams.newContact = extractedData.newContact;
      }

      if (extractedData.expenseStatus) {
        updateDocumentAnalysisParams.expenseStatus =
          extractedData.expenseStatus;
      }

      if (extractedData.queryStatus) {
        updateDocumentAnalysisParams.queryStatus = extractedData.queryStatus;
      }

      console.log(
        'update document analysis record params: ',
        JSON.stringify(updateDocumentAnalysisParams)
      );

      //let updatedDocumentAnalysisRecord;
      //try {
      //  updatedDocumentAnalysisRecord = await updateRecord(
      //    TABLE_DOCUMENT_ANALYSIS ?? '',
      //    { id: fileKey },
      //    params
      //  );
      //  console.log(
      //    'updatedDocumentAnalysisRecord: ',
      //    updatedDocumentAnalysisRecord
      //  );
      //} catch (err: any) {
      //  console.log('ERROR: update document analysis record: ', err);
      //  throw new Error(err.message);
      //}

      const input = {
        ...updateDocumentAnalysisParams,
        id: fileKey,
        updatedAt: new Date().toISOString(),
      };
      const body = {
        query: UPDATE_DOCUMENT_ANALYSIS,
        variables: {
          input,
        },
      };

      try {
        const result = await appSyncRequest(body);
        console.log('Updated document analysis: ', result.body);
      } catch (err: any) {
        console.log('ERROR update document analysis: ', err);
      }
    }
  }
};
