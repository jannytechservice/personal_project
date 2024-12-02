import {
  WBBox,
  WBFlex,
  WBIcon,
  WBLink,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import RewardBackgroundImage from '../../../assets/images/reward-background@3x.png';
import { truncateString } from '../../helpers/string';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  linearProgressClasses,
  styled,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';
import { gql, useQuery } from '@apollo/client';
import {
  Activity,
  getActivitiesByUser,
  RewardStatus,
} from '@admiin-com/ds-graphql';
import { dateTimeFormatFromISO, mergeUniqueItems } from '@admiin-com/ds-common';
import React from 'react';
import PageHeaderMobile from '../../components/PageHeaderMobile/PageHeaderMobile';
import { NetworkPartners } from './NetworkPartners';

const loyaltyStatusIcons = {
  GOLD: () => import('../../../assets/icons/rewards-gold-full.svg'),
  SILVER: () => import('../../../assets/icons/rewards-silver-full.svg'),
  BRONZE: () => import('../../../assets/icons/rewards-bronze-full.svg'),
  DIAMOND: () => import('../../../assets/icons/rewards-diamond-full.svg'),
  PLATINUM: () => import('../../../assets/icons/rewards-platinum-full.svg'),
};

const LoyaltyStatusIcon = ({
  loyaltyStatus,
}: {
  loyaltyStatus: RewardStatus | undefined;
}) => {
  const [IconComponent, setIconComponent] =
    React.useState<React.ComponentType | null>(null); // Ensures it's a valid React component or null

  React.useEffect(() => {
    // Fallback to BRONZE if loyaltyStatus is undefined
    const status = loyaltyStatus ?? 'BRONZE';

    // Dynamically import the icon based on loyalty status
    loyaltyStatusIcons[status]()
      .then((module) => {
        // Ensure module is valid and contains a default export (which should be a React component)
        setIconComponent(() => module?.default || null);
      })
      .catch((error) => {
        console.error('Failed to load icon:', error);
      });
  }, [loyaltyStatus]);

  // If IconComponent is not yet loaded, render a placeholder or null
  if (!IconComponent) {
    return <div>Loading...</div>; // Placeholder for loading state
  }

  // Render the loaded icon
  // @ts-ignore
  return <IconComponent width={'117px'} height={'40px'} />;
};
/* eslint-disable-next-line */
export interface TemplatesProps {}

const BorderLinearProgress = styled(LinearProgress)(
  ({ theme }: { theme: Theme }) => ({
    height: 15,
    borderRadius: 14,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.background.default,
      // ...theme.applyStyles('dark', {
      //   backgroundColor: theme.palette.grey[800],
      // }),
      marginTop: '0px',
      marginBottom: '0px',
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 14,
      backgroundImage:
        'linear-gradient(96deg, #ffd700 30%, #ffa500 62%, #ff8c00 90%)',
      // ...theme.applyStyles('dark', {
      //   backgroundColor: '#308fe8',
      // }),
    },
  })
);

