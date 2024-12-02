import {
  WBBox,
  WBCard,
  WBCardContent,
  WBFlex,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { Theme } from '@mui/material';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { Contact, Task, TaskDirection } from '@admiin-com/ds-graphql';
import TaskBadge from '../TaskBadge/TaskBadge';
import PdfThumbnail from '../PdfThumbnail/PdfThumbnail';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

interface ClientFileCardProps {
  clientFile: Task | undefined;
  client?: Contact;
}
export function ClientFileCard({ client, clientFile }: ClientFileCardProps) {
  const ref = React.useRef(null);

  const entityId =
    clientFile?.fromId !== client?.entityId && clientFile?.fromType === 'ENTITY'
      ? clientFile?.fromId
      : clientFile?.toId !== client?.entityId && clientFile?.toType === 'ENTITY'
      ? clientFile?.toId
      : undefined;
  console.log(entityId);

  const { data } = useQuery(
    gql(`query GetAutoComplete($id: ID!) {
    getAutoComplete(id: $id) {
      entity {
        id
        type
        taxNumber
        companyNumber
        name
        legalName
        searchName
        legalName
    }
    }
  }`),
    {
      variables: { id: entityId },
      skip: !entityId,
    }
  );

  const entity = data?.getAutoComplete?.entity;

  const navigate = useNavigate();

  return (
    <WBCard
      sx={{
        //px: 2,
        //pt: 0.5,
        bgcolor: 'background.default',
        width: '300px',
        flex: 1,
        cursor: 'pointer',
      }}
      onClick={() => {
        navigate(`/${client?.entityId}/taskbox/${clientFile?.id}`);
      }}
    >
      <WBCardContent>
        {clientFile ? (
          <>
            <WBTypography
              variant="h5"
              mr={2}
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '52.8px',
              }}
            >
              {entity?.legalName || ''}
            </WBTypography>
            <WBFlex
              justifyContent={'space-between'}
              width={'100%'}
              alignItems={'center'}
            >
              <CurrencyNumber
                number={(clientFile.amount || 0) / 100}
                variant="h5"
                fontWeight={800}
              />
              <WBBox ml={2}>
                <WBTypography variant="body1" mr={2} noWrap textAlign={'right'}>
                  {clientFile.reference}
                </WBTypography>
              </WBBox>
            </WBFlex>
          </>
        ) : (
          <WBSkeleton height={'48px'} width="100%" />
        )}
        <WBFlex justifyContent={'space-between'} mt={2}>
          {clientFile ? (
            <TaskBadge task={clientFile} direction={TaskDirection.RECEIVING} />
          ) : (
            <WBSkeleton height={'66px'} width="100%" />
          )}
          {clientFile ? (
            <WBBox
              flex={1}
              sx={{
                maxWidth: '60px',
                height: '80px',
                bgcolor: (theme: Theme) => theme.palette.grey[300],
              }}
            >
              {clientFile?.documents?.[0]?.key && (
                <PdfThumbnail task={clientFile} ref={ref} />
              )}
              {/* <TaskPdfSignature task={clientFile} minHeight={100} /> */}
            </WBBox>
          ) : (
            <WBSkeleton sx={{ ml: 4 }} height={'66px'} width="100%" />
          )}
        </WBFlex>
      </WBCardContent>
    </WBCard>
  );
}
