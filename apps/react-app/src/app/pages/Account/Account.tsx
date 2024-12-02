import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBLink,
  WBSelect,
  WBTextField,
  WBTypography,
  useTheme,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import BusinessForm from '../../components/BusinessForm/BusinessForm';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import MfaForm from '../../components/MfaForm/MfaForm';
import { updateUser as UPDATE_USER } from '@admiin-com/ds-graphql';
import { getUser } from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import React, { useMemo, useState } from 'react';
import CodeVerificationForm from '../../components/CodeVerificationForm/CodeVerificationForm';
import { S3Image } from 'libs/amplify-web/src/lib/components/S3Image/S3Image';
import AddSignatureModal from '../../components/AddSignatureModal/AddSignatureModal';
import RemoveSignatureModal from '../../components/RemoveSignatureModal/RemoveSignatureModal';
import { ConnectDisconnectXero } from '../../components/ConnectDisconnectXero';

interface UserFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  original_phone?: string;
  original_email?: string;
  signature?: string;
  code?: string;
}

const Account = () => {
  const { t } = useTranslation();
  //const [deleteAccount, { error: deleteError }] = useMutation(
  //  gql(DELETE_ACCOUNT)
  //);
  const [showAddSignModal, setShowAddSignModal] = useState<boolean>(false);
  const [showRemoveSignModal, setShowRemoveSignModal] =
    useState<boolean>(false);

  //const onDeleteAccount = async () => {
  //  const confirm = window.confirm(t('confirmDeleteAccount', { ns: 'common' }));
  //
  //  if (confirm) {
  //    try {
  //      await deleteAccount();
  //      client.cache.gc();
  //      navigate(PATHS.signIn, { replace: true });
  //    } catch (err) {
  //      console.log('ERROR delete account: ', err);
  //    }
  //  }
  //};

  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const { data: userData } = useQuery(gql(getUser), {
    variables: {
      id: userId,
    },
    skip: !userId,
  });
  const user = useMemo(() => userData?.getUser || {}, [userData]);

  const methods = useForm<UserFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setValue,
  } = methods;

  const [updateUser, { error: updateError, loading: updating }] = useMutation(
    gql(UPDATE_USER)
  );

  const theme = useTheme();

  console.log('user: ', user);

  const inputs = {
    firstName: {
      label: t('firstNameTitle', { ns: 'common' }),
      name: 'firstName' as const,
      type: 'text',
      placeholder: t('firstNameTitle', { ns: 'common' }),
      defaultValue: '',
      rules: {
        required: t('firstNameRequired', { ns: 'common' }),
      },
    },
    lastName: {
      label: t('lastNameTitle', { ns: 'common' }),
      name: 'lastName' as const,
      type: 'text',
      placeholder: '',
      defaultValue: '',
      rules: {
        required: t('lastNameRequired', { ns: 'common' }),
      },
    },
  };

  const changed =
    !!userData &&
    isDirty &&
    (watch('firstName') !== user.firstName ||
      watch('lastName') !== user.lastName);

  React.useEffect(() => {
    if (user.firstName) {
      setValue('firstName', user.firstName, { shouldValidate: true });
    }
    if (user.lastName) {
      setValue('lastName', user.lastName, { shouldValidate: true });
    }
    if (user.email) {
      setValue('email', user.email, { shouldValidate: true });
      setValue('original_email', user.email, { shouldValidate: true });
    }
    if (user.phone) {
      setValue('phone', user.phone, { shouldValidate: true });
      setValue('original_phone', user.phone, { shouldValidate: true });
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateUser({
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            id: userId,
          },
        },
      });
    } catch (err) {
      console.log('ERROR updating user: ', err);
    }
  };

  return (
    <PageContainer sx={{ p: 0 }}>
      <WBFlex
        flexDirection={'column'}
        justifyContent={'space-between'}
        minHeight="100%"
        p={[3, 5, 8]}
        pt={{ xs: 10, sm: 10, md: 10, lg: 8 }}
        sx={{
          position: 'relative',
          backgroundColor: 'background.paper',
          maxWidth: '100%',
        }}
      >
        <WBTypography variant="h2">
          {t('profileInformationTitle', { ns: 'settings' })}
        </WBTypography>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <WBFlex flexDirection={['column', 'row']}>
              <WBBox flex={1} pr={[0, 3]}>
                <Controller
                  control={control}
                  name={inputs.firstName.name}
                  rules={inputs.firstName.rules}
                  defaultValue={inputs.firstName.defaultValue}
                  render={({ field: { ref, ...field } }) => (
                    <WBTextField
                      {...field}
                      type="text"
                      label={inputs.firstName.label}
                      //placeholder={inputs.firstName.placeholder}
                      error={!!(errors.firstName && errors.firstName.message)}
                      helperText={
                        ((errors.firstName &&
                          errors.firstName.message) as string) || ''
                      }
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
              <WBBox flex={1} pl={[0, 3]}>
                <Controller
                  control={control}
                  name={inputs.lastName.name}
                  rules={inputs.lastName.rules}
                  defaultValue={inputs.lastName.defaultValue}
                  render={({ field: { ref, ...field } }) => (
                    <WBTextField
                      {...field}
                      type={inputs.lastName.type}
                      label={inputs.lastName.label}
                      //placeholder={inputs.lastName.placeholder}
                      error={!!(errors.lastName && errors.lastName.message)}
                      helperText={
                        ((errors.lastName &&
                          errors.lastName.message) as string) || ''
                      }
                      margin="dense"
                    />
                  )}
                />
              </WBBox>
            </WBFlex>
            <WBFlex flexDirection={['column', 'row']}>
              <WBBox flex={1} pr={[0, 3]}>
                <CodeVerificationForm type="email" />
              </WBBox>
              <WBBox flex={1} pl={[0, 3]}>
                <CodeVerificationForm type="phone" />
              </WBBox>
            </WBFlex>
            <WBFlex>
              <Controller
                control={control}
                name="signature"
                render={() => (
                  <WBFlex
                    flex={[1, 0.5]}
                    pr={[0, 6]}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <WBSelect
                      label={t('signature', { ns: 'settings' })}
                      value={user?.selectedSignatureKey ?? ''}
                      onChange={async (e) => {
                        // setValue('selectedSignatureKey', e.target.value);
                        await updateUser({
                          variables: {
                            input: {
                              id: userId,
                              selectedSignatureKey: e.target.value,
                            },
                          },
                          optimisticResponse: {
                            updateUser: {
                              __typename: 'User',
                              ...user,
                              id: userId,
                              selectedSignatureKey: e.target.value,
                            },
                          },
                        });
                      }}
                      options={user?.signatures?.items.map((item: any) => ({
                        value: item.key,
                        label: (
                          <S3Image
                            imgKey={item.key}
                            level={'private'}
                            responsive={false}
                            sx={{
                              maxWidth: ['80px', '180px'],
                              height: 'auto',
                              maxHeight: '40px',
                            }}
                          />
                        ),
                      }))}
                      rightLabel={
                        <WBFlex alignItems={'center'} p={2}>
                          <WBLink
                            variant="body2"
                            color="primary.main"
                            mr={2}
                            underline="always"
                            onClick={() => setShowAddSignModal(true)}
                          >
                            {t('addTitle', { ns: 'common' })}
                          </WBLink>
                          {user?.signatures?.items[0]?.key && (
                            <WBLink
                              variant="body2"
                              color="error.main"
                              underline="always"
                              onClick={() => setShowRemoveSignModal(true)}
                            >
                              {t('deleteTitle', { ns: 'common' })}
                            </WBLink>
                          )}
                          {showAddSignModal && (
                            <AddSignatureModal
                              open={showAddSignModal}
                              handleClose={() => setShowAddSignModal(false)}
                            />
                          )}
                          {showRemoveSignModal && (
                            <RemoveSignatureModal
                              signature={
                                user?.signatures?.items[
                                  user?.signatures?.items?.length - 1
                                ]
                              }
                              open={showRemoveSignModal}
                              handleClose={() => setShowRemoveSignModal(false)}
                            />
                          )}
                        </WBFlex>
                      }
                    />
                  </WBFlex>
                )}
              />
            </WBFlex>
          </form>

          {updateError?.message && (
            <WBAlert
              title={updateError.message}
              severity="error"
              sx={{ my: 2 }}
            />
          )}
        </FormProvider>
        <WBTypography variant="h2" pt={{ xs: 10, lg: 8 }}>
          {t('businessInformationTitle', { ns: 'settings' })}
        </WBTypography>
        <BusinessForm />
        <WBTypography variant="h2" pt={{ xs: 10, lg: 8 }}>
          {t('changePasswordTitle', { ns: 'common' })}
        </WBTypography>
        <ChangePasswordForm />
        <WBTypography variant="h2" pt={{ xs: 10, lg: 8 }}>
          {t('twoFactor', { ns: 'settings' })}
        </WBTypography>
        <MfaForm />
        {changed && (
          <WBFlex
            justifyContent={'center'}
            sx={{ position: 'sticky', bottom: 60, left: 0 }}
          >
            <WBButton
              onClick={handleSubmit(onSubmit)}
              loading={updating}
              sx={{ px: [10, 15], boxShadow: theme.shadows[20] }}
            >
              {t('saveChanges', { ns: 'settings' })}
            </WBButton>
          </WBFlex>
        )}
        <WBTypography variant="h2" pt={{ xs: 10, lg: 8 }}>
          {t('integrations', { ns: 'settings' })}
        </WBTypography>
        <WBBox>
          <ConnectDisconnectXero />
        </WBBox>
      </WBFlex>
    </PageContainer>
  );
};

export default Account;
