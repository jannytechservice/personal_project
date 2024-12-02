const { TABLE_DOCUMENT_ANALYSIS } = process.env;
import { DocumentAnalysis } from 'dependency-layer/API';
import { validateIsEntityUser } from 'dependency-layer/entity';
import { AppSyncIdentityCognito } from '@aws-appsync/utils';
import { AppSyncResolverHandler } from 'aws-lambda';
import { getRecord } from 'dependency-layer/dynamoDB';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler: AppSyncResolverHandler<any, any> = async (ctx) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { id } = ctx.arguments; // id is the filekey

  let documentAnalysis: DocumentAnalysis | null = null;
  try {
    documentAnalysis = await getRecord(TABLE_DOCUMENT_ANALYSIS ?? '', { id });
    console.log('documentAnalysis: ', documentAnalysis);
  } catch (err: any) {
    console.log('ERROR get documentAnalysis: ', err);
    throw new Error(err.message);
  }

  if (!documentAnalysis?.id) {
    throw new Error('NO_DOCUMENT_ANALYSIS');
  }

  //let job: Job | null = null;
  //try {
  //  job = await getRecord(TABLE_JOB ?? '', { id });
  //  console.log('job: ', job);
  //} catch (err: any) {
  //  console.log('ERROR get job: ', err);
  //  throw new Error(err.message);
  //}
  //
  //if (!job?.jobId) {
  //  throw new Error('NO_JOB');
  //}

  await validateIsEntityUser({
    entityId: documentAnalysis.entityId,
    userId: sub,
  });

  return documentAnalysis;

  //const input: GetDocumentAnalysisRequest = {
  //  // GetDocumentAnalysisRequest
  //  JobId: job.jobId, // required
  //  //MaxResults: Number("int"),
  //  //NextToken: "STRING_VALUE",
  //};
  //try {
  //  const command = new GetExpenseAnalysisCommand(input);
  //  const response = await textExtract.send(command);
  //  console.log('GetDocumentAnalysisCommand: ', JSON.stringify(response));
  //} catch (err: any) {
  //  console.log('ERROR GetDocumentAnalysisCommand: ', err);
  //  throw new Error(err.message);
  //}
};
