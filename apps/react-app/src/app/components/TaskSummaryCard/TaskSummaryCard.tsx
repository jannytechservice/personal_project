import {
  AutocompleteResult,
  PaymentFrequency,
  PaymentMethodType,
  TaskGuest,
  TaskSettlementStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBDivider,
  WBFlex,
  WBLink,
  WBSkeleton,
  WBTypography,
} from '@admiin-com/ds-web';
import { alpha, useTheme } from '@mui/material';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import React from 'react';
import { getName } from '../../helpers/contacts';
import { truncateString } from '../../helpers/string';
import { BreakDownContainer } from '../BreakDownContainer/BreakDownContainer';
import TaskBreakDownBody from '../TaskBreakDownBody/TaskBreakDownBody';
import { calculateFee, getDocumentName } from '../../helpers/tasks';
import { downloadPdf } from '../../helpers/signature';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import PdfViewModal from '../PdfViewModal/PdfViewModal';
import PdfThumbnail from '../PdfThumbnail/PdfThumbnail';
import PdfPotraitContainer from '../PdfPotraitContainer/PdfPotraitContainer';
import PdfViewer from '../PdfViewer/PdfViewer';
import { useDocumentUrl } from '../../hooks/useDocumentUrl/useDocumentUrl';
import { useTaskProperty } from '../../hooks/useTaskProperty/useTaskProperty';

export interface TaskSummaryCardProps {
  task: TaskGuest | null | undefined;
  isGuest?: boolean;
  annotations?: any;
  installment?: number;
}

