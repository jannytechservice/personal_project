import { WBBox, WBButton, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TaskUpload from '../InvoiceDetail/components/TaskUpload';
import { useTranslation } from 'react-i18next';

interface Props {
  onGetStarted: () => void;
  title?: string;
  description?: string;
  buttonTitle?: string;
  loading?: boolean;
}
const Onboarding: React.FC<Props> = (props) => {
  const { control, setValue } = useFormContext();
  const { t } = useTranslation();
  return (
    <Conatiner flexDirection={'column'} alignItems={'center'} rowGap={2.5}>
      <ImagePlaceholder />
      <Title textAlign={'center'}>{props.title}</Title>
      <Description variant="body1" textAlign={'center'}>
        {props.description}
      </Description>
      <Controller
        control={control}
        name={'documents' as const}
        render={({ field }) => (
          <WBBox width="100%">
            <TaskUpload
              {...field}
              isPDFOnly
              onChange={(files) => {
                field.onChange(files);
                setValue('reference', files[0]?.name ?? '');
                props.onGetStarted();
              }}
            />
          </WBBox>
        )}
      />
    </Conatiner>
  );
};
const ImagePlaceholder = styled(WBFlex)(({ theme }) => ({
  width: '200px',
  height: '200px',
  backgroundColor: theme.palette.grey[300],
  borderRadius: '100%',
  [theme.breakpoints.down('sm')]: {
    width: '150px',
    height: '150px',
  },
}));

const Title = styled(WBTypography)(({ theme }) => ({
  ...theme.typography.h3,
  [theme.breakpoints.down('sm')]: {
    ...theme.typography.h4,
  },
}));

const Description = styled(WBTypography)(({ theme }) => ({
  ...theme.typography.body1,
  [theme.breakpoints.down('sm')]: {
    ...theme.typography.body2,
  },
  color: theme.palette.text.secondary,
}));

const Conatiner = styled(WBFlex)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(20),
  marginTop: theme.spacing(5),
  paddingTop: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(5),
    paddingTop: theme.spacing(2),
  },
}));

export default Onboarding;
