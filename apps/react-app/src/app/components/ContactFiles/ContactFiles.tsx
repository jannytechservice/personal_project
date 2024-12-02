import {
  WBBox,
  WBButton,
  WBFlex,
  WBIcon,
  WBStack,
  WBTypography,
} from '@admiin-com/ds-web';
import { useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContactFileCard } from './ContactFileCard';
import { ScrollViews, ScrollViewsContainer } from '../ScrollViews/ScrollViews';
import { Contact, Entity, Task } from '@admiin-com/ds-graphql';
import { TaskCreation } from '../../pages/TaskCreation/TaskCreation';

export interface ContactFilesProps {
  tasks: (Task | null | undefined)[];
  hasTasks: boolean;
  contact: Contact & { entity?: Entity };
  filesType: 'Outstanding' | 'Complete';
  setFilesType: (type: 'Outstanding' | 'Complete') => void;
}

export function ContactFiles({
  contact,
  tasks,
  hasTasks,
  setFilesType,
  filesType,
}: ContactFilesProps) {
  const theme = useTheme();
  const islg = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const getSelectedButtonStyle = (isSelected: boolean) => {
    const mode = theme.palette.mode;
    return {
      borderRadius: '30px',
      ...theme.typography.body2,
      fontSize: 12,
      fontWeight: 'medium',
      px: 2,
      color: isSelected
        ? theme.palette.common.white
        : mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
      backgroundColor: `rgba(0,0,0,${isSelected ? 0.9 : 0.1})`,
      '&:hover': {
        color: '#FFFFFF',
        backgroundColor: `rgba(0, 0, 0, 1)`,
      },
    };
  };
  const [open, setModalOpen] = React.useState(false);
  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <WBBox mt={5}>
      <ScrollViewsContainer data={tasks}>
        <WBFlex justifyContent={'space-between'} width={'100%'}>
          <WBFlex flexDirection={['row', 'row']} sx={{ overflowX: 'scroll' }}>
            <WBTypography
              variant={islg ? 'h3' : 'h2'}
              noWrap
              component="div"
              color="dark"
              sx={{
                textAlign: 'left',
              }}
              mb={0}
            >
              {t('recentFilesSent', { ns: 'contacts' })}
            </WBTypography>
            <WBStack
              direction="row"
              my={[0, 0]}
              ml={2}
              spacing={1}
              alignItems={'center'}
            >
              <WBButton
                sx={() => ({
                  ...getSelectedButtonStyle(filesType === 'Outstanding'),
                })}
                onClick={() => setFilesType('Outstanding')}
              >
                {t('outstanding', { ns: 'contacts' })}
              </WBButton>
              <WBButton
                sx={() => ({
                  ...getSelectedButtonStyle(filesType === 'Complete'),
                })}
                onClick={() => setFilesType('Complete')}
              >
                {t('complete', { ns: 'contacts' })}
              </WBButton>
            </WBStack>
          </WBFlex>
          {!isMobile ? (
            <WBStack
              direction="row"
              alignItems={'center'}
              justifyContent={'end'}
            >
              <ScrollViews.Back />
              <ScrollViews.Forward />
            </WBStack>
          ) : null}
        </WBFlex>
        {!hasTasks && (
          <WBTypography mt={1}>{t('noTasks', { ns: 'contacts' })}</WBTypography>
        )}
        <WBBox sx={{ width: '100%' }} mt={4}>
          <ScrollViews
            render={(task) => <ContactFileCard contactFile={task} />}
          />
        </WBBox>
      </ScrollViewsContainer>
      <WBStack
        direction={['column', 'row']}
        rowGap={2}
        columnGap={2}
        spacing={2}
        mb={4}
      >
        <WBButton
          sx={{
            ...theme.typography.body2,
            fontWeight: 'bold',
          }}
          //@ts-ignore - need to add dark to colours
          color="dark"
          size={'large'}
          onClick={() => setModalOpen(true)}
        >
          <WBIcon name="Add" color="inherit" size="small" />
          {`${t('addTask', { ns: 'contacts' })}`}
        </WBButton>
        {open ? (
          <TaskCreation
            open={open}
            handleCloseModal={handleClose}
            contact={!contact?.entity ? contact : undefined}
            client={contact?.entity}
          />
        ) : null}
      </WBStack>
    </WBBox>
  );
}

export default ContactFiles;
