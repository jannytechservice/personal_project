import {
  PaymentMethod,
  PaymentType,
  Task,
  retryPayment as RETRY_PAYMENT,
  Payment,
  PaymentMethodStatus,
  PaymentMethodType,
  PayToAgreement,
  getTask,
  tasksByEntityTo,
  PaymentFrequency,
  updateTask as UPDATE_TASK,
  TaskType,
  CSGetSub as GET_SUB,
  AccountDirection,
  PaymentStatus,
} from '@admiin-com/ds-graphql';
import React from 'react';
import {
  useCurrentEntityId,
  useSelectedEntity,
} from '../../hooks/useSelectedEntity/useSelectedEntity';
import {
  createPayment as CREATE_PAYMENT,
  createTaskPayment as CREATE_TASK_PAYMENT,
} from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  backendDateFromUnixSeconds,
  maskCreditCardNumberSimple,
} from '@admiin-com/ds-common';
import { useSnackbar } from '@admiin-com/ds-web';

import {
  createPayToAgreement as CREATE_PAY_TO_AGREEMENT,
  createPaymentPayId as CREATE_PAYMENT_PAYID,
} from '@admiin-com/ds-graphql';
import {
  calculateFee,
  isDeclinedTask,
  isPayableTask,
  isReocurringTask,
  isSignableTask,
  isTaskScheduled,
} from '../../helpers/tasks';
import { useUserSignature } from '../../hooks/useUserSignature/useUserSignature';
import { useTaskBoxContext } from '../../pages/TaskBox/TaskBox';
import { getAnnotation } from '../../helpers/signature';
import VerificationDlg from '../../pages/VerificationDlg/VerificationDlg';
import AddPaymentMethodModal from '../AddPaymentMethodModal/AddPaymentMethodModal';
import AddSignatureModal from '../AddSignatureModal/AddSignatureModal';
import ReocurringConfirmModal from '../ReocurringConfirmModal/ReocurringConfirmModal';
import { isVerifiedEntity } from '../../helpers/entities';

export interface PaymentContainerProps {
  children: React.ReactNode;
}

export type PaymentDetailData = {
  task: Task;
  scheduledAt?: Date;
  id: string;
  installments?: number;
  type?: PaymentType;
  paymentFrequency?: PaymentFrequency;
};

const PaymentContext = React.createContext<any>(null);

export type PaymentAPIStatus =
  | 'INITIAL'
  | 'PENDING'
  | 'SIGNED'
  | 'PAYING'
  | 'PAID';

