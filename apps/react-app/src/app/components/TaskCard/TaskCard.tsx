import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import {
  Task,
  TaskDirection,
  TaskStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBCard,
  WBCardContent,
  WBFlex,
  WBSkeleton,
  WBSvgIcon,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import {
  ToggleButton,
  ToggleButtonProps,
  styled,
  useTheme,
} from '@mui/material';
import React from 'react';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { useTaskToContactName } from '../../hooks/useTaskToName/useTaskToName';
import CheckIcon from '../../../assets/icons/checkicon.svg';
import TaskBadge from '../TaskBadge/TaskBadge';
import PayIDStatus from '../PayIDStatus/PayIDStatus';
import { isPayIDTask } from '../../helpers/payments';
import { useTranslation } from 'react-i18next';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';

const SelectorButton = styled(ToggleButton)(({ theme }) => ({
  padding: '4px',
  marginBottom: theme.spacing(3),
  '&.Mui-selected ': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  backgroundColor: 'transparent',
  border: 0,
}));

interface TaskCardProps extends Omit<ToggleButtonProps, 'value'> {
  task: Task | null;
  onChecked?: (task: Task) => void;
  checked?: boolean;
  direction?: TaskDirection;
}
export const TaskCard = React.forwardRef<any, TaskCardProps>(
  ({ task, onChecked, checked = false, direction, ...props }, ref) => {
    const { t } = useTranslation();
    const { contactName, contactLoading } = useTaskToContactName(task);

    const [hovered, setHovered] = React.useState<boolean>(false);

    const theme = useTheme();

    const handleChecked = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      event.stopPropagation();
      if (task && onChecked) onChecked(task);
      setHovered(false);
    };

    const { signatureRequiredTooltip, isPendingSiganture } =
      useTaskProperty(task);
    const loading = !task;
    const isDraft = task?.status === TaskStatus.DRAFT;

    return (
      <SelectorButton value={(task ?? {}) as any} {...props} ref={ref}>
        <WBCard
          sx={{
            boxShadow: '0 16px 27px -15px rgba(5, 8, 11, 0.27)',
            borderRadius: 0,
            px: 2,
            py: 2,
            width: '100%',
          }}
        >
          {/*TODO - apply this to all CardContent */}
          <WBCardContent
            sx={{
              p: 0,
              '&:last-child': {
                paddingBottom: 0,
              },
            }}
          >
            <WBFlex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {loading ? (
                <WBSkeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ m: 1 }}
                />
              ) : (
                <>
                  <WBBox
                    minWidth="40px"
                    height="40px"
                    sx={{
                      bgcolor: theme.palette.grey[800],
                      '&:hover': {
                        bgcolor: theme.palette.grey[700],
                      },
                    }}
                    m={1}
                    onMouseEnter={() => !isDraft && setHovered(true)}
                    onMouseLeave={() => !isDraft && setHovered(false)}
                    onClick={(e: any) => {
                      if (!isDraft) handleChecked(e);
                    }}
                  >
                    {checked ? (
                      <WBFlex
                        width={'40px'}
                        height={'100%'}
                        bgcolor={theme.palette.success.main}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <WBSvgIcon fontSize="small">
                          <CheckIcon />
                        </WBSvgIcon>
                      </WBFlex>
                    ) : contactName ? (
                      !hovered ? (
                        <WBS3Avatar
                          companyName={contactName}
                          fontSize="h6.fontSize"
                        />
                      ) : null
                    ) : null}
                  </WBBox>
                  <WBFlex
                    flexGrow={1}
                    flexDirection={['column', 'column', 'row', 'column', 'row']}
                    justifyContent={'space-between'}
                    alignItems={{
                      xs: 'start',
                      sm: 'end',
                      md: 'center',
                      lg: 'end',
                      xl: 'center',
                    }}
                  >
                    <WBTypography
                      variant="h4"
                      fontWeight="bold"
                      mb={0}
                      ml={2}
                      textAlign={{ xs: 'left', lg: 'right', xl: 'left' }}
                    >
                      {contactName ? (
                        contactName
                      ) : contactLoading ? (
                        <WBSkeleton width={80}></WBSkeleton>
                      ) : null}
                    </WBTypography>

                    {isPayIDTask(task) ? (
                      <PayIDStatus payment={task?.payments?.items?.[0]} />
                    ) : (
                      <WBTypography
                        color={'text.secondary'}
                        fontWeight={'medium'}
                        variant="body2"
                        ml={2}
                        noWrap
                        mt={{ xs: 1, md: 0 }}
                      >
                        {task ? (
                          task.reference
                        ) : (
                          <WBSkeleton width={80}></WBSkeleton>
                        )}
                      </WBTypography>
                    )}
                  </WBFlex>
                </>
              )}
            </WBFlex>
            {!loading ? (
              <WBFlex
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                mt={3}
              >
                <TaskBadge task={task} direction={direction} />
                <WBBox ml={2}>
                  {isPendingSiganture ? (
                    <WBTooltip title={signatureRequiredTooltip}>
                      <WBBox>
                        <WBTypography
                          fontWeight="inhert"
                          fontSize="inherit"
                          textAlign="right"
                        >
                          {t('signatureRequired', { ns: 'taskbox' })}
                        </WBTypography>
                      </WBBox>
                    </WBTooltip>
                  ) : (
                    task.type !== TaskType.SIGN_ONLY && (
                      <CurrencyNumber
                        number={task.amount ?? 0}
                        fontSize={{ xs: 'h3.fontSize', md: 'h2.fontSize' }}
                      />
                    )
                  )}
                </WBBox>
              </WBFlex>
            ) : (
              <WBSkeleton width={'100%'} height={100} />
            )}
          </WBCardContent>
        </WBCard>
      </SelectorButton>
    );
  }
);
