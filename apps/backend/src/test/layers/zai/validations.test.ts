import { test } from 'vitest';
import { getTaskSignatureStatus } from 'dependency-layer/task';
import { TaskSignatureStatus, TaskType } from 'dependency-layer/API';

test('returns SIGNED when all annotations are actioned and task type is SIGN_PAY', ({
  expect,
}) => {
  const result = getTaskSignatureStatus({
    type: TaskType.SIGN_PAY,
    annotations: {
      annotations: [
        {
          bbox: [
            86.26343536376953, 32.43292236328125, 129.10174560546875,
            64.55084228515625,
          ],
          contentType: 'image/jpeg',
          createdAt: '1970-01-01T00:00:00Z',
          customData: {
            label: "FRANK's Signature",
            status: 'ACTIONED',
            type: 'SIGNATURE',
            userId: 'd4c86468-9051-7093-63a7-aee9e94c9b58',
            signerType: 'ENTITY_USER',
          },
          flags: ['lockedContents'],
          id: '4d9c9bb5-f385-4abf-865d-5ba6eb26e26b',
          imageAttachmentId:
            '143599918d6295c60e8ad9e82320e7c4d6d88a5ba0d671f0adbf211fa4e1a696',
          name: '01J02NFSDAVHWYJGWQ7DSWQ2YR',
          opacity: 1,
          pageIndex: 1,
          rotation: 0,
          type: 'pspdfkit/image',
          updatedAt: '1970-01-01T00:00:00Z',
          v: 2,
        },
        {
          bbox: [
            341.5281982421875, 50.61993408203125, 93.89218139648438,
            17.60479736328125,
          ],
          borderWidth: 0,
          createdAt: '1970-01-01T00:00:00Z',
          customData: {
            label: 'Date',
            status: 'ACTIONED',
            type: 'DATE',
            userId: 'd4c86468-9051-7093-63a7-aee9e94c9b58',
            signerType: 'ENTITY_USER',
          },
          flags: ['lockedContents'],
          font: 'Helvetica',
          fontColor: '#000000',
          fontSize: 18,
          horizontalAlign: 'left',
          id: '3fe2c18b-2069-4946-b947-7f3c12f67e8a',
          lineHeightFactor: 1.186000108718872,
          name: '01J02NFV0R3CDPD6G3HDEVQKNP',
          opacity: 1,
          pageIndex: 1,
          rotation: 0,
          text: {
            format: 'plain',
            value: '11/06/2024',
          },
          type: 'pspdfkit/text',
          updatedAt: '2024-06-11T03:29:27Z',
          v: 2,
          verticalAlign: 'top',
        },
      ],
      attachments: {
        '143599918d6295c60e8ad9e82320e7c4d6d88a5ba0d671f0adbf211fa4e1a696': {
          binary:
            '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',
          contentType: 'image/png',
        },
      },
      format: 'https://pspdfkit.com/instant-json/v1',
      pdfId: null,
    },
  });
  expect(result).toBe(TaskSignatureStatus.SIGNED);
});

test('returns NOT_SIGNABLE when task type is PAY_ONLY', ({ expect }) => {
  const result = getTaskSignatureStatus({
    type: TaskType.PAY_ONLY,
    annotations: null,
  });
  expect(result).toBe(TaskSignatureStatus.NOT_SIGNABLE);
});

test('returns SIGNED when no annotations are provided and task type is SIGN_PAY', ({
  expect,
}) => {
  const result = getTaskSignatureStatus({
    type: TaskType.SIGN_PAY,
    annotations: null,
  });
  expect(result).toBe(TaskSignatureStatus.SIGNED);
});
