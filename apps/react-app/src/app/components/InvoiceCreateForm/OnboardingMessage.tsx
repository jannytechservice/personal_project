import { WBButton, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import React from 'react';

interface Props {
  onGetStarted: () => void;
  title?: string;
  description?: string;
  buttonTitle?: string;
  loading?: boolean;
}
const OnboardingMessage: React.FC<Props> = (props) => {
  return (
    <Conatiner flexDirection={'column'} alignItems={'center'} rowGap={2.5}>
      <ImagePlaceholder />
      <Title textAlign={'center'}>{props.title}</Title>
      <Description variant="body1" textAlign={'center'}>
        {props.description}
      </Description>
      <StartButton onClick={props.onGetStarted} loading={props.loading}>
        {props.buttonTitle}
      </StartButton>
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
const StartButton = styled(WBButton)(({ theme }) => ({
  padding: theme.spacing(1, 18),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 12),
  },
  flexWrap: 'nowrap',
}));

const Title = styled(WBTypography)(({ theme }) => ({
  ...theme.typography.h3,
  [theme.breakpoints.down('sm')]: {
    ...theme.typography.h3,
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
    paddingTop: theme.spacing(1),
  },
}));

export default OnboardingMessage;