export function TaskSummaryCard({
  isGuest,
  annotations,
  installment = 1,
  task,
}: TaskSummaryCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const documentUrl = useDocumentUrl(task);
  const [truncateStringLength, setTruncateStringLength] = React.useState<
    number | undefined
  >(60);

  const noData = (
    <WBTypography
      component={'span'}
      fontSize={'inherit'}
      fontStyle={'italic'}
      fontWeight={'medium'}
      color={'error.main'}
    >
      {t('noData', { ns: 'taskbox' })}
    </WBTypography>
  );

  const isTax =
    (task?.from as AutocompleteResult | undefined)?.metadata?.subCategory ===
    'TAX';
  const isBpay =
    !isTax &&
    //@ts-ignore
    (task?.from as AutocompleteResult | undefined)?.metadata?.type === 'BPAY';

  const dueDate = React.useMemo(() => {
    let dueAt: string | undefined | null = task?.dueAt;
    if (isTax) {
      dueAt = task?.paymentAt;
    } else if (task?.paymentFrequency !== PaymentFrequency.ONCE) {
      if (task && 'firstPaymentAt' in task)
        dueAt = task?.firstPaymentAt as string;
    }
    return dueAt;
  }, [isTax, task]);

  const [pdfViewerOpen, setPdfViewerOpen] = React.useState<boolean>(false);

  const { totalAmount = 0 } = calculateFee(
    task ? [task as any] : [],
    PaymentMethodType.CARD
  );
  const { pdfSignatureRef } = useTaskBoxContext();
  const downloadDocument = async () => {
    try {
      await downloadPdf(pdfSignatureRef, getDocumentName(task));
    } catch (err) {
      console.log('ERROR CREATING DOCUMENT URL', err);
    }
  };
  const document =
    documentUrl && task?.documents?.[0]?.key ? (
      <PdfViewer
        ref={pdfSignatureRef ?? null}
        annotations={annotations ?? task?.annotations}
        documentUrl={documentUrl}
      />
    ) : task?.documents?.[0]?.key ? (
      <WBSkeleton variant={'rectangular'} width={'100%'} height={'100%'} />
    ) : null;

  return (
    <WBFlex
      sx={{
        flexDirection: 'column',
        minHeight: '630px',
        minWidth: '100%',
        boxShadow: theme.shadows[6],
        bgcolor: theme.palette.background.default,
      }}
    >
      <WBBox sx={{ px: 5 }} flexGrow={1}>
        <WBFlex justifyContent={'space-between'} mt={5}>
          <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
            <WBTypography fontSize={'inherit'}>
              {t('from', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {isGuest
                ? getName(task?.fromEntity)
                : getName(task?.from) || noData}
            </WBTypography>
          </WBBox>

          {task?.lodgementAt && isTax ? (
            <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
              <WBTypography fontSize={'inherit'} textAlign={'end'}>
                {t('lodgementAt', { ns: 'taskbox' })}
              </WBTypography>
              <WBTypography
                fontSize={'inherit'}
                fontWeight={'bold'}
                textAlign={'end'}
                my={0.3}
              >
                {DateTime.fromISO(task?.lodgementAt).toLocaleString(
                  DateTime.DATE_SHORT
                )}
              </WBTypography>
            </WBBox>
          ) : (
            <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
              <WBTypography fontSize={'inherit'} textAlign={'end'}>
                {t('dueAt', { ns: 'taskbox' })}
              </WBTypography>
              <WBTypography
                fontSize={'inherit'}
                textAlign={'end'}
                fontWeight={'bold'}
                my={0.3}
              >
                {dueDate
                  ? DateTime.fromISO(dueDate).toLocaleString(
                      DateTime.DATE_SHORT
                    )
                  : ''}
              </WBTypography>
            </WBBox>
          )}
        </WBFlex>
        <WBFlex justifyContent={'space-between'} mt={5} my={2}>
          <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
            <WBTypography fontSize={'inherit'} fontWeight={'normal'}>
              {t('to', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {isGuest
                ? getName(task?.toContact ?? task?.toEntity)
                : task?.to
                ? getName(task?.to)
                : // cloneContactWithSearchName(task?.to as Contact)?.searchName
                  noData}
            </WBTypography>
          </WBBox>
          {isTax && task?.type !== TaskType.SIGN_ONLY ? (
            <WBBox sx={{ fontSize: theme.typography.body2.fontSize }}>
              <WBTypography fontSize={'inherit'} textAlign={'end'}>
                {t('paymentAt', { ns: 'taskbox' })}
              </WBTypography>
              <WBTypography
                fontSize={'inherit'}
                textAlign={'end'}
                fontWeight={'bold'}
                my={0.3}
              >
                {dueDate
                  ? DateTime.fromISO(dueDate).toLocaleString(
                      DateTime.DATE_SHORT
                    )
                  : ''}
              </WBTypography>
            </WBBox>
          ) : null}
          {/* {isGuest && (task?.documents ?? [])?.length > 0 ? (
           <WBFlex>
           <WBLink
           component={'button'}
           fontSize={'body2.fontSize'}
           underline="always"
           onClick={() => {
           setPdfViewerOpen(true);
           // setSelectedTask(task);
           }}
           >
           {t('viewInvoice', { ns: 'taskbox' })}
           </WBLink>
           </WBFlex>
           ) : null} */}
        </WBFlex>

        <WBDivider
          sx={{
            bgcolor: theme.palette.grey[300],
            my: 4,
          }}
          light
        />
        <BreakDownContainer>
          {(show: boolean) => (
            <WBFlex
              height={isGuest ? '380px' : '100%'}
              flexDirection={['column']}
              mb={[3, 6]}
            >
              <WBFlex>
                {!show && isGuest && (
                  <WBFlex
                    flexDirection={'column'}
                    minHeight={['150px', '380px']}
                    flex={{ xs: 0, sm: 6 }}
                    // px={[0, 5, 10]}
                    sx={{ bgcolor: 'transparent' }}
                    mb={[3, 4]}
                    flexGrow={1}
                  >
                    {document}
                  </WBFlex>
                )}
                {((isGuest && task && task?.type !== TaskType.SIGN_ONLY) ||
                  (!isGuest && task?.type !== TaskType.SIGN_ONLY)) && (
                  <WBFlex
                    flexGrow={1}
                    flexDirection={'column'}
                    alignItems={'flex-end'}
                    // pl={[0, 2, 3]}
                  >
                    <WBTypography variant="h5">
                      {t('amount', { ns: 'taskbox' })}{' '}
                      {isTax
                        ? t(task?.settlementStatus ?? '', { ns: 'taskbox' })
                        : ''}
                    </WBTypography>
                    {task?.amount ? (
                      <CurrencyNumber
                        color={'text.primary'}
                        number={
                          isGuest
                            ? totalAmount / 100
                            : ((typeof task?.amount === 'string'
                                ? parseFloat(task?.amount)
                                : task?.amount) ?? 0) / (isGuest ? 100 : 1)
                        }
                        variant="h2"
                      />
                    ) : (
                      <WBTypography
                        fontSize={{ xs: 'h5.fontSize', sm: 'h3.fontSize' }}
                        fontStyle={'italic'}
                        fontWeight={'medium'}
                        color={'grey'}
                      >
                        {t('noData', { ns: 'taskbox' })}
                      </WBTypography>
                    )}
                    <WBTypography
                      fontWeight={'medium'}
                      sx={{
                        textDecorationLine: 'underline',
                        textDecorationStyle: 'dashed',
                        textUnderlineOffset: '5px',
                        // borderBottom: `1px dashed ${theme.palette.common.black}`,
                      }}
                    >
                      {t(task?.paymentFrequency ?? '', { ns: 'taskbox' })}{' '}
                      {!isGuest
                        ? task?.numberOfPayments
                          ? `(${task?.numberOfPayments})`
                          : ''
                        : task?.numberOfPayments && task?.numberOfPayments > 1
                        ? `(${installment} of ${
                            task?.numberOfPayments
                              ? `${task?.numberOfPayments} payments)`
                              : ''
                          }`
                        : ''}
                    </WBTypography>
                    {isGuest && (
                      <WBBox mt={1}>
                        <BreakDownContainer.Link
                          title={t('showBreakDown', {
                            ns: 'taskbox',
                          })}
                        />
                      </WBBox>
                    )}
                  </WBFlex>
                )}
              </WBFlex>
              {isGuest && document}
              {isGuest && !show && (task?.documents ?? [])?.length > 0 ? (
                <WBFlex>
                  <WBLink
                    component={'button'}
                    fontSize={'body2.fontSize'}
                    underline="always"
                    onClick={downloadDocument}
                    mt={[2, 0]}
                  >
                    {t('downloadDocument', { ns: 'taskbox' })}
                  </WBLink>
                </WBFlex>
              ) : null}
              <BreakDownContainer.Body>
                <WBBox mt={3}>
                  <TaskBreakDownBody task={task} isGuest />
                </WBBox>
              </BreakDownContainer.Body>
            </WBFlex>
          )}
        </BreakDownContainer>
      </WBBox>
      <WBFlex
        justifyContent={'space-between'}
        mt={3}
        sx={{
          bgcolor: alpha(theme.palette.warning.main, 0.1),
        }}
        p={5}
      >
        {!isGuest && (
          <WBBox flex={1} sx={{ fontSize: theme.typography.body2.fontSize }}>
            <WBTypography fontSize={'inherit'}>
              {t('type', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {t(
                isTax &&
                  task?.settlementStatus === TaskSettlementStatus.REFUNDABLE
                  ? 'refundable'
                  : task?.type ?? '',
                { ns: 'taskbox' }
              )}
            </WBTypography>
          </WBBox>
        )}

        <WBBox
          flex={1}
          sx={{
            fontSize: theme.typography.body2.fontSize,
          }}
        >
          <WBTypography fontSize={'inherit'}>
            {t(
              task?.type === TaskType.SIGN_ONLY ? 'documentName' : 'reference',
              { ns: 'taskbox' }
            )}
          </WBTypography>
          <WBTypography fontSize={'inherit'} fontWeight={'bold'} mt={0.3}>
            {task?.reference || noData}
          </WBTypography>
          {(isTax || isBpay) && (
            <>
              <WBTypography fontSize={'inherit'} mt={1}>
                {t(isTax ? 'paymentReferenceNumber' : 'bpayReferenceNumber', {
                  ns: 'taskbox',
                })}
              </WBTypography>
              <WBTypography fontSize={'inherit'} fontWeight={'bold'} mt={0.3}>
                {task?.bpayReferenceNumber || noData}
              </WBTypography>
            </>
          )}
        </WBBox>

        {isGuest && task?.notes && (
          <WBBox
            flex={1}
            ml={2}
            sx={{ fontSize: theme.typography.body2.fontSize }}
          >
            <WBTypography fontSize={'inherit'}>
              {t('note', { ns: 'taskbox' })}
            </WBTypography>
            <WBTypography fontSize={'inherit'} fontWeight={'bold'} my={0.3}>
              {t(truncateString(task?.notes ?? '', truncateStringLength), {
                ns: 'taskbox',
              })}{' '}
              {truncateStringLength ? (
                <WBLink
                  underline="always"
                  fontSize={'inherit'}
                  fontWeight={'bold'}
                  onClick={() => {
                    setTruncateStringLength(undefined);
                  }}
                  component={'button'}
                >
                  {t('viewMore', { ns: 'taskbox' })}
                </WBLink>
              ) : (
                <WBLink
                  underline="always"
                  fontSize={'inherit'}
                  fontWeight={'bold'}
                  onClick={() => {
                    setTruncateStringLength(60);
                  }}
                  component={'button'}
                >
                  {t('viewLess', { ns: 'taskbox' })}
                </WBLink>
              )}
            </WBTypography>
          </WBBox>
        )}
      </WBFlex>
      <PdfViewModal
        open={pdfViewerOpen}
        onClose={() => {
          setPdfViewerOpen(false);
        }}
        annotations={isGuest ? annotations : null}
        task={task}
      />
    </WBFlex>
  );
}

export default TaskSummaryCard;
