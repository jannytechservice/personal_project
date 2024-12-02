import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { CreateTaskInput, InvoiceStatus } from '@admiin-com/ds-graphql';
import { useTasks } from '../../hooks/useTasks/useTasks';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useS3MediaUpload } from 'libs/amplify-web/src/lib/components/S3MediaDragDrop/useS3MediaUpload';
import { FILE_TYPES } from '@admiin-com/ds-common';
import ESignature from './ESignature';
import PageSelector from '../PageSelector/PageSelector';
import { useUserId } from '../../hooks/useCurrentUser/useCurrentUser';
import { ESignatureConfirm } from './ESignatureConfirm';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';
import Onboarding from './Onboarding';
import Finish from './Finish';

const ESignatureContainer = () => {
  const [page, setPage] = React.useState<
    'Upload' | 'Signature' | 'Confirm' | 'Finish'
  >('Upload');

  const { t } = useTranslation();

  const annotations = useWatch({ name: 'annotations' });
  const documents = useWatch({ name: 'documents' });
  const [createdTask, setCreatedTask] = React.useState<CreateTaskInput | null>(
    null
  );
  const { reset } = useFormContext();

  const documentUrl = documents?.[0]?.src;
  // const documentUrl = "https://admiindevmedia.s3-accelerate.amazonaws.com/protected/us-east-1%3A08388617-ab19-cd3b-5014-0fd20a0e7a49/6611fd34-678d-4cf2-9083-188fb7200319.pdf?x-amz-content-sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQQOEGC6VQWQI2Z2O%2F20241107%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241107T173353Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIB%2BqXRQv29axHJ26mpGk0Q2z4hfyzoBVbNQEyIUctJsrAiBx2v%2BI%2FEqv2uyVPUTkPpeojojs0Nm6maTXykeJ%2FWzqsSrEBAhLEAAaDDAzNTMwODA1MDM0NyIMrjjGyHMrxKT8A0jSKqEENsNqfRlLIJskW5ehmwza0Z%2FD%2Bht9ZQzF8VkFGPOlYbTFy2hYt%2BcOoY7OChsvrWmzeb8ugc%2F7LfP4%2FGurHaDJgiEAQwY8i28JNRdDYSiWxPkmAe6Wk9O5oXUpay%2BipM6mSUZLMNpDGgFGVptFksXyWNLLgidr40R3rsECECUofqqWeOQ0RyvUs0aLJflqjNkHdIDbE9RwHvWF5CAnT73cQEnErcGA0sw%2FCB%2FM4OK6OKEIIQIJtxYqTOGC7uZWAWXClyOtEXbT4t9iVNKGdhDUzECb4hsaPNhPwQOhjZdXUYsZwGmP9YM2H8OCIO1Pi8eLfTv8B84%2FKPDcNHLLdj%2B82UAhFk3HRsoGzfM%2FgP2YMT58t0OcCtIAeAuW9jdXhtiaRryiW%2FoFUg0njunhC%2BzI8O6aw9uuv2Mq6n9G%2B6UMhpEjTzseEq94Mcp%2FZRHq2naFEZ1q9yikvmOCnnAOFguLvzrhuOQal1witGjDZJW3wOo4T3mmfiIMAlAhxySztMXzUuNWGpmrxv9g8jITjkd4LEZoxd%2FN2imWezQoyNrGiHbJhB8EN6IKGhbFi72QdLg7fhhxEmMmwl0nz715craEy5vjxVaSUv0ATrwfJKJfMxW43Q%2FyTiO4%2FmGpzra%2Ft37dlrnyJ6veUydO7xN%2FMLyR0%2B%2FhpX9FbjC52XKeotBYByku5oBoTV18uZMhU8wx5FNiP1fnJrND8iIKT21%2BDZVbScYwwPOzuQY6hgL1jFptRVJfM%2BikefAKtlHrV99PXiWBIEK%2FkmMgxdSvmNnksWUasuurFG%2Bz2MdtRcrBj5BsIEVgs6QbG4Xjs1HvLzo0LPCQdvSVbbwLxQGoYgm99o8z%2FceyHmhzXikKqu38KOecrpi1PffBmQWJVhYLV8%2BkX9ffb5Vuj8QuTN7Cm6L2Dkm%2FgYcO%2F4arF3QHNKX88uUe7oDiPK2cvrZEgnYjmz0%2F8qS%2BEsn1S37MrmTAvJVk3JlRCC3g3yMs%2BpXqWV4%2FT6JsLV%2BrlWKBr0LTlVqZevb0erWJh0ljgWckO8XO43f0nV1Ds%2BWK4Whk3W1eucrItHjl3pzAYkdQEaLewFqH1z7w95Jk&X-Amz-Signature=f1781c0eeaea29583ac48aefa3a6671a0cc036f9e4ccec0c8535a44c2c7999ca";
  const ref = React.useRef(null);
  const userId = useUserId();
  const { handleConfirm, selectCreateTask, handleDraft, task, taskDirection } =
    useTaskCreationContext();

  React.useEffect(() => {
    if (task) {
      setPage('Signature');
    }
  }, [task]);

  const handleNext = async () => {
    try {
      const createdTask = await handleConfirm(false);
      setCreatedTask(createdTask);
      setPage('Finish');
    } catch (e) {
      console.log(e);
    }
  };
  const gotoDraft = async () => {
    try {
      const createdTask = await handleDraft(false);
      setCreatedTask(createdTask);
      setPage('Finish');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageSelector current={page}>
      <PageSelector.Page value={'Upload'}>
        <Onboarding
          onGetStarted={() => setPage('Signature')}
          title={t('eSignature', { ns: 'taskbox' })}
          description={t('oboardingMessageDescription', { ns: 'taskbox' })}
          buttonTitle={t('uploadADocument', { ns: 'taskbox' })}
        />
      </PageSelector.Page>
      <PageSelector.Page value={'Signature'}>
        {documentUrl && (
          <ESignature
            ref={ref}
            documentUrl={documentUrl}
            userId={userId}
            annotations={annotations}
            handleDraft={async () => {
              setPage('Confirm');
            }}
            handleNext={async () => {
              setPage('Confirm');
            }}
          />
        )}
      </PageSelector.Page>
      <PageSelector.Page value={'Confirm'}>
        <ESignatureConfirm
          ref={ref}
          handleBackToEdit={() => {
            setPage('Signature');
          }}
          handleNext={handleNext}
          handleDraft={gotoDraft}
        />
      </PageSelector.Page>

      <PageSelector.Page value={'Finish'}>
        <Finish
          onGetStarted={() => {
            reset({
              documents: [],
              lineItems: [],
              signers: [],
            });
            setPage('Upload');
          }}
          title={t(
            taskDirection === 'SENDING' ? 'documentSent' : 'documentCreated',
            { ns: 'taskbox' }
          )}
          description={t(
            taskDirection === 'SENDING'
              ? 'documentSentDescription'
              : 'documentCreatedDescription',
            { ns: 'taskbox' }
          )}
          buttonTitle={t('uploadAnotherDocument', { ns: 'taskbox' })}
          onBack={() => selectCreateTask(createdTask)}
        />
      </PageSelector.Page>
    </PageSelector>
  );
};
export default ESignatureContainer;
