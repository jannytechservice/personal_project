import { PaperProps, useTheme, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import React from 'react';
import {
  WBBox,
  WBContainer,
  WBDialogContent,
  WBFlex,
  WBIcon,
  WBLink,
  WBTab,
  WBTabs,
  WBTypography,
} from '@admiin-com/ds-web';
import { Dialog as MUIDialog } from '@mui/material';
import { PageType } from './type';
import { InvoiceCreateFormContainer } from '../InvoiceCreateForm';
import ESignature from '../ESignature';

interface PaperComponentProps extends PaperProps {
  gradient?: boolean;
}

const StyledDialog = styled(MUIDialog)({
  '& .MuiDialogContent-root': {
    width: '100%',
  },
});

const StyledWBFlex = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  alignItems: 'center',
  height: '100%',
  backgroundColor: theme.palette.background.default,
}));

const HeaderFlex = styled(WBFlex)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  flexDirection: 'row',
  padding: theme.spacing(3, 8),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  backgroundColor: theme.palette.mode === 'dark' ? '#151515' : '#151515',
}));

const LeftToolbarFlex = styled(WBFlex)({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StyledWBLink = styled(WBLink)(({ theme }) => ({
  underline: 'always',
  alignContent: 'center',
  display: 'flex',
  color: theme.palette.common.black,
}));

const CenteredTypography = styled(WBTypography)(({ theme }) => ({
  flex: 2,
  textAlign: 'center',
  marginBottom: 0,
}));

const FlexSpacer = styled(WBBox)({
  flex: 1,
});

const Tabs = styled(WBTabs)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  paddingRight: theme.spacing(40),
  paddingLeft: theme.spacing(40),
  [theme.breakpoints.down('lg')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const Tab = styled(WBTab)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
  },
  fontWeight: 'medium',
}));

interface Props {
  open: boolean;
  onClose: () => void;
  page: PageType;
  setPage: (page: PageType) => void;
}
const TABS = ['INVOICE&QUOTES', 'PAY_BILL', 'E_SIGNATURE'];

export function TaskCreateModal({ onClose, page, setPage, open }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const headerColor = theme.palette.mode === 'dark' ? 'white' : 'white';

  const content = React.useMemo(() => {
    switch (page) {
      case 'INVOICE&QUOTES':
        return <InvoiceCreateFormContainer />;
      case 'PAY_BILL':
        return <div>Pay Bill</div>;
      case 'E_SIGNATURE':
        return <ESignature />;
    }
  }, [page]);

  return (
    <StyledDialog
      fullScreen
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      scroll="body"
    >
      <StyledWBFlex>
        <HeaderFlex>
          <LeftToolbarFlex>
            <StyledWBLink onClick={onClose}>
              <WBIcon color={headerColor} name="ArrowBack" size="small" />
              <WBTypography
                variant="body1"
                fontWeight="medium"
                noWrap
                ml={1}
                color={headerColor}
                component="div"
              >
                {t('back', { ns: 'common' })}
              </WBTypography>
            </StyledWBLink>
          </LeftToolbarFlex>

          <CenteredTypography
            variant="h5"
            fontWeight="medium"
            color={headerColor}
          >
            {t('createTaskTitle', { ns: 'taskbox' })}
          </CenteredTypography>
          <FlexSpacer />
        </HeaderFlex>
        <StyledTabs
          value={page}
          onChange={(_e: React.SyntheticEvent, v: PageType) => setPage(v)}
          variant="fullWidth"
          centered
        >
          {TABS.map((tab, index) => (
            <StyledTab
              key={index}
              value={tab}
              label={t(tab, { ns: 'taskbox' })}
            />
          ))}
        </StyledTabs>
        <WBDialogContent dividers sx={{ px: [1, 2], py: [1, 3] }}>
          <ContentContainer maxWidth="lg" sx={{ height: '100%' }}>
            {content}
          </ContentContainer>
        </WBDialogContent>
      </StyledWBFlex>
    </StyledDialog>
  );
}

const ContentContainer = styled(WBContainer)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: 0,
  },
}));
const StyledTab = styled(Tab)(({ theme }) => ({
  '&:hover': {
    color: theme.palette.text.primary,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.body2.fontSize,
    padding: theme.spacing(0, 1),
  },
}));
export default TaskCreateModal;