export function Rewards(props: TemplatesProps) {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const point = user.pointsBalance || 0;
  const { data: activitiesData, fetchMore } = useQuery(
    gql(getActivitiesByUser),
    {
      variables: { id: user.id, sortDirection: 'DESC', limit: 5 },
      skip: !user.id,
    }
  );
  const activities =
    activitiesData?.getActivitiesByUser?.items?.map((activity: Activity) => ({
      ...JSON.parse(activity?.metadata?.name ?? ''),
      createdAt: activity.createdAt,
    })) || [];

  console.log('activities: ', activities);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activityOpened, setActivityOpened] = React.useState(!isMobile);
  const handleLoadMore = () => {
    const currentToken = activitiesData?.getActivitiesByUser?.nextToken;

    if (currentToken) {
      fetchMore({
        variables: {
          nextToken: currentToken,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            ...fetchMoreResult,
            getActivitiesByUser: {
              ...fetchMoreResult.getActivitiesByUser,
              items: mergeUniqueItems(
                prevResult.getActivitiesByUser?.items ?? [],
                fetchMoreResult.getActivitiesByUser?.items ?? [],
                ['id'] // Assuming 'id' is the unique key
              ),
              nextToken: fetchMoreResult.getActivitiesByUser.nextToken, // Ensure the new token is updated
            },
          };
        },
      });
    }
  };
  return (
    <WBBox my={[3, 7]} mx={[3, 3, 3, 10]}>
      <WBFlex flexDirection={['column', 'row']}>
        <WBBox flex={1}>
          <WBBox width={['100%', '80%', '80%', '60%']}>
            <PageHeaderMobile>
              <WBTypography variant="h2">
                {t('rewards', { ns: 'rewards' })}
              </WBTypography>
            </PageHeaderMobile>

            <WBTypography>
              {t('rewardsDescription', { ns: 'rewards' })}
              <b>{t('taxRewards', { ns: 'rewards' })}</b>
            </WBTypography>
            <WBBox mt={5}>
              <WBTypography variant="h3">
                {t('pointBalance', { ns: 'rewards' })}
              </WBTypography>

              <WBBox
                mt={2}
                sx={{
                  // bgcolor: 'primary.main',
                  boxShadow: 6,
                  backgroundImage: `url(${RewardBackgroundImage})`,
                  backgroundSize: 'cover', // Ensures the image covers the entire box
                  backgroundPosition: 'center', // Centers the image within the box
                  backgroundRepeat: 'no-repeat', // Prevents the image from repeating
                }}
              >
                <WBFlex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  p={4}
                  py={3}
                >
                  <WBTypography variant="h3" color={'white'}>
                    {point.toLocaleString('en-US')}
                  </WBTypography>
                  <WBTypography
                    variant="h3"
                    fontWeight={'normal'}
                    color={'white'}
                  >
                    {t('points', { ns: 'rewards' })}
                  </WBTypography>
                </WBFlex>
              </WBBox>
            </WBBox>

            <WBBox mt={5}>
              <Accordion
                expanded={activityOpened}
                onChange={(_, expanded) => setActivityOpened(expanded)}
                // defaultExpanded={!isMobile}
                disableGutters
                sx={{ my: 0 }}
              >
                <AccordionSummary
                  expandIcon={
                    <WBIcon name="ChevronDown" color={'black'} size={2} />
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ backgroundColor: 'grey.300', px: 5, py: 3, my: 0 }}
                >
                  <WBFlex bgcolor={'grey.300'}>
                    <WBTypography variant="h5" color="#000" mb={0}>
                      {t('recentActivities', { ns: 'rewards' })}
                    </WBTypography>
                  </WBFlex>
                </AccordionSummary>
                <AccordionDetails>
                  {activities.map((activity: any, index: number) => (
                    <WBBox key={index} mt={[1, 3]} px={[1, 2, 5]}>
                      <WBFlex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <WBTypography
                          fontWeight={'medium'}
                          textTransform={'uppercase'}
                          flex={3}
                        >
                          {truncateString(activity.name, 25)}
                        </WBTypography>
                        <WBTypography
                          fontWeight={'medium'}
                          variant="body2"
                          py={0.5}
                          px={1}
                          noWrap
                          ml={2}
                          sx={{ borderRadius: '14px' }}
                          bgcolor={
                            activity.points >= 0 ? 'success.main' : 'error.main'
                          }
                          color={
                            activity.points >= 0
                              ? 'common.black'
                              : 'common.white'
                          }
                        >
                          {`${activity.points >= 0 ? '+' : '-'} ${Math.abs(
                            activity.points
                          ).toLocaleString('en-US')}`}
                        </WBTypography>
                      </WBFlex>
                      <WBTypography
                        variant="body2"
                        color={'text.primary'}
                        fontStyle={'italic'}
                      >
                        {dateTimeFormatFromISO(activity.createdAt)}
                      </WBTypography>
                    </WBBox>
                  ))}
                  {activitiesData?.getActivitiesByUser?.nextToken && (
                    <WBBox px={5} mt={3}>
                      <WBLink
                        color="primary.main"
                        underline="always"
                        component={'button'}
                        onClick={() => {
                          handleLoadMore();
                        }}
                      >
                        {t('loadMore', { ns: 'rewards' })}
                      </WBLink>
                    </WBBox>
                  )}
                </AccordionDetails>
              </Accordion>
            </WBBox>
          </WBBox>
        </WBBox>
        <WBBox flex={1} mt={[5, 0]}>
          <WBBox py={1}>
            <LoyaltyStatusIcon
              loyaltyStatus={user.loyaltyStatus ?? RewardStatus.BRONZE}
            />
            <WBFlex
              mt={2}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <WBTypography variant="h3">
                {t('loyaltyStatus', { ns: 'rewards' })}
              </WBTypography>
              <WBTypography variant="h5" fontWeight={'bold'}>
                {`${user.statusPoint || 0}/${
                  user.nextLoyaltyStatusPoint || 300
                }`}
              </WBTypography>
            </WBFlex>
            <WBBox
              sx={{
                p: 1,
                boxShadow: '0 6px 12px 0 rgba(0, 0, 0, 0.12);',
                borderRadius: '14px',
              }}
              mt={1}
            >
              <BorderLinearProgress
                variant="determinate"
                value={
                  ((user.statusPoint || 0) /
                    (user.nextLoyaltyStatusPoint || 0)) *
                  100
                }
                sx={{ my: 2 }}
              />
            </WBBox>
            {user.loyaltyStatus === RewardStatus.DIAMOND ? (
              <WBTypography mt={2}>
                {t('rewardMaxStatus', { ns: 'rewards' })}
              </WBTypography>
            ) : (
              <WBTypography
                mt={2}
                dangerouslySetInnerHTML={{
                  __html: t('loyaltyDescription', {
                    ns: 'rewards',
                    status: user.nextLoyaltyStatus || 'Silver',
                    transaction:
                      ((user.nextLoyaltyStatusPoint || 0) -
                        (user.statusPoint || 0)) /
                      5,
                  }),
                }}
              />
            )}
            <NetworkPartners />
          </WBBox>
        </WBBox>
      </WBFlex>
    </WBBox>
  );
}

export default Rewards;
