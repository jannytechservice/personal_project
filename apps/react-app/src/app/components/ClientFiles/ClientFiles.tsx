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
import { ClientFileCard } from './ClientFileCard';
import { ScrollViews, ScrollViewsContainer } from '../ScrollViews/ScrollViews';
import { Contact, Entity, Task } from '@admiin-com/ds-graphql';
import { TaskCreation } from '../../pages/TaskCreation/TaskCreation';

export interface ClientFilesProps {
  tasks: (Task | null | undefined)[];
  client?: Contact & { entity?: Entity };
  filesType: 'Outstanding' | 'Complete';
  setFilesType: (type: 'Outstanding' | 'Complete') => void;
}

export function ClientFiles({
  client,
  tasks,
  setFilesType,
  filesType,
}: ClientFilesProps) {
  const theme = useTheme();
  const islg = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const getSelectedButtonStyle = (isSelected: boolean) => {
    const mode = theme.palette.mode;
    return {
      borderRadius: '30px',
      ...theme.typography.body2,
      fontWeight: 'medium',
      px: 2,
      color: isSelected
        ? theme.palette.common.white
        : mode === 'light'
        ? theme.palette.common.black
        : theme.palette.common.white,
      backgroundColor: `rgba(0,0,0,${isSelected ? 0.9 : 0.1})`,
      '&:hover': {
        color: '#fff',
        backgroundColor: `rgba(0,0,0,1)`,
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
          <WBFlex flexDirection={['column', 'row']}>
            <WBTypography
              variant={islg ? 'h3' : 'h2'}
              noWrap
              component="div"
              color="dark"
              sx={{ textAlign: 'left' }}
              mb={0}
            >
              {t('recentFilesSent', { ns: 'contacts' })}
            </WBTypography>
            <WBStack
              direction="row"
              my={[2, 0]}
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
              sx={{ width: '100%' }}
              alignItems={'center'}
              justifyContent={'end'}
            >
              <ScrollViews.Back />
              <ScrollViews.Forward />
            </WBStack>
          ) : null}
        </WBFlex>
        <WBBox sx={{ width: '100%' }} mt={4}>
          <ScrollViews
            render={(task) => (
              <ClientFileCard client={client} clientFile={task} />
            )}
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
            fontWeight: 'regular',
            px: 2,
            color: theme.palette.common.white,
            backgroundColor: theme.palette.common.black,
          }}
          onClick={() => setModalOpen(true)}
        >
          <WBIcon name="Add" color="inherit" size="small"></WBIcon>
          {`${t('addTask', { ns: 'contacts' })}`}
        </WBButton>
        {open ? (
          <TaskCreation
            open={open}
            handleCloseModal={handleClose}
            contact={!client?.entity ? client : undefined}
            client={client?.entity}
          />
        ) : null}
      </WBStack>
    </WBBox>
  );
}

export default ClientFiles;
