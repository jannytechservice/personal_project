import { downloadData } from 'aws-amplify/storage';
import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  CSGetSub as GET_SUB,
  getUser as GET_USER,
} from '@admiin-com/ds-graphql';

interface UseUserSignatureReturn {
  userSignatureKey: string;
  getSignatureBlob: (signatureKey?: string) => Promise<Blob>;
}

export const useUserSignature = (): UseUserSignatureReturn => {
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const { data: userData } = useQuery(gql(GET_USER), {
    variables: {
      id: userId,
    },
    skip: !userId,
  });
  const userSignatureKey = useMemo(() => {
    return userData?.getUser?.selectedSignatureKey || '';
  }, [userData]);

  const getSignatureBlob = async (signatureKey = userSignatureKey) => {
    //const urlBlob = await getFromS3Storage(
    //  {
    //    key: signatureKey,
    //    level: 'private',
    //
    //  }
    //  null,
    //  false,
    //  true
    //);

    const { body, eTag } = await downloadData({
      path: ({ identityId }) => `private/${identityId}/${signatureKey}`,
    }).result;

    const urlBlob = await body.blob();

    console.log('urlBlob: ', urlBlob);

    // Check if urlBlob.Body is a ReadableStream and convert it to a Blob
    //let blob;
    //if (urlBlob instanceof Blob) {
    //  blob = urlBlob;
    //}
    //else if (urlBlob instanceof ReadableStream) {
    //  const reader = urlBlob.getReader();
    //  const chunks = [];
    //  let done, value;
    //
    //  while (!done) {
    //    ({ done, value } = await reader.read());
    //    if (value) {
    //      chunks.push(value);
    //    }
    //  }
    //
    //  blob = new Blob(chunks, { type: urlBlob.ContentType });
    //} else {
    //  throw new Error('Unknown Body type received from S3');
    //}

    return urlBlob;
  };

  return { getSignatureBlob, userSignatureKey };
};
