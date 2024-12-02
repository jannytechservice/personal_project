import {
  getTaskGuest as GET_TASK_GUEST,
  getTaskPublic as GET_TASK_PUBLIC,
  PaymentMethod,
  TaskGuest,
  createPaymentGuest as CREATE_PAYMENT_GUEST,
  updateTaskGuest as UPDATE_TASK_GUEST,
  getPaymentGuest as GET_PAYMENT_GUEST,
  PaymentGuest,
  createPaymentScheduledGuest as CREATE_SCHEDULED_PAYMENT_GUEST,
  TaskStatus,
  PaymentStatus,
  TaskType,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBContainer,
  WBFlex,
  WBLink,
  WBSkeleton,
  WBStack,
  WBTypography,
  useMediaQuery,
  useSnackbar,
  useTheme,
} from '@admiin-com/ds-web';
import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import TaskSummaryCard from '../TaskSummaryCard/TaskSummaryCard';
import { CCForm } from '../HostedFields/CCForm';
import CreditCardIcons from '../../../assets/icons/creditcards.svg';
import { CSIsLoggedIn as IS_LOGGED_IN } from '@admiin-com/ds-graphql';
import React, { useRef } from 'react';
import { useClientContext } from '../ApolloClientProvider/ApolloClientProvider';
import AdmiinLogo from '../AdmiinLogo/AdmiinLogo';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import { getAnnotation } from '../../helpers/signature';
import { TaskBoxContext } from '../../pages/TaskBox/TaskBox';
import {
  isPayableTask,
  isPendingSigantureTask,
  isSignableTask,
  tasksSignPayLabel,
} from '../../helpers/tasks';
import { GuestSignature } from './GuestSignature';

const StyledGuestPayment = styled.div`
  color: pink;
  background: linear-gradient(
    to bottom,
    rgba(140, 81, 255, 0.7) 0%,
    transparent 50%
  );
  height: 100%;
  overflow-y: scroll;
`;