export function PaymentContainer({ children }: PaymentContainerProps) {
  const [paymentDetails, setPaymentDetails] = React.useState<
    Array<PaymentDetailData>
  >([]);
  const [paymentMethod, setPaymentMethod] = React.useState<
    PaymentMethod | null | undefined | string
  >(null);
  const [bankPaymentMethod, setBankPaymentMethod] = React.useState<
    PaymentMethod | null | undefined
  >(null);

  const [paymentAPIStatus, setPaymentAPIStatus] =
    React.useState<PaymentAPIStatus>('INITIAL');

  const { entity } = useSelectedEntity();
  const paymentMethods = React.useMemo(
    () =>
      entity?.paymentMethods?.items
        ?.filter(
          (method: PaymentMethod | null) =>
            method?.status === PaymentMethodStatus.ACTIVE &&
            (method?.paymentMethodType === PaymentMethodType.CARD ||
              (method?.paymentMethodType === PaymentMethodType.BANK &&
                method.accountDirection !== AccountDirection.DISBURSEMENT) ||
              method?.paymentMethodType === PaymentMethodType.PAYID ||
              method?.paymentMethodType === PaymentMethodType.PAYTO)
        )
        ?.map((method: PaymentMethod | null) => ({
          ...method,
          value: method,
          label:
            maskCreditCardNumberSimple(
              method?.number ?? method?.accountNumber ?? ''
            ) ?? '',
        })) ?? [],
    [entity]
  );

  const [paymentMethodModal, setPaymentMethodModal] = React.useState<
    'CC' | 'PAY_TO_VERIFY' | 'PAY_ID' | 'BankAccount'
  >('CC');

  const [createPayment] = useMutation(gql(CREATE_PAYMENT));
  const [retryPayment] = useMutation(gql(RETRY_PAYMENT));
  const [createPayToAgreement] = useMutation(gql(CREATE_PAY_TO_AGREEMENT));
  const [createPaymentPayId] = useMutation(gql(CREATE_PAYMENT_PAYID));

  const { startPolling: startPollingComplete } = useQuery(
    gql(tasksByEntityTo),
    {
      variables: {
        entityId: entity?.id,
        status: 'COMPLETED',
      },
      skip: !entity?.id,
      pollInterval: 0,
    }
  );
  const { startPolling: startPollingInComplete } = useQuery(
    gql(tasksByEntityTo),
    {
      variables: {
        entityId: entity?.id,
        status: 'INCOMPLETE',
      },
      skip: !entity?.id,
      pollInterval: 0,
    }
  );

  const paymentMethodId =
    typeof paymentMethod === 'string'
      ? bankPaymentMethod?.id
      : paymentMethod?.id;

  const updatePayment = React.useCallback(
    async (paymentData: PaymentDetailData) => {
      setPaymentDetails((payments) =>
        payments.map((payment) =>
          payment.task.id === paymentData?.task?.id
            ? { ...payment, ...paymentData }
            : payment
        )
      );
      if (
        !paymentDetails.find(
          (payment) => payment.task.id === paymentData?.task?.id
        )
      ) {
        setPaymentDetails(paymentDetails.concat(paymentData));
      }
    },
    [paymentDetails, setPaymentDetails]
  );

  React.useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0) {
      const paymentMethod =
        paymentMethods?.find(
          (item: any) => item?.id === entity?.paymentMethodId
        ) ?? paymentMethods[0];
      if (paymentMethod) setPaymentMethod(paymentMethod as any);
    }
  }, [entity?.paymentMethodId, paymentMethods]);

  const retryFailedPayment = async (payment: Payment) => {
    setPaymentAPIStatus('PAYING');
    try {
      if (paymentMethod && typeof paymentMethod !== 'string')
        await retryPayment({
          variables: {
            input: { id: payment.id, paymentMethodId: paymentMethodId },
          },
          refetchQueries: [
            {
              query: gql(tasksByEntityTo),
              variables: {
                entityId: entityId,
                status: 'INCOMPLETE',
              },
            },
          ],
        });
      setPaymentAPIStatus('INITIAL');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Retry payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const getBillPayments = (tasks: Task[]) => {
    return tasks
      .map(
        (task: Task) =>
          ({
            id: task.id,
            type: PaymentType.PAY_NOW,
            scheduledAt: new Date(),
            paymentFrequency: task.paymentFrequency,
            installments: task?.numberOfPayments ?? 1,
            ...paymentDetails.find(
              (paymentDetail) => paymentDetail.task.id === task?.id
            ),
          } as PaymentDetailData)
      )
      .map((payment: PaymentDetailData) => {
        return {
          id: payment.id,
          installments: payment.installments,
          paymentType: payment.type,
          paymentFrequency: payment.paymentFrequency,
          scheduledAt: backendDateFromUnixSeconds(
            (payment?.scheduledAt ?? new Date()).getTime() / 1000
          ),
        };
      });
  };

  const entityId = useCurrentEntityId();

  React.useEffect(() => {
    if (paymentAPIStatus === 'PAID') {
      setTimeout(() => {
        setPaymentAPIStatus('INITIAL');
      }, 2000);
    }
  }, [paymentAPIStatus]);

  const paymentSubmit = React.useCallback(
    async (tasks: Task[]) => {
      if (!paymentMethod || typeof paymentMethod === 'string') return;
      tasks = tasks.filter((task) => task.type !== TaskType.SIGN_ONLY);
      if (tasks.length === 0) return;

      setPaymentAPIStatus('PAYING');
      if (entity) {
        try {
          const billPayments = getBillPayments(tasks);
          await createPayment({
            variables: {
              input: {
                entityId: entity.id,
                paymentMethodId: paymentMethodId,
                billPayments: billPayments,
              },
            },
            refetchQueries: [
              {
                query: gql(tasksByEntityTo),
                variables: {
                  entityId: entity.id,
                  limit: 20,
                  status: 'INCOMPLETE',
                },
              },
              {
                query: gql(tasksByEntityTo),
                variables: {
                  entityId: entity.id,
                  limit: 20,
                  status: 'COMPLETED',
                },
              },
              // {
              //   query: gql(tasksByEntityByIdContactId),
              // },
              ...(tasks.length === 1
                ? [
                    {
                      query: gql(getTask),
                      variables: {
                        id: tasks[0].id,
                        entityId: entity.id,
                      },
                    },
                  ]
                : []),
            ],
            awaitRefetchQueries: true,
          });
          setPaymentAPIStatus('PAID');
        } catch (error: any) {
          showSnackbar({
            message: error?.message ?? 'Create payment failed',
            severity: 'error',
            vertical: 'bottom',
          });

          setPaymentAPIStatus('INITIAL');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entity, paymentDetails, createPayment, paymentMethod]
  );

  const [createTaskPayment] = useMutation(gql(CREATE_TASK_PAYMENT));
  const retryAllDeclinedPayments = async (task: Task) => {
    setPaymentAPIStatus('PAYING');

    try {
      for (const payment of task.payments?.items ?? []) {
        if (payment && payment.status === PaymentStatus.DECLINED)
          await retryPayment({
            variables: {
              input: { id: payment.id, paymentMethodId: paymentMethodId },
            },
            refetchQueries: [
              {
                query: gql(tasksByEntityTo),
                variables: {
                  entityId: entityId,
                  status: 'INCOMPLETE',
                },
              },
            ],
          });
      }
      setPaymentAPIStatus('PAID');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Retry payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };
  const taskPaymentSubmit = async (task: Task) => {
    setPaymentAPIStatus('PAYING');

    try {
      await createTaskPayment({
        variables: {
          input: {
            taskId: task?.id,
            entityId: entity?.id,
            paymentMethodId: paymentMethodId,
          },
        },
        refetchQueries: [
          {
            query: gql(tasksByEntityTo),
            variables: {
              entityId: entity?.id,
              status: 'INCOMPLETE',
              limit: 20,
            },
          },
          {
            query: gql(tasksByEntityTo),
            variables: {
              entityId: entity?.id,
              status: 'COMPLETED',
              limit: 20,
            },
          },
          {
            query: gql(getTask),
            variables: {
              id: task?.id,
              entityId: entity?.id,
            },
          },
        ],
        awaitRefetchQueries: true,
      });
      setPaymentAPIStatus('PAID');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Create payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const createPayId = async (tasks: Task[]) => {
    setPaymentAPIStatus('SIGNED');

    try {
      await createPaymentPayId({
        variables: {
          input: {
            entityId,
            billPayments: getBillPayments(tasks),
          },
        },
        refetchQueries: [
          {
            query: gql(tasksByEntityTo),
            variables: {
              entityId: entityId,
              status: 'INCOMPLETE',
            },
          },
        ],
      });
      setPaymentAPIStatus('PAID');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Create payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const createPayTo = async (agreements: PayToAgreement[], tasks: Task[]) => {
    setPaymentAPIStatus('PAYING');
    try {
      await createPayToAgreement({
        variables: {
          input: {
            agreementUuids: agreements.map(
              (agreement) => agreement.agreementUuid
            ),
            billPayments: getBillPayments(tasks),
          },
        },
        refetchQueries: [
          {
            query: gql(tasksByEntityTo),
            variables: {
              entityId: entityId,
              status: 'INCOMPLETE',
            },
          },
        ],
      });
      startPollingComplete(3000);
      startPollingInComplete(3000);
      setPaymentAPIStatus('PAID');
    } catch (error: any) {
      showSnackbar({
        message: error?.message ?? 'Create payment failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const [updateTask] = useMutation(gql(UPDATE_TASK));
  const { pdfSignatureRef, selectedSignatureKey } = useTaskBoxContext();
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;

  const [showAddSignModal, setShowAddSignModal] =
    React.useState<boolean>(false);
  const [verificationModal, setVerificationModal] =
    React.useState<boolean>(false);
  const [addPaymentMethodModal, setAddPaymentMethodModal] =
    React.useState<boolean>(false);
  const [reocurringConfirmModal, setReocurringConfirmModal] =
    React.useState<boolean>(false);
  const [reOcurringTasks, setReOcurringTasks] = React.useState<Task[]>([]);
  const [billsToSubmit, setBillsToSubmit] = React.useState<Task[]>([]);

  const addSignatureAndDate = async (
    task: Task,
    signatureAttachmentId: string
  ) => {
    if (task?.annotations) {
      const annotationsData = JSON.parse(task?.annotations);
      const annotations = annotationsData?.annotations;
      const filteredAnnotations =
        annotations?.filter(
          (annotation: any) =>
            annotation?.customData?.signerId === userId &&
            annotation?.customData?.status === 'PENDING' //AnnotationStatus.PENDING
        ) ?? [];

      filteredAnnotations.forEach((annotation: any) => {
        console.log(annotation);
        const updateAnnotation = getAnnotation(
          annotation,
          signatureAttachmentId
        );
        pdfSignatureRef.current.create(updateAnnotation);
        pdfSignatureRef.current.delete(annotation?.id);
      });
      // updateAnnotations(task);
    }
  };

  const getAnnotationData = async () => {
    const allAnnotations = await Promise.all(
      Array.from({ length: pdfSignatureRef.current?.totalPageCount }).map(
        (_, pageIndex) => pdfSignatureRef.current.getAnnotations(pageIndex)
      )
    );

    const flattenedAnnotations = allAnnotations.flat();
    const instantJSON = await pdfSignatureRef.current.exportInstantJSON(
      flattenedAnnotations
    );
    return JSON.stringify(instantJSON);
  };

  const updateAnnotations = async (task: Task | null) => {
    const annotations = await getAnnotationData();
    if (task) {
      await updateTask({
        variables: {
          input: {
            id: task.id,
            entityId: task.entityId,
            annotations: annotations,
            dueAt: task?.dueAt,
          },
        },
      });
    }
  };
  const { getSignatureBlob } = useUserSignature();
  const signDocument = async (bills: Task[], signatureKey: string) => {
    try {
      setPaymentAPIStatus('PENDING');
      const signatureBlob = await getSignatureBlob(signatureKey);
      if (pdfSignatureRef.current) {
        const signatureAttachmentId =
          await pdfSignatureRef.current.createAttachment(signatureBlob);
        if (signatureAttachmentId) {
          for (const bill of bills) {
            await addSignatureAndDate(bill, signatureAttachmentId);
            if (bill) await updateAnnotations(bill);
          }
        }
        setPaymentAPIStatus('SIGNED');
      }
    } catch (e: any) {
      showSnackbar({
        message: e?.message ?? 'Sign document failed',
        severity: 'error',
        vertical: 'bottom',
      });
      setPaymentAPIStatus('INITIAL');
    }
  };

  const submitBills = async (bills: Task[], check = true) => {
    if (check && !canSubmitBill(bills)) return;
    if (bills.some((task) => isSignableTask(task)))
      await signDocument(bills, selectedSignatureKey);
    if (bills.some((task) => isPayableTask(task))) await payDocument(bills);
  };

  // const signatureAddHandler = async (signatureKey?: string | Blob) => {
  //   if (signatureKey && typeof signatureKey === 'string') {
  //     await handleClick(signatureKey);
  //   }
  //   setShowAddSignModal(false);
  // };

  const handleAddPaymentMethod = (paymentMethod?: PaymentMethod) => {
    if (paymentMethod) {
      if (paymentMethodModal === 'BankAccount') {
        setBankPaymentMethod(paymentMethod);
      } else setPaymentMethod(paymentMethod);
      submitBills(billsToSubmit, false);
    }
  };

  const canSubmitBill = (tasks: Task[]): boolean => {
    if (entity && !isVerifiedEntity(entity)) {
      setVerificationModal(true);
      return false;
    }
    if (!selectedSignatureKey && tasks.some((task) => isSignableTask(task))) {
      setShowAddSignModal(true);
      return false;
    }
    if (tasks.some((task) => isPayableTask(task)))
      if (!paymentMethod) {
        setBillsToSubmit(tasks);
        setPaymentMethodModal('CC');
        setAddPaymentMethodModal(true);
        return false;
      } else if (typeof paymentMethod === 'string') {
        if (!bankPaymentMethod) {
          setPaymentMethodModal('BankAccount');
          setAddPaymentMethodModal(true);
          return false;
        }
      } else {
        const reOcurringTasks = tasks.filter((task) => isReocurringTask(task));
        if (reOcurringTasks.length > 0) {
          setReOcurringTasks(reOcurringTasks);
          setBillsToSubmit(tasks);
          setReocurringConfirmModal(true);
          return false;
        }
      }
    return true;
  };
  const payDocument = async (payableTasks: Task[]) => {
    for (const payableTask of payableTasks) {
      if (
        payableTask &&
        paymentDetails.find(
          (detail: PaymentDetailData) =>
            detail.type === 'PAY_NOW' && detail.task.id === payableTask.id
        ) &&
        isTaskScheduled(payableTask)
      ) {
        const isDeclined = isDeclinedTask(payableTask);
        if (isDeclined) {
          await retryAllDeclinedPayments(payableTask);
        } else await taskPaymentSubmit(payableTask);
      }
    }
    payableTasks = payableTasks.filter((task) => !isTaskScheduled(task));
    await paymentSubmit(payableTasks);
  };

  const showSnackbar = useSnackbar();

  return (
    <PaymentContext.Provider
      value={{
        paymentDetails,
        taskPaymentSubmit,
        paymentMethod,
        paymentMethods,
        createPayTo,
        createPayId,
        setPaymentMethod,
        retryPayment: retryFailedPayment,
        submitBills,
        bankPaymentMethod,
        setBankPaymentMethod,
        setPaymentAPIStatus,
        paymentAPIStatus,
        updatePayment,
        getBillPayments,
        setPaymentDetails,
        paymentMethodId,
      }}
    >
      {children}
      {entity ? (
        <VerificationDlg
          entity={entity}
          onSuccess={() => {
            console.log('success');
            // setVerified(true);
          }}
          open={verificationModal}
          onClose={() => setVerificationModal(false)}
        />
      ) : null}
      <AddPaymentMethodModal
        open={addPaymentMethodModal}
        type={paymentMethodModal}
        handleClose={() => setAddPaymentMethodModal(false)}
        onSuccess={handleAddPaymentMethod}
      />

      <AddSignatureModal
        open={showAddSignModal}
        handleClose={() => setShowAddSignModal(false)}
        // handleSave={signatureAddHandler}
      />

      <ReocurringConfirmModal
        reOcurringTasks={reOcurringTasks}
        onConfirm={() => {
          submitBills(billsToSubmit, false);
        }}
        open={reocurringConfirmModal}
        onClose={() => setReocurringConfirmModal(false)}
      />
    </PaymentContext.Provider>
  );
}

export const usePaymentContext = () => {
  const context = React.useContext(PaymentContext);
  const getFees = React.useCallback(
    (tasks: Task[], paymentMethodType?: PaymentMethodType) => {
      const fees = calculateFee(
        tasks,
        paymentMethodType ??
          (!context?.paymentMethod || typeof context?.paymentMethod === 'string'
            ? PaymentMethodType.CARD
            : context?.paymentMethod.paymentMethodType),
        context?.paymentDetails ?? []
      );
      return fees;
    },
    [context?.paymentMethod, context?.paymentDetails]
  );
  return { getFees, ...(context ?? {}) };
};

export const usePaymentContextDetail = (task: Task | null) => {
  const context = React.useContext(PaymentContext);

  const paymentDetail = React.useMemo(
    () =>
      context.paymentDetails?.find(
        (payment: PaymentDetailData) => payment?.task?.id === task?.id
      ),
    [context.paymentDetails, task?.id]
  );

  return { ...context, paymentDetail };
};

export default PaymentContainer;
