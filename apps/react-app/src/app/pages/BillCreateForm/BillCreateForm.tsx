import { DATE_FORMATS, isValidPRN } from '@admiin-com/ds-common';
import {
  PaymentFrequency,
  PaymentType,
  PayoutMethod,
  TaskDirection,
  TaskSettlementStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBCheckbox,
  WBDivider,
  WBDrawer,
  WBFlex,
  WBForm,
  WBIconButton,
  WBSelect,
  WBTextField,
  WBToggleButtonGroup,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  FormControl,
  InputAdornment,
  styled,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AutoCompleteLookup, {
  AutoCompleteDataType,
} from '../../components/AutoCompleteLookup/AutoCompleteLookup';
import {
  useCurrentEntityId,
  useSelectedEntity,
} from '../../hooks/useSelectedEntity/useSelectedEntity';
import {
  BillCreateFormData,
  TaskCreation,
  useTaskCreationContext,
} from '../TaskCreation/TaskCreation';
import { UploadDocuments } from './UploadDocuments';
import NoteTypeSelect, {
  NoteType,
} from '../../components/NoteTypeSelect/NoteTypeSelect';
import PdfPlaceholder from '../../components/PdfPlaceholder/PdfPlaceholder';
import PdfPotraitContainer from '../../components/PdfPotraitContainer/PdfPotraitContainer';
import DueDateSelector from '../../components/DueDateSelector/DueDateSelector';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },

  '&:disabled': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  marginRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  ...theme.typography.body2,
  fontWeight: '600',
  // Add this rule to target the last ToggleButton in the group
  '&:last-child': {
    marginRight: 0,
  },
}));

