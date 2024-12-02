import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { Contact, getUser, Referral } from '@admiin-com/ds-graphql';
import {
  WBChip,
  WBIconButton,
  WBList,
  WBListItem,
  WBListItemAvatar,
  WBListItemIcon,
  WBListItemText,
  WBSvgIcon,
  WBTooltip,
} from '@admiin-com/ds-web';
import { gql, useQuery } from '@apollo/client';
import { ListItemButton, Skeleton } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CheckIcon from '../../../assets/icons/check.svg';
import DisableIcon from '../../../assets/icons/disable.svg';
interface ReferredListItemProps {
  selected?: boolean;
  loading: boolean;
  referral?: Referral;
}

export const ReferredListItem = React.forwardRef<
  HTMLDivElement,
  ReferredListItemProps
>(({ referral, loading: propsLoading, selected = false }, ref) => {
  const { t } = useTranslation();
  const { data, loading: referralLoading } = useQuery(gql(getUser), {
    variables: {
      id: referral?.referredId,
    },
    skip: !referral?.referredId,
  });
  const loading = propsLoading || referralLoading;
  const primaryText = `${data?.getUser?.firstName ?? ''} ${
    data?.getUser?.lastName ?? ''
  }`;
  const secondaryText = referral?.referredCompleted ? (
    t('completed', { ns: 'referrals' })
  ) : (
    <i>{t('inProgress', { ns: 'referrals' })}</i>
  );

  const chipText = referral?.referredCompleted ? '$50' : '1/2';
  const tooltip = (
    <WBList>
      <WBListItem>
        <WBListItemIcon sx={{ mr: 1 }}>
          <WBSvgIcon fontSize="small">
            <CheckIcon />
          </WBSvgIcon>
        </WBListItemIcon>
        <WBListItemText
          primary={t('registration', { ns: 'referrals' })}
          primaryTypographyProps={{ fontWeight: 'bold', color: 'common.black' }}
        />
      </WBListItem>
      <WBListItem>
        <WBListItemIcon sx={{ mr: 1 }}>
          <WBSvgIcon fontSize="small">
            <DisableIcon />
          </WBSvgIcon>
        </WBListItemIcon>
        <WBListItemText
          primary={t('send4invoices', { ns: 'referrals' })}
          primaryTypographyProps={{ fontWeight: 'bold', color: 'common.black' }}
          secondary={t('send&Paid', {
            ns: 'referrals',
            color: 'common.black',
            sent: referral?.taskPaidCount ?? 0,
          })}
        />
      </WBListItem>
    </WBList>
  );
  return (
    <ListItemButton
      ref={ref}
      sx={{
        paddingX: 0,
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
    >
      <WBListItem
        disablePadding
        secondaryAction={
          !loading && (
            <WBTooltip title={tooltip}>
              <WBIconButton
                edge="end"
                sx={{
                  display: { xs: 'none', sm: 'inline-block' },
                  color: 'common.white',
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
                size="small"
              >
                <WBChip
                  label={chipText}
                  sx={{
                    px: 1,
                    fontWeight: 'bold',
                    color: !referral?.referredCompleted
                      ? 'common.black'
                      : 'common.white',
                    bgcolor: referral?.referredCompleted
                      ? 'warning.main'
                      : 'common.white',
                  }}
                />
              </WBIconButton>
            </WBTooltip>
          )
        }
      >
        <WBListItemAvatar>
          {!loading ? (
            <WBS3Avatar
              sx={{
                borderRadius: '3px',
                bgcolor: 'common.white',
                color: 'common.black',
              }}
              companyName={primaryText}
              fontSize="h6.fontSize"
            />
          ) : (
            <Skeleton width={40} height={40} variant="rectangular" />
          )}
        </WBListItemAvatar>

        {!loading ? (
          <WBListItemText
            primary={primaryText}
            secondary={secondaryText}
            primaryTypographyProps={{
              fontWeight: 'bold',
              color: 'common.white',
            }}
            secondaryTypographyProps={{
              color: 'common.white',
              fontSize: 'body2',
            }}
          />
        ) : (
          <WBListItemText>
            <Skeleton width={100} />
            <Skeleton width={80} />
          </WBListItemText>
        )}
      </WBListItem>
    </ListItemButton>
  );
});
