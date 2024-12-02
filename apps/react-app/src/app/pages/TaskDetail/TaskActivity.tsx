import {
  Activity,
  ActivityType,
  Task,
  TaskDirection,
} from '@admiin-com/ds-graphql';
import { WBBox, WBTypography } from '@admiin-com/ds-web';

import { Paper, useTheme } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Timeline from '../../components/Timeline/Timeline';

interface TaskActivityProps {
  task: Task;
}

export const TaskActivity = ({ task }: TaskActivityProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const renderMessage = (activity: Activity) => {
    if (activity?.message === 'TASK_USER_SIGNED') {
      return `${activity?.metadata?.name} ${t('signed', { ns: 'taskbox' })}`;
    }

    if (
      task.direction === TaskDirection.SENDING &&
      activity?.message === 'TASK_CREATED'
    ) {
      return t('taskSent', { ns: 'taskbox' });
    }

    return t(`${activity?.message}`, { ns: 'taskbox' });
  };

  return (
    <WBBox mb={10}>
      <WBTypography
        fontWeight="bold"
        fontSize={{ xs: 'h5.fontSize', sm: 'h3.fontSize' }}
      >
        {t('recentActivity', { ns: 'taskbox' })}
      </WBTypography>
      <Paper
        sx={{
          p: { xs: 2, md: 2 },
          mt: 2,
          fontWeight: 'bold',
          boxShadow: '0 11px 19px -8.5px #636363',
          fontSize: 'body2.fontSize',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Timeline
          items={task?.activity?.items.slice().reverse() ?? []}
          render={(activity: Activity) => (
            <>
              <WBTypography fontWeight={'bold'}>
                {renderMessage(activity)}
              </WBTypography>
              {activity?.createdAt && (
                <WBTypography
                  color={'grey'}
                  fontWeight={'normal'}
                  fontSize={'body2.fontSize'}
                >
                  {DateTime.fromISO(activity.createdAt).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </WBTypography>
              )}
            </>
          )}
        />
      </Paper>
    </WBBox>
  );
};