export function GuestPayment() {
  const { t } = useTranslation();
  const { clientType, setClientType } = useClientContext();
  const { data: loggedInData } = useQuery(gql(IS_LOGGED_IN));
  const isLoggedIn = React.useMemo(
    () => loggedInData?.isLoggedIn || false,
    [loggedInData]
  );
  const [annotations, setAnnotations] = React.useState<any>(null);
  React.useEffect(() => {
    if (!isLoggedIn && clientType === 'userPool') {
      setClientType('iam');
    } else if (isLoggedIn && clientType === 'iam') setClientType('userPool');
  }, [isLoggedIn, clientType, setClientType]);

  const [searchParams] = useSearchParams();
  const [entityId, setEntityId] = React.useState<string | null>(
    searchParams.get('entityId')
  );
  const [taskId, setTaskId] = React.useState<string | null>(
    searchParams.get('taskId')
  );
  const ref = React.useRef<any>(null);

  const paymentId = searchParams.get('paymentId');
  const token = searchParams.get('token');
  const { data: paymentGuestData } = useQuery(gql(GET_PAYMENT_GUEST), {
    variables: {
      id: paymentId,
    },
    skip: !paymentId || (!isLoggedIn && clientType === 'userPool'),
  });

  const paymentGuest: PaymentGuest | undefined = React.useMemo(
    () => paymentGuestData?.getPaymentGuest,
    [paymentGuestData]
  );

  //const {
  //  data: taskGuestData,
  //  loading,
  //  error,
  //} = useQuery(gql(GET_TASK_GUEST), {
  //  variables: {
  //    id: taskId ?? paymentGuest?.taskId,
  //    entityId: entityId ?? paymentGuest?.entityId,
  //  },
  //  notifyOnNetworkStatusChange: true,
  //  skip:
  //    (!taskId && !paymentGuest) ||
  //    (!entityId && !paymentGuest) ||
  //    (!isLoggedIn && clientType === 'userPool'),
  //});
  //const taskGuest: TaskGuest | undefined = taskGuestData?.getTaskGuest;

  const {
    data: taskPublicData,
    loading,
    error,
  } = useQuery(gql(GET_TASK_PUBLIC), {
    variables: {
      token,
    },
    notifyOnNetworkStatusChange: true,
    skip: !isLoggedIn && clientType === 'userPool',
  });

  const taskGuest: TaskGuest | undefined = taskPublicData?.getTaskPublic;

  React.useEffect(() => {
    if (taskGuest && taskGuest.entityId && !entityId) {
      setEntityId(taskGuest.entityId);
    }
    if (taskGuest && taskGuest.id && !taskId) {
      setTaskId(taskGuest.id);
    }
  }, [taskGuest]);

  const theme = useTheme();
  const [createPaymentGuest] = useMutation(gql(CREATE_PAYMENT_GUEST));
  const [createPaymentScheduledGuest] = useMutation(
    gql(CREATE_SCHEDULED_PAYMENT_GUEST)
  );
  const [paid, setIsPaid] = React.useState(false);
  React.useEffect(() => {
    if (
      taskGuest?.status === TaskStatus.COMPLETED ||
      paymentGuest?.status === PaymentStatus.COMPLETED
    ) {
      setIsPaid(true);
    }
    if (
      (taskGuest?.status === TaskStatus.SCHEDULED && !paymentGuest) ||
      paymentGuest?.status === PaymentStatus.PENDING
    ) {
      setDisabledButton(true);
    }
    if (taskGuest) {
      if (isPendingSigantureTask(taskGuest as any, 'undefined'))
        setDisabledButton(true);
      setAnnotations(taskGuest.annotations);
    }
  }, [taskGuest, paymentGuest]);
  const [showAddSignModal, setShowAddSignModal] =
    React.useState<boolean>(false);
  const pdfSignatureRef = useRef<any>(null);

  const addSignatureAndDate = async (signatureAttachmentId: string) => {
    if (annotations) {
      const annotationsData = JSON.parse(annotations);
      const annotationsObject = annotationsData?.annotations;
      const filteredAnnotations = annotationsObject?.filter(
        (annotation: any) =>
          annotation?.customData?.status === 'PENDING' &&
          annotation?.customData?.contactId &&
          annotation?.customData?.signerType === 'CONTACT'
      );

      filteredAnnotations.forEach(async (annotation: any) => {
        console.log(annotation);

        const updateAnnotation = getAnnotation(
          annotation,
          signatureAttachmentId
        );
        if (pdfSignatureRef.current) {
          try {
            await pdfSignatureRef.current.delete(annotation?.id);
          } catch (error) {
            console.log('delete annotation error', error);
          }
          try {
            await pdfSignatureRef.current.create(updateAnnotation);
          } catch (error) {
            console.log('create annotation error', error);
          }
        }
      });
    }
  };
  const refetchQueries = [
    {
      query: gql(GET_TASK_GUEST),
      variables: {
        id: taskId ?? paymentGuest?.taskId,
        entityId: entityId ?? paymentGuest?.entityId,
      },
    },
  ];

  const getAnnotationData = async () => {
    const allAnnotations = await Promise.all(
      Array.from({ length: pdfSignatureRef.current?.totalPageCount }).map(
        (_, pageIndex) => pdfSignatureRef.current.getAnnotations(pageIndex)
      )
    );

    const flattenedAnnotations = allAnnotations.flat();
    if (pdfSignatureRef.current) {
      const instantJSON = await pdfSignatureRef.current.exportInstantJSON(
        flattenedAnnotations
      );
      console.log(instantJSON.annotations.map((a: any) => a.id));
      return JSON.stringify(instantJSON);
    } else return null;
  };
  const [updateTaskGuest] = useMutation(gql(UPDATE_TASK_GUEST));
  const showSnackbar = useSnackbar();
  const updateAnnotations = async () => {
    const annotations = await getAnnotationData();
    if (taskGuest && annotations) {
      await updateTaskGuest({
        variables: {
          input: {
            id: taskGuest.id,
            entityId: taskGuest.entityId,
            annotations: annotations,
          },
        },
        refetchQueries,
        awaitRefetchQueries: true,
      });
      showSnackbar({
        message: t('documentSigned', { ns: 'payment' }),
        severity: 'success',
        horizontal: 'right',
        vertical: 'bottom',
      });

      // const updatedTask: Task = updateTaskData.data?.updateTaskGuest;
      // if(update)
      // if (updatedTask.signatureStatus === TaskSignatureStatus.SIGNED) {
      //   updatePaidSignedStatus(updatedTask);
      // }
    }
  };

  const [submitting, setSubmitting] = React.useState(false);
  const signDocument = async () => {
    await updateAnnotations();
  };

  const [signatureBlob, setSignatureBlob] = React.useState<Blob>();
  const [disabledButton, setDisabledButton] = React.useState(false);

  const signatureAddHandler = async (signatureBlob?: string | Blob) => {
    setShowAddSignModal(false);
    if (signatureBlob && typeof signatureBlob !== 'string') {
      setSignatureBlob(signatureBlob);
      if (pdfSignatureRef.current) {
        const signatureAttachmentId =
          await pdfSignatureRef.current.createAttachment(signatureBlob);
        await addSignatureAndDate(signatureAttachmentId);
        setAnnotations(await getAnnotationData());
      }
    }
    if (ref.current) {
      ref.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  const submitInvoice = async (paymentMethod: PaymentMethod | string) => {
    let paymentMethodId = '';
    if (typeof paymentMethod === 'string') {
      paymentMethodId = paymentMethod;
    } else paymentMethodId = paymentMethod.id;

    if (!paymentGuest)
      await createPaymentGuest({
        variables: {
          input: {
            entityId,
            taskId,
            paymentMethodId,
          },
        },
        refetchQueries,
        awaitRefetchQueries: true,
      });
    else {
      await createPaymentScheduledGuest({
        variables: {
          input: {
            paymentId,
            paymentMethodId,
          },
        },
        update: (cache, { data }) => {
          const { createPaymentScheduledGuest } = data;
          for (const payment of createPaymentScheduledGuest) {
            console.log('payment: ', payment);
            cache.writeQuery({
              query: gql(GET_PAYMENT_GUEST),
              variables: { id: payment.id },
              data: {
                getPaymentGuest: { ...payment },
              },
            });
          }
        },
      });
    }
    setIsPaid(true);
  };
  const isDownMD = useMediaQuery(theme.breakpoints.down('md'));

  const signOnly = taskGuest?.type === 'SIGN_ONLY';
  return signOnly && token ? (
    <GuestSignature taskGuest={taskGuest} token={token} />
  ) : (
    <StyledGuestPayment>
      <WBContainer>
        <WBBox py={8} width={'100%'}>
          {isDownMD && (
            <WBFlex
              justifyContent={'center'}
              mb={2}
              mt={-2}
              alignItems={'center'}
            >
              <AdmiinLogo />
            </WBFlex>
          )}
          <WBFlex justifyContent={'center'} alignContent={'center'}>
            <WBTypography variant="h4" fontWeight="bold" mb={0}>
              {taskGuest
                ? t(
                    isPayableTask(taskGuest as any)
                      ? isSignableTask(taskGuest as any)
                        ? 'signatureAndPaymentDueTitle'
                        : 'paymentDueTitle'
                      : isSignableTask(taskGuest as any)
                      ? 'signatureDueTitle'
                      : 'signatureDueTitle',
                    {
                      ns: 'payment',
                      invoice: taskGuest?.reference,
                    }
                  )
                : ''}
            </WBTypography>
          </WBFlex>
          <WBFlex
            mt={9}
            width={'100%'}
            flexDirection={{ xs: 'column', md: 'row' }}
          >
            <WBFlex flex={[7]} mr={[0, 0, 5]}>
              {!loading && taskGuest ? (
                <TaskBoxContext.Provider value={{ pdfSignatureRef }}>
                  <TaskSummaryCard
                    task={taskGuest}
                    isGuest
                    installment={paymentGuest?.installment || 1}
                    annotations={annotations}
                  />
                </TaskBoxContext.Provider>
              ) : (
                <WBSkeleton
                  variant="rectangular"
                  width={'509px'}
                  height={'630px'}
                />
              )}
            </WBFlex>
            <WBFlex
              flex={5}
              mt={[5, 5, 0]}
              ml={[0, 0, 5]}
              flexDirection={'column'}
              justifyContent={'space-between'}
            >
              {!loading && taskGuest ? (
                <>
                  <WBBox
                    p={5}
                    sx={{
                      boxShadow: theme.shadows[6],
                      bgcolor: 'background.default',
                    }}
                  >
                    <WBFlex
                      justifyContent={'center'}
                      mb={7}
                      mt={3}
                      alignItems={'center'}
                      sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                      <AdmiinLogo />
                    </WBFlex>
                    <CCForm
                      isGuest
                      entityId={entityId ?? ''}
                      disabled={
                        disabledButton ||
                        paid ||
                        !isPayableTask(taskGuest as any)
                      }
                      ref={ref}
                      taskId={taskId ?? ''}
                      loading={submitting}
                      disabledButton={disabledButton}
                      hideForm={!isPayableTask(taskGuest as any)}
                      onSubmit={async () => {
                        if (
                          !signatureBlob &&
                          isSignableTask(taskGuest as any, {
                            signerType: 'CONTACT',
                          })
                        ) {
                          setShowAddSignModal(true);
                          return false;
                        } else if (
                          isSignableTask(taskGuest as any, {
                            signerType: 'CONTACT',
                          })
                        ) {
                          await signDocument();
                        }
                        if (!isPayableTask(taskGuest as any)) return false;
                        return true;
                      }}
                      onSuccess={submitInvoice}
                      paid={paid}
                      submitButtonText={
                        paid
                          ? t(
                              taskGuest.type === TaskType.PAY_ONLY
                                ? 'Paid'
                                : taskGuest.type === TaskType.SIGN_ONLY
                                ? 'Signed'
                                : 'SignPaid',
                              { ns: 'payment' }
                            )
                          : t(tasksSignPayLabel([taskGuest as any]), {
                              ns: 'payment',
                            })
                      }
                    />
                  </WBBox>
                  <WBFlex
                    justifyContent={'end'}
                    alignItems="center"
                    flexDirection={'column'}
                    flexGrow={1}
                  >
                    <WBStack direction={'row'} spacing={2} mb={2}>
                      {/*@ts-ignore */}
                      <CreditCardIcons width="170px" height="50px" />
                      {/* <CreditCardIcon type={'visa'} width={100} height={50} />
                  <CreditCardIcon type={'mastercard'} />
                  <CreditCardIcon type={'american_express'} /> */}
                    </WBStack>
                    <WBTypography>
                      {t('needHelp', { ns: 'common' })}{' '}
                      <WBLink
                        to={'mailto:support@admiin.com'}
                        underline="always"
                      >
                        support@admiin.com
                      </WBLink>
                    </WBTypography>
                  </WBFlex>
                </>
              ) : (
                <WBSkeleton
                  width={'100%'}
                  height={'100%'}
                  variant="rectangular"
                />
              )}
            </WBFlex>
          </WBFlex>
        </WBBox>
      </WBContainer>
      <ErrorHandler isDialog errorMessage={error?.message} />
      <AddSignatureModal
        open={showAddSignModal}
        handleClose={() => setShowAddSignModal(false)}
        handleSave={signatureAddHandler}
        isGuest
        defaultZIndex
      />
    </StyledGuestPayment>
  );
}

export default GuestPayment;
