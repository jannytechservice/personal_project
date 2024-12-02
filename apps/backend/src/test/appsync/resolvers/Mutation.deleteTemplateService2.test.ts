import { EvaluateCodeCommandInput } from '@aws-sdk/client-appsync';
import { marshall } from '@aws-sdk/util-dynamodb';
import { readFile } from 'fs/promises';
import { region, userIdentity } from '../../testData';
import { describe, expect, it } from 'vitest';

const file =
  './apps/backend/src/test/appsync/resolvers/bundled/Mutation.deleteTemplateService2.js';

describe('Mutation.deleteTemplateService2', () => {
  const {
    AppSyncClient,
    EvaluateCodeCommand,
  } = require('@aws-sdk/client-appsync');
  const appsync = new AppSyncClient({ region });

  it('should delete template service ', async () => {
    const context = {
      arguments: {
        input: {
          templateId: 'templateId',
          serviceId: 'serviceId1',
        },
      },
      identity: userIdentity,
    };

    const input: EvaluateCodeCommandInput = {
      runtime: { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' },
      code: await readFile(file, { encoding: 'utf8' }),
      context: JSON.stringify(context),
      function: 'request',
    };
    const evaluateCodeCommand = new EvaluateCodeCommand(input);
    const response = await appsync.send(evaluateCodeCommand);
    expect(response?.error).toBeUndefined();

    expect(response.evaluationResult).toBeDefined();

    const result = JSON.parse(response.evaluationResult ?? '{}');
    expect(result.operation).toEqual('DeleteItem');
    expect(result.key).toEqual(marshall(context.arguments.input));
  });
});
