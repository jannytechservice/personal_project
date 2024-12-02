import { InvoiceStatus, PaymentFrequency } from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBFlex,
  WBForm,
  WBTextField,
  WBToggleButtonGroup,
} from '@admiin-com/ds-web';
import { styled, ToggleButton, useTheme, useMediaQuery } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InvoiceNumberEdit } from './components/InvoiceNumberEdit';
import AutoCompleteLookup, {
  AutoCompleteDataType,
} from '../AutoCompleteLookup/AutoCompleteLookup';
import DueDateSelector from '../DueDateSelector/DueDateSelector';
import TaskUpload from './components/TaskUpload';
import { InvoiceCreateButtons } from '../InvoiceCreateForm/InvoiceCreateButtons';

interface Props {
  handleNext: () => void;
  onDraft: () => void;
  onPreview: () => void;
  inputs: {
    [key: string]: {
      label: string;
      name: string;
      type: string;
      defaultValue: any;
      placeholder: string;
      rules: any;
    };
  };
}

export const InvoiceDetail = ({
  onDraft,
  onPreview,
  inputs,
  handleNext,
}: Props) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = methods;
  console.log(errors, isValid);

  const onSubmit = () => {
    console.log('submit');
  };

  const fromType: AutoCompleteDataType = 'Entity' as const;
  const toType: AutoCompleteDataType = 'Contact' as const;
  const entityId = watch('from')?.id;
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  return (
    <Container onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <Controller
          name="invoiceStatus"
          control={methods.control}
          defaultValue={InvoiceStatus.INVOICE}
          render={({ field }) => (
            <WBToggleButtonGroup {...field} size="medium" exclusive>
              {Object.keys(InvoiceStatus).map((key) => {
                return (
                  <StyledRectToggleButton value={key} key={key}>
                    {t(key, { ns: 'taskbox' })}
                  </StyledRectToggleButton>
                );
              })}
            </WBToggleButtonGroup>
          )}
        />
        <WBBox mt={3}>
          <InvoiceNumberEdit />
        </WBBox>
        <WBFlex flexDirection={['column', 'row']} gap={[0, 4]}>
          <Controller
            control={control}
            name={'from'}
            rules={inputs.from.rules}
            defaultValue={inputs.from.defaultValue}
            render={({ field, formState: { errors } }) => (
              <AutoCompleteLookup
                {...field}
                noPopupIcon
                label={inputs.from.label}
                placeholder={inputs.from.placeholder}
                entityId={fromType === 'Entity' ? undefined : entityId}
                type={fromType}
                helperText={(errors[field.name]?.message as string) ?? ''}
                // disabled={!!task}
                error={!!errors[field.name]}
              />
            )}
          />
          <Controller
            control={control}
            name={'to'}
            defaultValue={inputs.to.defaultValue}
            rules={inputs.from.rules}
            render={({ field, formState: { errors } }) => (
              <AutoCompleteLookup
                {...field}
                noPopupIcon
                label={inputs.to.label}
                placeholder={inputs.to.placeholder}
                type={toType}
                entityId={undefined}
                helperText={(errors[field.name]?.message as string) ?? ''}
                error={!!errors[field.name]}
                // disabled={!!task}
              />
            )}
          />
        </WBFlex>
        <WBFlex flexDirection={['column', 'row']} gap={[0, 4]}>
          <Controller
            control={control}
            name={'issueAt'}
            rules={inputs.issueAt.rules}
            defaultValue={inputs.issueAt.defaultValue}
            render={({ field, formState: { errors } }) => (
              <DueDateSelector
                {...field}
                type={inputs.issueAt.type}
                placeholder={inputs.issueAt.placeholder}
                label={inputs.issueAt.label}
                fullWidth
                sx={{ flex: 1 }}
                helperText={(errors[field.name]?.message as string) ?? ''}
                error={!!errors[field.name]}
              />
            )}
          />
          <Controller
            control={control}
            name={'dueAt'}
            rules={inputs.dueAt.rules}
            defaultValue={inputs.dueAt.defaultValue}
            render={({ field, formState: { errors } }) => (
              <DueDateSelector
                {...field}
                type={inputs.dueAt.type}
                placeholder={inputs.dueAt.placeholder}
                label={inputs.dueAt.label}
                fullWidth
                sx={{ flex: 1 }}
                helperText={(errors[field.name]?.message as string) ?? ''}
                error={!!errors[field.name]}
              />
            )}
          />
        </WBFlex>
        <WBBox mt={2}>
          <Controller
            name="paymentFrequency"
            control={methods.control}
            defaultValue={PaymentFrequency.ONCE}
            render={({ field }) => (
              <WBToggleButtonGroup
                {...field}
                size="medium"
                fullWidth={isMobile ? true : false}
                exclusive
                sx={{ marginTop: 2, gap: 1 }}
                label={t('paymentFrequency', { ns: 'taskbox' })}
              >
                {[PaymentFrequency.ONCE, PaymentFrequency.MONTHLY].map(
                  (key) => {
                    return (
                      <RoundedToggleButton value={key} key={key}>
                        {t(key === PaymentFrequency.ONCE ? key : 'RECURRING', {
                          ns: 'taskbox',
                        })}
                      </RoundedToggleButton>
                    );
                  }
                )}
              </WBToggleButtonGroup>
            )}
          />
        </WBBox>
        <WBBox mt={2}>
          <Controller
            rules={inputs.documents.rules}
            control={control}
            name={'supportingDocuments' as const}
            render={({ field }) => (
              <TaskUpload {...field} label={inputs.documents.label} />
            )}
          />
        </WBBox>
        <Controller
          control={control}
          name={'notes' as const}
          rules={inputs.note.rules}
          render={({ field }) => (
            <WBTextField
              {...field}
              type={inputs.note.type}
              placeholder={inputs.note.placeholder}
              label={inputs.note.label}
              key={field.name}
              multiline
              fullWidth
            />
          )}
        />
      </FormContainer>

      <InvoiceCreateButtons
        onDraft={onDraft}
        onPreview={onPreview}
        handleNext={handleNext}
        isValid={isValid}
      />
    </Container>
  );
};

export const StyledRectToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  fontWeight: 500,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  padding: theme.spacing(1.5, 3),
}));

const RoundedToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: '50px !important',
  borderColor: theme.palette.primary.main,
  fontWeight: 500,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  borderWidth: '1px',
  borderLeftColor: `${theme.palette.primary.main} !important`,
  padding: theme.spacing(1.5, 3),
}));

const Container = styled(WBForm)(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  alignItems: 'end',
  backgroundColor: theme.palette.background.default,
}));

const FormContainer = styled(WBBox)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(5),
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  flex: 1,
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
}));
