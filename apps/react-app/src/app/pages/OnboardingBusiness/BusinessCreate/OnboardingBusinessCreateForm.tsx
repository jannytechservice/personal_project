import { gql, useMutation } from '@apollo/client';
import { WBAlert, WBButton, WBFlex, WBForm, WBLink } from '@admiin-com/ds-web';
import React, { useEffect, useState } from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  CreateEntityInput,
  updateEntity as UPDATE_ENTITY,
} from '@admiin-com/ds-graphql';
import { useTheme } from '@mui/material';
import { useOnboardingProcess } from '../../../components/OnboardingContainer/OnboadringContainer';
import EntityCreateForm from '../../../components/EntityCreateForm/EntityCreateForm';

const OnboardingBusinessCreateForm = () => {
  const { t } = useTranslation();

  const methods = useFormContext<{ entity: CreateEntityInput }>();
  const { handleSubmit, watch, setValue } = methods;

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const {
    nextBusiness,
    onboardingEntityId,
    createEntityError,
    createEntityFromOnboarding,
    user,
    isNotOnboarding,
  } = useOnboardingProcess();

  const [updateEntity, { error: updateError }] = useMutation(
    gql(UPDATE_ENTITY)
  );

  useEffect(() => {
    if (user.firstName && !watch('entity.firstName') && !isNotOnboarding) {
      setValue('entity.firstName', user.firstName, { shouldValidate: true });
    }
    if (user.lastName && !watch('entity.lastName') && !isNotOnboarding) {
      setValue('entity.lastName', user.lastName, { shouldValidate: true });
    }
  }, [setValue, user.firstName, user.lastName]);

  const onSubmit = async (data: { entity: CreateEntityInput }) => {
    setLoading(true);
    try {
      let updatedData;
      const input: CreateEntityInput = {
        type: data.entity.type,
        name: data.entity.name,
        firstName: data.entity.firstName,
        lastName: data.entity.lastName,
        isFirm: data.entity.isFirm,
      };
      // if (data.entity.type === EntityType.INDIVIDUAL) {
      //   input.name = `${data.entity.firstName} ${data.entity.lastName}`;
      // }
      if (data.entity.taxNumber) input.taxNumber = data.entity.taxNumber;
      console.log(input);
      if (!onboardingEntityId && !isNotOnboarding) {
        await createEntityFromOnboarding(input);
      } else {
        if (!isNotOnboarding) {
          updatedData = await updateEntity({
            variables: { input: { ...input, id: onboardingEntityId } },
          });
        }
      }
      setLoading(false);
      nextBusiness();
    } catch (err) {
      console.log(
        `error ${onboardingEntityId ? 'updating' : 'create'} entity: `,
        err
      );
      setLoading(false);
    }
  };

  return (
    <WBFlex
      flexDirection="column"
      alignItems="center"
      width={{
        xs: '100%',
        sm: '80%',
        md: '60%',
        lg: '40%',
      }}
    >
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        <FormProvider {...methods}>
          <EntityCreateForm
            isOnboarding={!isNotOnboarding}
            type="ENTITY"
            noAddress
            onAbnLookupStart={() => setDisabled(true)}
            onAbnLookupEnd={() => setDisabled(false)}
          />
        </FormProvider>
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 10,
            },
          }}
          disabled={disabled}
          loading={loading}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>
      {/* {!isNotOnboarding && (
        <WBLink
          variant="body2"
          sx={{ mt: 5 }}
          underline="always"
          color={theme.palette.text.primary}
          onClick={() => {
            if (isNotOnboarding && onFinal) onFinal();
            else finishOnboarding();
          }}
        >
          {t('skip', { ns: 'common' })}
        </WBLink>
      )} */}
      {!isNotOnboarding &&
        (createEntityError?.message || updateError?.message) && (
          <WBAlert
            title={createEntityError?.message ?? updateError?.message}
            severity="error"
            sx={{ my: 2 }}
          />
        )}
    </WBFlex>
  );
};

export default OnboardingBusinessCreateForm;
