import * as React from 'react';
import {
  WBBox,
  WBCard,
  WBCardContent,
  WBFlex,
  WBGrid,
  WBIconButton,
  WBTypography,
} from '@admiin-com/ds-web';
import { Skeleton, useTheme } from '@mui/material';
import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { TaskDirection } from '@admiin-com/ds-graphql';
import { EntityCardTasks } from './EntityCardTasks';
import { EntityTaskData } from '../../hooks/useUpcomingPayments/useUpcomingPayments';
import { useGotoTaskBox } from '../../hooks/useSelectedEntity/useSelectedEntity';
import VerifiedIcon from '../../../assets/icons/verified.svg';
import NotVerifiedIcon from '../../../assets/icons/not-verified.svg';
import { isVerifiedEntity } from '../../helpers/entities';
import LoadSvgIcon from '../../component/LoadSvgIcon/LoadSvgIcon';
import VerificationDlg from '../../pages/VerificationDlg/VerificationDlg';

interface EntityCardListItemProps {
  entity?: EntityTaskData;
}
export function EntityCardItem({
  entity: entityTaskData,
}: EntityCardListItemProps) {
  const gotoTaskBox = useGotoTaskBox();
  const entity = entityTaskData?.entity;
  const theme = useTheme();
  //@ts-ignore
  const verifiedIcon = entity ? (
    isVerifiedEntity(entity) ? (
      <LoadSvgIcon
        component={VerifiedIcon}
        width={30}
        height={30}
        fill={theme.palette.success.dark}
      />
    ) : (
      <LoadSvgIcon
        component={NotVerifiedIcon}
        fill={theme.palette.warning.light}
        width={30}
        height={30}
      />
    )
  ) : null;
  const [verificationModal, setVerificationModal] =
    React.useState<boolean>(false);
  return (
    <WBCard sx={{ height: '100%' }}>
      <WBCardContent
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <WBBox
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          flex={1}
        >
          <WBBox
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (entity?.id) gotoTaskBox(entity?.id);
            }}
          >
            {entity ? (
              <WBS3Avatar
                imgKey={entity.logo?.key}
                identityId={entity.logo?.identityId}
                level={entity.logo?.level}
                companyName={entity.name}
              />
            ) : (
              <Skeleton variant="circular" width={40} height={40} />
            )}
            <WBTypography variant="h4" mb={0} ml={2}>
              {entity ? entity.name : <Skeleton width={80}></Skeleton>}
            </WBTypography>
          </WBBox>
          <WBFlex sx={{ flex: 1, justifyContent: 'flex-end' }}>
            <WBIconButton
              onClick={() => {
                if (entity && !isVerifiedEntity(entity))
                  setVerificationModal(true);
              }}
            >
              {verifiedIcon}
            </WBIconButton>
          </WBFlex>
        </WBBox>
        <WBGrid container spacing={3} mt={2}>
          <WBGrid md={6} xs={12} sx={{ cursor: 'pointer' }}>
            <EntityCardTasks
              entity={entityTaskData?.to}
              direction={TaskDirection.RECEIVING}
              onClick={() => {
                if (entity?.id) gotoTaskBox(entity?.id);
              }}
            />
          </WBGrid>
          <WBGrid md={6} xs={12} sx={{ cursor: 'pointer' }}>
            <EntityCardTasks
              entity={entityTaskData?.from}
              direction={TaskDirection.SENDING}
              onClick={() => {
                if (entity?.id) gotoTaskBox(entity?.id, TaskDirection.SENDING);
              }}
            />
          </WBGrid>
        </WBGrid>
      </WBCardContent>
      {entity && (
        <VerificationDlg
          entity={entity}
          onSuccess={() => {
            console.log('success');
            // setVerified(true);
          }}
          open={verificationModal}
          onClose={() => setVerificationModal(false)}
        />
      )}
    </WBCard>
  );
}