export function BillCreateForm() {
  const { t } = useTranslation();
  React.useState(false);

  const theme = useTheme();
  const [noteSelection, _setNoteSelection] = React.useState<NoteType>(
    NoteType.TO_SELF
  );

  const { showUpload, setShowUpload, task, setPage, taskDirection } =
    useTaskCreationContext();

  const methods = useFormContext<BillCreateFormData>();
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  // const documents = useWatch({ control, name: 'documents' });
  const to = watch('to');
  const from = watch('from');

  const paymentFrequency = watch('paymentFrequency') || PaymentFrequency.ONCE;
  const isTax = React.useMemo(
    () => (from as any)?.metadata?.subCategory === 'TAX',
    [from]
  );

  const isBpay = React.useMemo(
    () =>
      !isTax &&
      ((to as any)?.metadata?.payoutMethod === PayoutMethod.BPAY ||
        (from as any)?.metadata?.payoutMethod === PayoutMethod.BPAY ||
        (taskDirection === TaskDirection.RECEIVING &&
          from?.bpay?.billerCode &&
          !from.bank.accountName)),
    [isTax, to, from, taskDirection]
  );

  const { entity } = useSelectedEntity();

  const isNoTaxNumber =
    taskDirection === TaskDirection.SENDING &&
    ((!!from && !from?.taxNumber) || (!from && entity && !entity?.taxNumber));

  let fromType: AutoCompleteDataType = 'Entity';
  let toType: AutoCompleteDataType = 'Entity';

  switch (taskDirection) {
    case TaskDirection.SENDING:
      fromType = 'Entity';
      toType = 'Contact';
      break;
    case TaskDirection.RECEIVING:
      fromType = 'ContactsAndVerifiedEntity';
      toType = 'Entity';
      break;
  }
  const type: TaskType = useWatch({
    control,
    name: 'type',
    defaultValue: isNoTaxNumber ? TaskType.SIGN_ONLY : TaskType.PAY_ONLY,
  });
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const inputs = React.useMemo(
    () => ({
      from: {
        label: t('from', { ns: 'taskbox' }),
        name: 'from' as const,
        type: 'text',
        defaultValue:
          taskDirection === TaskDirection.SENDING && entity
            ? entity
            : undefined,
        placeholder:
          taskDirection !== TaskDirection.RECEIVING
            ? t('fromPlaceholder', { ns: 'taskbox' })
            : t('atoOptional', { ns: 'taskbox' }),
        rules: { required: t('fromRequired', { ns: 'taskbox' }) },
      },
      to: {
        label: t('to', { ns: 'taskbox' }),
        name: 'to' as const,
        type: 'text',
        defaultValue:
          taskDirection === TaskDirection.RECEIVING && entity
            ? entity
            : undefined,
        placeholder:
          taskDirection === TaskDirection.RECEIVING
            ? t('fromPlaceholder', { ns: 'taskbox' })
            : t('selectContact', { ns: 'taskbox' }),
        rules: { required: t('toRequired', { ns: 'taskbox' }) },
      },
      type: {
        label: t('type', { ns: 'taskbox' }),
        name: 'type' as const,
        type: 'text',
        placeholder: t('selectOne', { ns: 'taskbox' }),
        defaultValue: isNoTaxNumber ? TaskType.SIGN_ONLY : TaskType.PAY_ONLY,
        rules: { required: t('accountNumberRequired', { ns: 'taskbox' }) },
      },
      settlementStatus: {
        label: t('settlementStatus', { ns: 'taskbox' }),
        name: 'settlementStatus' as const,
        settlementStatus: 'text',
        placeholder: t('selectOne', { ns: 'taskbox' }),
        defaultValue: isTax ? TaskSettlementStatus.PAYABLE : null,
      },
      paymentFrequency: {
        label: t('paymentFrequency', { ns: 'taskbox' }),
        name: 'paymentFrequency' as const,
        type: 'text',
        placeholder: t('selectOption', { ns: 'taskbox' }),
        defaultValue: PaymentFrequency.ONCE,
        rules: { required: t('paymentFrequencyRequired', { ns: 'taskbox' }) },
      },
      gstInclusive: {
        label: t('gstInclusive', { ns: 'taskbox' }),
        name: 'gstInclusive' as const,
        type: 'checkbox',
        placeholder: t('gstInclusivePlaceholder', { ns: 'taskbox' }),
        defaultValue:
          taskDirection === TaskDirection.RECEIVING
            ? true
            : !!from?.gstRegistered,
        rules: {},
      },
      amount: {
        label: t(
          paymentFrequency === PaymentFrequency.ONCE
            ? 'amount'
            : 'amountPerPayment',
          { ns: 'taskbox' }
        ),
        name: 'amount' as const,
        type: 'number',
        placeholder: '1000',
        defaultValue: '',
        rules: {
          validate: {
            pattern: (value: any) =>
              /^\d+(\.\d+)?$/.test(value) ||
              t('amountInValid', { ns: 'taskbox' }),

            greaterThanZero: (value: any) =>
              parseFloat(value) > 0 ||
              t('amountMustBeGreaterThanZero', { ns: 'taskbox' }),
          },
        },
      },
      numberOfPayments: {
        label: t('numberOfPayments', { ns: 'taskbox' }),
        name: 'numberOfPayments' as const,
        type: 'number',
        placeholder: 'e.g. 6',
        defaultValue: 0,
        rules: {
          validate: (value: any) => {
            if (!Number.isInteger(Number(value))) {
              return t('numberPaymentsMustBeInteger', { ns: 'taskbox' });
            }
            if (value < 2 || value > 24) {
              return t('numberPaymentsMinMax', { ns: 'taskbox' });
            }
            return true;
          },
        },
      },
      dueAt: {
        label: t('dueAt', { ns: 'taskbox' }),
        name: 'amount' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules: { required: t('dueAtRequired', { ns: 'taskbox' }) },
      },
      lodgementAt: {
        label: t('lodgementAt', { ns: 'taskbox' }),
        name: 'lodgementAt' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules: isTax
          ? {
              required: t('lodgementAtRequired', { ns: 'taskbox' }),
            }
          : {},
      },
      paymentAt: {
        label: t('paymentAt', { ns: 'taskbox' }),
        name: 'paymentAt' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules:
          isTax && type !== TaskType.SIGN_ONLY
            ? {
                required: t('paymentAtRequired', { ns: 'taskbox' }),
              }
            : {},
      },
      firstPaymentAt: {
        label: t('firstPaymentAt', { ns: 'taskbox' }),
        name: 'firstPaymentAt' as const,
        type: 'date',
        placeholder: DATE_FORMATS.USER_DATE,
        defaultValue: '',
        rules: {
          required: t('firstPaymentAtRequired', { ns: 'taskbox' }),
        },
      },
      referenceNumber: {
        label: t(
          type === TaskType.SIGN_ONLY ? 'documentName' : 'referenceNumber',
          {
            ns: 'taskbox',
          }
        ),
        name: 'reference' as const,
        type: 'text',
        placeholder: `${
          isTax
            ? 'BAS JAN-MAR 2024'
            : type === TaskType.SIGN_ONLY
            ? 'Non-Disclosure Agreement'
            : 'INV34356'
        } `,
        defaultValue: undefined,
        rules: {
          validate: {
            referenceIsRequired: (value: string) => {
              if (!value && isTax) {
                return t('taxReferenceRequired', { ns: 'taskbox' });
              } else if (!value) {
                return t('referenceRequired', { ns: 'taskbox' });
              }
              //else if (
              //  type !== TaskType.SIGN_ONLY &&
              //  value &&
              //  value.length > 18
              //) {
              //  return t('referenceTooLong', { ns: 'taskbox', max: 18 });
              //}

              //TODO: disabled for now - implemented to prevent invalid reference on bank statement. Can do with solution with string replace on server - Zai
              //else if (!/^[a-zA-Z0-9\s.\-():]+$/.test(value)) {
              //  return t('invalidReferenceCharacter', { ns: 'taskbox' });
              //}

              return true;
            },
          },
        },
      },
      bpayReferenceNumber: {
        label: t(isTax ? 'paymentReferenceNumber' : 'bpayReferenceNumber', {
          ns: 'taskbox',
        }),
        name: 'bpayReferenceNumber' as const,
        type: 'text',
        placeholder: '551008597419850721',
        defaultValue: undefined,
        rules: {
          validate: {
            isATOorBpay: (value: string | undefined) => {
              if (!value && isTax && type !== TaskType.SIGN_ONLY) {
                return t('prnRequired', { ns: 'taskbox' });
              } else if (isTax && value && !isValidPRN(value)) {
                return t('prnInvalid', { ns: 'taskbox' });
              } else if (!value && isBpay && type !== TaskType.SIGN_ONLY) {
                return t('bpayReferenceRequired', { ns: 'taskbox' });
              } else if (
                value &&
                isBpay &&
                !/^\d{2,20}$/.test(value) &&
                type !== TaskType.SIGN_ONLY
              ) {
                return t('bpayReferenceInvalid', { ns: 'taskbox' });
              }
              return true;
            },
          },
        },
      },
      note: {
        label: t('note', { ns: 'taskbox' }),
        name: 'notes' as const,
        type: 'text',
        placeholder: `${t('description', { ns: 'taskbox' })} (${t('optional', {
          ns: 'taskbox',
        })})`,
        defaultValue: undefined,
        rules: {},
      },
      paymentTypes: {
        label: t('paymentOptions', { ns: 'taskbox' }),
        name: 'paymentTypes' as const,
        type: 'text',
        placeholder: t('selectOption', { ns: 'taskbox' }),
        defaultValue: PaymentType.PAY_NOW,
        rules: { required: t('paymentOptionRequired', { ns: 'taskbox' }) },
      },
      documents: {
        rules: {
          validate: (value: any) => {
            const failed =
              (value === null || value === undefined || value.length === 0) &&
              type !== TaskType.PAY_ONLY;
            if (failed && isDownSm) {
              setShowUpload(true);
            }
            return !failed || t('documentRequired', { ns: 'taskbox' });
          },
        },
      },
    }),
    [
      t,
      taskDirection,
      paymentFrequency,
      entity,
      isTax,
      isDownSm,
      isBpay,
      isNoTaxNumber,
      from,
      type,
    ]
  );

  React.useEffect(() => {
    if (from?.gstRegistered) {
      setValue('gstInclusive', true);
    }
    if (isBpay && from?.bpay?.referenceNumber) {
      setValue('bpayReferenceNumber', from?.bpay?.referenceNumber);
    }
  }, [from, isBpay, setValue]);

  const currentEntityId = useCurrentEntityId();
  const entityId =
    fromType === 'Entity'
      ? watch('from')?.id
      : watch('to')?.id ?? currentEntityId;

  React.useEffect(() => {
    if (isNoTaxNumber) {
      setValue('type', TaskType.SIGN_ONLY);
    }
  }, [isNoTaxNumber]);

  const onSubmit = async (data: BillCreateFormData) => {
    trigger(['from', 'to']);
    if (data.type === TaskType.SIGN_ONLY || data.type === TaskType.SIGN_PAY)
      setPage('Sign');
    else setPage('Summary');
  };
  if (!entity) return null;

  return (
    <FormProvider {...methods}>
      <Controller
        rules={inputs.documents.rules}
        control={control}
        name="documents"
        render={({ field }) => (
          <WBDrawer
            anchor={'bottom'}
            open={showUpload}
            onClose={() => setShowUpload(false)}
            sx={{
              zIndex: 2000,
              // display: { xs: 'block', md: 'none' },
            }}
            PaperProps={{
              sx: {
                width: '100%',
                display: 'flex',
                px: 5,
                alignItems: 'center',
                overflow: 'scroll',
              },
            }}
          >
            <WBBox
              sx={{
                position: 'relative',
                width: { xs: '100%', sm: '80%' },
                height: '100%',
              }}
              mt={5}
            >
              <WBIconButton
                aria-label="close"
                icon="Close"
                onClick={(e) => setShowUpload(false)}
                sx={{
                  position: 'absolute',
                  right: -20,
                  top: -20,
                  color: (theme) => theme.palette.grey[500],
                  marginLeft: 'auto', // Align the button to the right
                }}
              />
              <WBTypography variant="h3" textAlign={'left'} fontWeight={'bold'}>
                {t('billActions', { ns: 'taskbox' })}
              </WBTypography>
              <PdfPotraitContainer>
                <UploadDocuments
                  key="drawer"
                  value={field.value}
                  onChange={field.onChange}
                />
              </PdfPotraitContainer>
              <WBFlex width={'100%'} justifyContent={'center'} mt={5}>
                <WBDivider
                  sx={{
                    bgcolor: theme.palette.grey[300],
                    width: theme.spacing(16),
                  }}
                  light
                  variant="middle"
                />
              </WBFlex>
            </WBBox>
          </WBDrawer>
        )}
      />

      <WBFlex flexDirection={'row'} justifyContent={'center'}>
        <WBFlex
          flex={{ xs: 1, md: 2 }}
          sx={{
            display: { xs: 'none', sm: 'flex' },
          }}
          maxHeight={['550px', '864px']}
          py={{ xs: 1, md: 5 }}
        >
          <PdfPotraitContainer>
            <Controller
              control={control}
              rules={inputs.documents.rules}
              name="documents"
              render={({ field }) => (
                <UploadDocuments
                  key="lgscreen"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </PdfPotraitContainer>
        </WBFlex>
        <WBFlex
          flex={{ xs: 1, md: 1 }}
          pl={{ xs: 0, sm: 3, md: 6 }}
          mt={[0, 0, 2]}
          alignItems={'start'}
          justifyContent={'center'}
        >
          <WBForm
            onSubmit={handleSubmit(onSubmit)}
            flexDirection={'column'}
            alignItems={'start'}
            justifyContent={'start'}
            alignSelf="stretch"
            fontSize={theme.typography.body2.fontSize}
            sx={{ width: ['100%', '80%', '100%', '100%'], mt: 0 }}
          >
            <Controller
              control={control}
              name={'from'}
              rules={inputs.from.rules}
              defaultValue={inputs.from.defaultValue}
              render={({ field }) => (
                <AutoCompleteLookup
                  {...field}
                  noPopupIcon
                  label={inputs.from.label}
                  placeholder={inputs.from.placeholder}
                  entityId={fromType === 'Entity' ? undefined : entityId}
                  type={fromType}
                  helperText={(errors[field.name]?.message as string) ?? ''}
                  disabled={!!task}
                  error={!!errors[field.name]}
                />
              )}
            />
            <Controller
              control={control}
              name={'to'}
              defaultValue={inputs.to.defaultValue}
              rules={inputs.from.rules}
              render={({ field }) => (
                <AutoCompleteLookup
                  {...field}
                  noPopupIcon
                  label={inputs.to.label}
                  placeholder={inputs.to.placeholder}
                  type={toType}
                  entityId={toType === 'Entity' ? undefined : entityId}
                  helperText={(errors[field.name]?.message as string) ?? ''}
                  error={!!errors[field.name]}
                  disabled={!!task}
                />
              )}
            />
            <Controller
              control={control}
              name={'type'}
              // rules={input.from.rules}
              defaultValue={inputs.type.defaultValue as TaskType}
              render={({ field }) => (
                <FormControl
                  sx={{
                    fontSize: theme.typography.body1,
                    fontWeight: 'bold',
                  }}
                >
                  <WBToggleButtonGroup
                    {...field}
                    label={inputs.type.label}
                    size="small"
                    sx={{ color: theme.palette.common.black }}
                    exclusive
                    rightLabel={inputs.type.placeholder}
                    infoTooltip={
                      isNoTaxNumber
                        ? t('entityWithtaxNumberCanPay', { ns: 'taskbox' })
                        : t('taskTypeTooltip', { ns: 'taskbox' })
                    }
                  >
                    <StyledToggleButton
                      value={TaskType.PAY_ONLY}
                      disabled={isNoTaxNumber}
                    >
                      {t('payOnly', { ns: 'taskbox' })}
                    </StyledToggleButton>
                    <StyledToggleButton value={TaskType.SIGN_ONLY}>
                      {t('signOnly', { ns: 'taskbox' })}
                    </StyledToggleButton>
                    <StyledToggleButton
                      value={TaskType.SIGN_PAY}
                      disabled={isNoTaxNumber}
                    >
                      {t('signPay', { ns: 'taskbox' })}
                    </StyledToggleButton>
                  </WBToggleButtonGroup>
                </FormControl>
              )}
            />
            {isTax && type !== TaskType.SIGN_ONLY ? (
              <Controller
                control={control}
                name={'settlementStatus'}
                defaultValue={inputs.settlementStatus.defaultValue}
                render={({ field }) => (
                  <FormControl
                    sx={{
                      fontSize: theme.typography.body1,
                      fontWeight: 'bold',
                    }}
                  >
                    <WBToggleButtonGroup
                      {...field}
                      label={inputs.settlementStatus.label}
                      size="small"
                      sx={{ color: theme.palette.common.black }}
                      exclusive
                      aria-label="Platform"
                    >
                      <StyledToggleButton value={TaskSettlementStatus.PAYABLE}>
                        {t('payable', { ns: 'taskbox' })}
                      </StyledToggleButton>
                      <StyledToggleButton
                        value={TaskSettlementStatus.REFUNDABLE}
                      >
                        {t('refundable', { ns: 'taskbox' })}
                      </StyledToggleButton>
                    </WBToggleButtonGroup>
                  </FormControl>
                )}
              />
            ) : null}
            {type !== TaskType.SIGN_ONLY && (
              <>
                {!isTax ? (
                  <WBFlex flexDirection={['column', 'row']} width={'100%'}>
                    <Controller
                      control={control}
                      name={'paymentFrequency'}
                      rules={inputs.paymentFrequency.rules}
                      defaultValue={inputs.paymentFrequency.defaultValue}
                      render={({ field }) => (
                        <WBSelect
                          sx={{
                            pr: [0, 3],
                            flex:
                              paymentFrequency === PaymentFrequency.ONCE &&
                              taskDirection === TaskDirection.SENDING
                                ? 1
                                : 0.5,
                          }}
                          {...field}
                          options={Object.values(PaymentFrequency).map(
                            (frequency) => ({
                              value: frequency,
                              label: t(frequency, { ns: 'taskbox' }),
                            })
                          )}
                          placeholder={inputs.paymentFrequency.placeholder}
                          label={inputs.paymentFrequency.label}
                          infoToolTip={t('paymentFrequencyTooltip', {
                            ns: 'taskbox',
                          })}
                        ></WBSelect>
                      )}
                    />

                    {paymentFrequency === PaymentFrequency.ONCE &&
                    taskDirection === TaskDirection.SENDING ? (
                      <Controller
                        control={control}
                        name={inputs.paymentTypes.name}
                        rules={inputs.paymentTypes.rules}
                        defaultValue={inputs.paymentTypes.defaultValue}
                        render={({ field }) => (
                          <WBSelect
                            sx={{ flex: 1 }}
                            {...field}
                            options={[
                              {
                                value: PaymentType.PAY_NOW,
                                label: t('PAY_NOW', { ns: 'taskbox' }),
                              },
                              {
                                value: PaymentType.INSTALLMENTS,
                                label: t('payNowAndInstallment', {
                                  ns: 'taskbox',
                                }),
                              },
                            ]}
                            placeholder={inputs.paymentTypes.placeholder}
                            label={inputs.paymentTypes.label}
                            infoToolTip={t('paymentTypesTooltip', {
                              ns: 'taskbox',
                            })}
                          ></WBSelect>
                        )}
                      />
                    ) : null}
                  </WBFlex>
                ) : null}
                {!isTax && paymentFrequency !== PaymentFrequency.ONCE ? (
                  <WBFlex flexDirection={['column', 'row']} width={'100%'}>
                    <Controller
                      control={control}
                      name={inputs.numberOfPayments.name}
                      rules={inputs.numberOfPayments.rules}
                      //defaultValue={inputs.numberOfPayments.defaultValue} // throws type error
                      render={({ field }) => (
                        <WBTextField
                          {...field}
                          sx={{
                            pr: [0, 3],
                            flex: 1,
                          }}
                          fullWidth
                          type={inputs.numberOfPayments.type}
                          placeholder={inputs.numberOfPayments.placeholder}
                          inputProps={{ step: 1 }} // This ensures only whole numbers can be entered
                          label={inputs.numberOfPayments.label}
                          helperText={errors[field.name]?.message ?? ''}
                          error={!!errors[field.name]}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={inputs.firstPaymentAt.name}
                      rules={inputs.firstPaymentAt.rules}
                      defaultValue={inputs.firstPaymentAt.defaultValue}
                      render={({ field }) => (
                        <DueDateSelector
                          {...field}
                          type={inputs.firstPaymentAt.type}
                          placeholder={inputs.firstPaymentAt.placeholder}
                          label={inputs.firstPaymentAt.label}
                          helperText={errors[field.name]?.message ?? ''}
                          error={!!errors[field.name]}
                          fullWidth
                          sx={{ flex: 1 }}
                        />
                      )}
                    />
                  </WBFlex>
                ) : null}
              </>
            )}
            <WBFlex flexDirection={['column', 'row']} width={'100%'}>
              {type !== TaskType.SIGN_ONLY && (
                <Controller
                  control={control}
                  name={inputs.amount.name}
                  rules={inputs.amount.rules}
                  defaultValue={inputs.amount.defaultValue}
                  render={({ field }) => (
                    <WBTextField
                      {...field}
                      type={inputs.amount.type}
                      sx={{
                        pr: [0, 3],
                        flex: 1,
                      }}
                      fullWidth
                      // type={inputs.amount.type}
                      placeholder={inputs.amount.placeholder}
                      label={inputs.amount.label}
                      leftIcon={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      helperText={errors[field.name]?.message ?? ''}
                      error={!!errors[field.name]}
                    />
                  )}
                />
              )}
              {!isTax && paymentFrequency === PaymentFrequency.ONCE && (
                <Controller
                  control={control}
                  name={'dueAt'}
                  rules={inputs.dueAt.rules}
                  defaultValue={inputs.dueAt.defaultValue}
                  render={({ field }) => (
                    <DueDateSelector
                      {...field}
                      type={inputs.dueAt.type}
                      placeholder={inputs.dueAt.placeholder}
                      label={inputs.dueAt.label}
                      fullWidth
                      sx={{ flex: 1 }}
                      helperText={errors[field.name]?.message ?? ''}
                      error={!!errors[field.name]}
                    />
                  )}
                />
              )}
            </WBFlex>

            {from && !isTax && type !== TaskType.SIGN_ONLY && (
              <WBFlex flexDirection={['column', 'row']} width={'100%'} mt={3}>
                <Controller
                  control={control}
                  name={'gstInclusive'}
                  rules={inputs.gstInclusive.rules}
                  defaultValue={inputs.gstInclusive.defaultValue ?? false}
                  render={({ field: { ref, ...field } }) => (
                    <WBCheckbox
                      {...field}
                      checked={field.value}
                      label={inputs.gstInclusive.label}
                    />
                  )}
                />
              </WBFlex>
            )}

            {isTax && (
              <WBFlex flexDirection={['column', 'row']} width={'100%'}>
                <Controller
                  control={control}
                  name={'lodgementAt'}
                  defaultValue={inputs.lodgementAt.defaultValue}
                  rules={inputs.lodgementAt.rules}
                  render={({ field }) => (
                    <DueDateSelector
                      {...field}
                      type={inputs.lodgementAt.type}
                      placeholder={inputs.lodgementAt.placeholder}
                      label={inputs.lodgementAt.label}
                      fullWidth
                      helperText={errors[field.name]?.message ?? ''}
                      error={!!errors[field.name]}
                      sx={{ flex: 1, pr: [0, 1] }}
                    />
                  )}
                />

                {type !== TaskType.SIGN_ONLY && (
                  <Controller
                    control={control}
                    name={inputs.paymentAt.name}
                    defaultValue={inputs.paymentAt.defaultValue}
                    rules={inputs.paymentAt.rules}
                    render={({ field }) => (
                      <DueDateSelector
                        {...field}
                        type={inputs.paymentAt.type}
                        placeholder={inputs.paymentAt.placeholder}
                        label={inputs.paymentAt.label}
                        fullWidth
                        helperText={errors[field.name]?.message ?? ''}
                        error={!!errors[field.name]}
                        sx={{ flex: 1, pl: [0, 1] }}
                      />
                    )}
                  />
                )}
              </WBFlex>
            )}

            <Controller
              control={control}
              name={inputs.referenceNumber.name}
              rules={inputs.referenceNumber.rules}
              defaultValue=""
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={inputs.referenceNumber.type}
                  placeholder={inputs.referenceNumber.placeholder}
                  label={inputs.referenceNumber.label}
                  fullWidth
                  helperText={errors[field.name]?.message ?? ''}
                  error={!!errors[field.name]}
                />
              )}
            />
            {(isBpay || isTax) && type !== TaskType.SIGN_ONLY && (
              <Controller
                control={control}
                name={inputs.bpayReferenceNumber.name}
                rules={inputs.bpayReferenceNumber.rules}
                defaultValue=""
                render={({ field }) => (
                  <WBTextField
                    {...field}
                    type={inputs.bpayReferenceNumber.type}
                    placeholder={inputs.bpayReferenceNumber.placeholder}
                    label={inputs.bpayReferenceNumber.label}
                    fullWidth
                    helperText={errors[field.name]?.message ?? ''}
                    error={!!errors[field.name]}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\s+/g, ''))
                    }
                  />
                )}
              />
            )}
            <Controller
              control={control}
              name={'notes' as const}
              key={noteSelection}
              rules={inputs.note.rules}
              render={({ field }) => (
                <WBTextField
                  {...field}
                  type={inputs.note.type}
                  placeholder={inputs.note.placeholder}
                  label={inputs.note.label}
                  infoToolTip={t('noteInformationTooltip', { ns: 'taskbox' })}
                  key={field.name}
                  multiline
                  fullWidth
                />
              )}
            />
            <TaskCreation.SubmitButtons />
          </WBForm>
        </WBFlex>
      </WBFlex>
    </FormProvider>
  );
}
