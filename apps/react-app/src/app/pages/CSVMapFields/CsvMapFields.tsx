import {
  WBBox,
  WBButton,
  WBDialog,
  WBDialogContent,
  WBFlex,
  WBForm,
  WBIcon,
  WBLink,
  WBMenuItem,
  WBSelect,
  WBTable,
  WBTableBody,
  WBTableCell,
  WBTableContainer,
  WBTableHead,
  WBTableRow,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  ButtonGroup,
  DialogTitle,
  FormControl,
  Paper,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  CreateContactBulkImportInput,
  createContactBulkUpload as CREATE_CONTACT_BULK_UPLOAD,
} from '@admiin-com/ds-graphql';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';
import { useCsvContactValidation } from './useCsvContactValidation';

export interface MapCSVFieldsProps {
  file?: File;
  fileKey: string;
  onSubmitted?: () => void;
}

export interface CSVMapFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  mobile: string;
  phone: string;
  taxNumber: string;
  companyNumber: string;
  billerCode: string;
  referenceNumber: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
}

export function CsvMapFields({
  file,
  onSubmitted,
  fileKey,
}: MapCSVFieldsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<CSVMapFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const formValues = useWatch({ control });

  const [loading, setLoading] = React.useState(false);

  const {
    successedRow,
    failedRowDetails,
    failedCount,
    warningCount,
    fieldNames,
  } = useCsvContactValidation({ file, fields: formValues });

  const [submitted, setSubmitted] = React.useState<boolean>(false);

  React.useEffect(() => {
    let triggerValidation = false;
    if (fieldNames?.length > 0) {
      const defaultFields = {
        firstName: 'First Name',
        lastName: 'Last Name',
        companyName: 'Company Name',
        email: 'Email',
        mobile: 'Mobile',
        phone: 'Phone',
        taxNumber: 'ABN',
        companyNumber: 'ACN',
        billerCode: 'Bpay Biller Code',
        referenceNumber: 'Bpay Reference Number',
        accountName: 'Bank Account Name',
        accountNumber: 'Bank Account Number',
        routingNumber: 'BSB',
      };

      Object.entries(defaultFields).forEach(([key, value]) => {
        if (fieldNames.includes(value)) {
          setValue(key as keyof CSVMapFormData, value);

          if (!triggerValidation) {
            triggerValidation = true;
          }
        }
      });

      if (triggerValidation) {
        trigger();
      }
    }
  }, [fieldNames, setValue, trigger]);

  function validateField(
    value: string | null | undefined,
    requiredMessage: string
  ) {
    return (
      (value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'Ignore column') ||
      requiredMessage
    );
  }

  const inputs = React.useMemo(
    () => ({
      firstName: {
        label: t('firstName', { ns: 'contacts' }),
        name: 'firstName' as const,
        type: 'text',
        placeholder: t('firstNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('firstNameRequired', { ns: 'contacts' })),
        },
      },
      lastName: {
        label: t('lastName', { ns: 'contacts' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('lastNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('lastNameRequired', { ns: 'contacts' })),
        },
      },
      companyName: {
        label: t('companyName', { ns: 'contacts' }),
        name: 'companyName' as const,
        type: 'text',
        placeholder: t('companyNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('companyNameRequired', { ns: 'contacts' })),
        },
      },
      email: {
        label: t('email', { ns: 'contacts' }),
        name: 'email' as const,
        type: 'email',
        defaultValue: '',
        placeholder: t('emailPlaceholder', { ns: 'contacts' }),
        rules: {
          validate: (value: string | null | undefined) =>
            validateField(value, t('emailRequired', { ns: 'common' })),
        },
      },
      mobile: {
        label: t('mobile', { ns: 'contacts' }),
        name: 'mobile' as const,
        type: 'text',
        placeholder: t('mobilePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      phone: {
        label: t('phone', { ns: 'contacts' }),
        name: 'phone' as const,
        type: 'text',
        placeholder: t('phonePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      taxNumber: {
        label: t('abn', { ns: 'contacts' }),
        name: 'taxNumber' as const,
        type: 'text',
        placeholder: t('taxNumberPlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      companyNumber: {
        label: t('acn', { ns: 'contacts' }),
        name: 'companyNumber' as const,
        type: 'text',
        placeholder: t('companyNumberPlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      billerCode: {
        label: t('bpayBillerCode', { ns: 'contacts' }),
        name: 'billerCode' as const,
        type: 'number',
        placeholder: t('billerCodePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      referenceNumber: {
        label: t('bpayReferencerNumber', { ns: 'contacts' }),
        name: 'referenceNumber' as const,
        type: 'text',
        placeholder: t('referencerNumberPlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      accountName: {
        label: t('bankAccountName', { ns: 'contacts' }),
        name: 'accountName' as const,
        type: 'text',
        placeholder: t('accountNamePlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      accountNumber: {
        label: t('bankAccountNumber', { ns: 'contacts' }),
        name: 'accountNumber' as const,
        type: 'text',
        placeholder: t('accountNumberPlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
      routingNumber: {
        label: t('routingNumber', { ns: 'contacts' }),
        name: 'routingNumber' as const,
        type: 'text',
        placeholder: t('routingNumberPlaceholder', { ns: 'contacts' }),
        defaultValue: '',
        rules: {},
      },
    }),
    [t]
  );

  const [createContactBulkUpload, { error: createError }] = useMutation(
    gql`
      ${CREATE_CONTACT_BULK_UPLOAD}
    `
  );

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;

  const onSubmit = async (data: CSVMapFormData) => {
    if (successedRow === 0) return;
    setLoading(true);
    try {
      const bulkImportInput: CreateContactBulkImportInput = {
        entityId,
        fileKey,
        fields: {
          firstName:
            data.firstName && data.firstName !== 'Ignore column'
              ? data.firstName
              : '',
          lastName:
            data.lastName && data.lastName !== 'Ignore column'
              ? data.lastName
              : '',
          phone: data.phone && data.phone !== 'Ignore column' ? data.phone : '',
          mobile:
            data.mobile && data.mobile !== 'Ignore column' ? data.mobile : '',
          email: data.email && data.email !== 'Ignore column' ? data.email : '',
          companyName:
            data.companyName && data.companyName !== 'Ignore column'
              ? data.companyName
              : '',
          taxNumber:
            data.taxNumber && data.taxNumber !== 'Ignore column'
              ? data.taxNumber
              : '',
          billerCode:
            data.billerCode && data.billerCode !== 'Ignore column'
              ? data.billerCode
              : '',
          referenceNumber:
            data.referenceNumber && data.referenceNumber !== 'Ignore column'
              ? data.referenceNumber
              : '',
          accountName:
            data.accountName && data.accountName !== 'Ignore column'
              ? data.accountName
              : '',
          accountNumber:
            data.accountNumber && data.accountNumber !== 'Ignore column'
              ? data.accountNumber
              : '',
          routingNumber:
            data.routingNumber && data.routingNumber !== 'Ignore column'
              ? data.routingNumber
              : '',
        },
      };

      await createContactBulkUpload({
        variables: {
          input: { ...bulkImportInput },
        },
      });

      setLoading(false);
      setSubmitted(true);
      onSubmitted && onSubmitted();
    } catch (err) {
      console.log('error create contact bulk upload: ', err);
      setLoading(false);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <WBFlex width={'100%'} justifyContent={'center'}>
      <WBFlex
        flexDirection="column"
        alignItems="center"
        width={{
          xs: '100%',
          sm: '80%',
          md: '70%',
          lg: '60%',
        }}
      >
        <WBForm
          onSubmit={handleSubmit(onSubmit)}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          alignSelf="stretch"
          mt={[1, 6, 8]}
        >
          <WBTypography
            component={'div'}
            align="center"
            fontWeight={'regular'}
            textAlign={'center'}
            justifyContent={'center'}
          >
            {t('mapCSVFileDesciption', { ns: 'contacts' })}
          </WBTypography>
          <WBTableContainer sx={{ mt: 5 }}>
            <WBTable>
              <WBTableHead
                sx={{ color: 'white', bgcolor: 'black', border: 'none' }}
              >
                <WBTableRow>
                  <WBTableCell sx={{ width: '40%' }}>
                    {t('contactField', { ns: 'contacts' })}
                  </WBTableCell>
                  <WBTableCell sx={{ width: '10%' }} />
                  <WBTableCell sx={{ width: '50%' }}>
                    {t('yourCSVFileField', { ns: 'contacts' })}
                  </WBTableCell>
                </WBTableRow>
              </WBTableHead>
              <WBTableBody>
                {Object.entries(inputs).map(([key, input]) => (
                  <WBTableRow key={key}>
                    <WBTableCell>{input.label}</WBTableCell>
                    <WBTableCell>
                      <WBIcon name="ArrowForward" size={'medium'}></WBIcon>
                    </WBTableCell>
                    <WBTableCell>
                      <Controller
                        control={control}
                        name={key as any}
                        rules={input.rules}
                        defaultValue={input.defaultValue}
                        render={({ field }) => (
                          <FormControl
                            sx={{
                              backgroundColor: theme.palette.common.white,
                              height: '70%',
                              width: '90%',
                              fontSize: theme.typography.body1,
                              fontWeight: 'bold',
                            }}
                          >
                            <WBSelect
                              value={field.value}
                              SelectProps={{
                                SelectDisplayProps: {
                                  style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    color:
                                      field.value === 'Ignore column'
                                        ? 'grey'
                                        : 'initial',
                                    fontWeight: 'medium',
                                  },
                                },
                              }}
                              InputProps={{
                                disableUnderline: true,
                                sx: {
                                  borderStyle: 'dotted',
                                  borderWidth: '2px',
                                  paddingX: '12px',
                                  fontWeight: 'medium',
                                  color: 'grey',
                                },
                              }}
                              helperText={
                                errors[field.name as keyof CSVMapFormData]
                                  ?.message ?? ''
                              }
                              error={
                                !!errors[field.name as keyof CSVMapFormData]
                              }
                            >
                              {['Ignore column', ...fieldNames].map(
                                (fieldName, index) => (
                                  <WBMenuItem
                                    key={index}
                                    value={fieldName}
                                    onClick={() => {
                                      field.onChange(fieldName);
                                      trigger(field.name);
                                    }}
                                  >
                                    <WBTypography
                                      noWrap
                                      fontWeight="medium"
                                      color={index !== 0 ? 'inherit' : 'grey'}
                                    >
                                      {`${fieldName}`}
                                    </WBTypography>
                                  </WBMenuItem>
                                )
                              )}
                            </WBSelect>
                          </FormControl>
                        )}
                      />
                    </WBTableCell>
                  </WBTableRow>
                ))}
              </WBTableBody>
            </WBTable>
          </WBTableContainer>
          {isValid && failedCount > 0 ? (
            <WBTypography color={'error'} mt={1}>
              <WBTypography
                component={'span'}
                color={'inherit'}
                fontWeight="bold"
                variant="inherit"
              >
                {failedCount}{' '}
              </WBTypography>
              {`${t('notImported', { ns: 'contacts' })}`}{' '}
            </WBTypography>
          ) : null}{' '}
          {isValid && warningCount > 0 ? (
            <WBTypography color={'warning.main'}>
              <WBTypography
                component={'span'}
                color={'inherit'}
                fontWeight="bold"
                variant="inherit"
              >
                {`${warningCount}`}
              </WBTypography>{' '}
              {`${t('partiallyImported', { ns: 'contacts' })}`}
            </WBTypography>
          ) : null}
          {isValid && (failedCount > 0 || warningCount > 0) && (
            <WBLink
              fontWeight={'bold'}
              underline="always"
              onClick={handleClickOpen}
            >
              {t('viewReport', { ns: 'contacts' })}
            </WBLink>
          )}
          <WBBox mt={[5, 6, 7]}>
            {!submitted ? (
              <ButtonGroup
                variant="outlined"
                aria-label="split button"
                disableRipple
                disableFocusRipple
                disableElevation
              >
                <WBButton
                  type="submit"
                  sx={{
                    paddingX: loading ? 9 : 6,
                    marginRight: 2,
                    marginBottom: 5,
                  }}
                  loading={loading}
                  disabled={!isValid}
                >
                  {`${t('importContacts', {
                    ns: 'contacts',
                  })} (${successedRow})`}
                </WBButton>
                {/*{!loading ? (*/}
                {/*  <WBButton disabled={!isValid}>*/}
                {/*    <WBIcon*/}
                {/*      name="ChevronDown"*/}
                {/*      size={1.5}*/}
                {/*      color="inhreit"*/}
                {/*    ></WBIcon>*/}
                {/*  </WBButton>*/}
                {/*) : null}*/}
              </ButtonGroup>
            ) : (
              <WBBox
                sx={{
                  borderRadius: 20,
                  padding: 2,
                  paddingX: 6,
                  bgcolor: theme.palette.success.main,
                  fontWeight: 'bold',
                }}
              >
                {t('importingContacts', { ns: 'contacts' })}
              </WBBox>
            )}
          </WBBox>
        </WBForm>
        <ErrorHandler errorMessage={createError?.message} />
      </WBFlex>
      <WBDialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        PaperComponent={Paper}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: { p: 4 },
        }}
      >
        <DialogTitle variant="h3" id="scroll-dialog-title">
          {t('bulkImportReport', { ns: 'contacts' })}
        </DialogTitle>
        <WBDialogContent dividers>
          <WBTableContainer component={WBBox}>
            <WBTable aria-label="simple table">
              <WBTableBody>
                {failedRowDetails.map((row, index) => (
                  <WBTableRow
                    key={index}
                    sx={{
                      borderBottom: 1,
                      borderColor: theme.palette.grey[400],
                      fontWeight: 'regular',
                    }}
                  >
                    <WBTableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontWeight: 'inherit',
                        textWrap: 'nowrap',
                        px: 0,
                        py: 3,
                      }}
                    >
                      {`Row ${row.no + 1}`}
                    </WBTableCell>
                    <WBTableCell align="right" sx={{ fontWeight: 'inherit' }}>
                      {row.value}
                    </WBTableCell>
                    <WBTableCell
                      align="right"
                      sx={{
                        color:
                          row.type === 'error' ? 'error.main' : 'warning.main',
                        fontWeight: 'inherit',
                        px: 0,
                      }}
                    >
                      {row.message}
                    </WBTableCell>
                  </WBTableRow>
                ))}
              </WBTableBody>
            </WBTable>
          </WBTableContainer>
        </WBDialogContent>
      </WBDialog>
      ;
    </WBFlex>
  );
}
