import {
  WBBox,
  WBCard,
  WBCardContent,
  WBFlex,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { Task, TaskDirection } from '@admiin-com/ds-graphql';
import TaskBadge from '../TaskBadge/TaskBadge';
import PdfThumbnail from '../PdfThumbnail/PdfThumbnail';
import React from 'react';

interface ContactFileCardProps {
  contactFile: Task | undefined;
}
export function ContactFileCard({ contactFile }: ContactFileCardProps) {
  const ref = React.useRef(null);

  return (
    <WBCard
      sx={{
        //px: 2,
        //pt: 0.5,
        bgcolor: 'background.default',
        minWidth: '300px',
      }}
    >
      <WBCardContent>
        <WBFlex justifyContent={'space-between'} width={'100%'}>
          {contactFile ? (
            <>
              <WBTypography variant="h5" mr={2} noWrap>
                {contactFile.reference}
              </WBTypography>
              <CurrencyNumber
                number={(contactFile.amount || 0) / 100}
                variant="h5"
                fontWeight={800}
              />
            </>
          ) : (
            <WBSkeleton height={'48px'} width="100%" />
          )}
        </WBFlex>
        <WBFlex justifyContent={'space-between'} mt={2}>
          {contactFile ? (
            <TaskBadge task={contactFile} direction={TaskDirection.RECEIVING} />
          ) : (
            <WBSkeleton height={'66px'} width="100%" />
          )}
          {contactFile ? (
            <WBBox
              flex={1}
              sx={{
                maxWidth: '60px',
                height: '80px',
              }}
            >
              {contactFile?.documents?.[0]?.key && (
                <PdfThumbnail task={contactFile} ref={ref} />
              )}
              {/* <TaskPdfSignature task={contactFile} minHeight={100} /> */}
            </WBBox>
          ) : (
            <WBSkeleton sx={{ ml: 4 }} height={'66px'} width="100%" />
          )}
        </WBFlex>
      </WBCardContent>
    </WBCard>
  );
}
