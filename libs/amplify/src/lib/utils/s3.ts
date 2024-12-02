import { TransferProgressEvent } from '@aws-amplify/storage';
import { Cache } from 'aws-amplify/utils';
import { getUrl, uploadData, GetUrlWithPathInput } from 'aws-amplify/storage';
import { remove } from 'aws-amplify/storage';

export type S3Level = 'public' | 'protected' | 'private';

export const uploadToS3Storage: (
  {
    key,
    contentType,
    file,
    level,
  }: {
    key: string;
    contentType: string;
    file: File | Blob;
    level: S3Level;
  },
  progressCallback?: (data: TransferProgressEvent) => void
) => Promise<any> = async (
  {
    key,
    contentType,
    file,
    level = 'protected',
  }: { key: string; contentType: string; file: File | Blob; level: S3Level },
  progressCallback?: (event: TransferProgressEvent) => void
): Promise<object> => {
  const { result } = await uploadData({
    path: ({ identityId }) =>
      level === 'public' ? `${level}/${key}` : `${level}/${identityId}/${key}`,
    data: file,
    options: {
      onProgress: progressCallback,
      contentType,
    },
  });

  console.log('uploadToS3Storage result:', await result);
  return { key };
};

export const getFromS3Storage = async ({
  key,
  level = 'protected',
  identityId,
  byPassCache = false,
}: {
  key: string;
  level?: S3Level;
  identityId?: string | null;
  byPassCache?: boolean;
}): Promise<string | object | any> => {
  let cachedUrl;

  if (!byPassCache && Cache) {
    try {
      cachedUrl = await Cache.getItem(key);
    } catch (err) {
      console.log('get cache url error: ', err);
    }

    // return cached url if it exists
    if (cachedUrl?.url) {
      return cachedUrl?.url;
    }
  }

  //const { tokens } = await fetchAuthSession();
  //const sessionExpiry = tokens?.idToken?.payload.exp; // unix timestamp in seconds
  if (level !== 'public' && !identityId) {
    throw new Error('identityId is required');
  }
  const options: GetUrlWithPathInput = {
    path:
      level === 'public' ? `public/${key}` : `${level}/${identityId}/${key}`,
    options: {
      useAccelerateEndpoint: true,
    },
  };

  const url = await getUrl(options);
  //if (Cache && sessionExpiry) {
  if (Cache && url?.expiresAt) {
    try {
      const unixTimestampInMilliseconds = url?.expiresAt?.getTime();
      await Cache.setItem(key, url, { expires: unixTimestampInMilliseconds }); // unix timestamp in milliseconds
    } catch (err) {
      console.log('error set image cache: ', err);
    }
  }

  const string = url?.url?.toString();
  console.log('urlurlurlurl: ', string);
  return string;
};

/**
 * Delete from S3 Storage
 *
 * @returns {Promise<any>}
 * @param key
 * @param level
 */
export const deleteFromS3Storage = async (
  key: string,
  level: string
): Promise<any> => {
  return remove({
    path: ({ identityId }) =>
      level === 'public' ? `public/${key}` : `${level}/${identityId}/${key}`,
    //path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
  });
};

//import { createS3PresignedUrl } from '../graphql/mutations';
// export async function generatePreSignedURL(key, contentType) {
//   const preSignedPayload = {
//     reqParams: {
//       input: {
//         key: `public/${ key }`,
//         contentType
//       }
//     },
//     mutationToExecute: createS3PresignedUrl
//   };
//
//   console.log('preSignedPayload', preSignedPayload);
//
//   const url = await mutationService(preSignedPayload);
//   return JSON.parse(url.data.createS3PresignedUrl);
// }
