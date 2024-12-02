import { gql, useLazyQuery } from '@apollo/client';
import { useUserEntities } from '../useUserEntities/useUserEntities';
import {
  Entity,
  Payment,
  tasksByEntityFrom as TASKS_BY_ENTITY_FROM,
  tasksByEntityTo as TASKS_BY_ENTITY_TO,
  Task,
  TaskType,
} from '@admiin-com/ds-graphql';
import React from 'react';
import { isUpcomingPayment } from '../../helpers/payments';
import { getTaskDueDate } from '../../helpers/tasks';
export type EntityTaskCardData = {
  overdue: number;
  numberPaySign: number;
  numberPay: number;
  numberSign: number;
  amount: number;
  count: number;
};

export type EntityTaskData = {
  entity: Entity;
  to?: EntityTaskCardData;
  from?: EntityTaskCardData;
};

export type PaymentTaskData = {
  payment: Payment;
  entity: Entity;
  task: Task;
};

export type DashboardData = {
  entities: EntityTaskData[];
  inboxAmount?: number;
  outboxAmount?: number;
};

const getEntityTaskCardData = (tasks: Task[]): EntityTaskCardData => {
  const totalAmount: number =
    tasks?.reduce(
      (total: number, task: Task) => total + ((task?.amount ?? 0) / 100 || 0),
      0
    ) ?? 0;

  const numberPaySign = tasks?.filter(
    (task: Task) => task.type === TaskType.SIGN_PAY
  ).length;
  const numberPay = tasks?.filter(
    (task: Task) => task.type === TaskType.PAY_ONLY
  ).length;
  const numberSign = tasks?.filter(
    (task: Task) => task.type === TaskType.SIGN_ONLY
  ).length;

  const overdue = tasks.filter(
    (task: Task) => getTaskDueDate(task) <= 0
  ).length;

  return {
    overdue,
    numberPaySign,
    numberPay,
    numberSign,
    amount: totalAmount,
    count: tasks?.length ?? 0,
  };
};
export const useUpcomingPayments = () => {
  const {
    userEntities: entites,
    handleLoadMore,
    hasNextPage,
    // loading: loadingEntities,
  } = useUserEntities();
  const [tasksByEntityTo] = useLazyQuery(gql(TASKS_BY_ENTITY_TO), {
    notifyOnNetworkStatusChange: true,
  });
  const [tasksByEntityFrom] = useLazyQuery(gql(TASKS_BY_ENTITY_FROM), {
    notifyOnNetworkStatusChange: true,
  });
  const [paymentsData, setPaymentsData] = React.useState<PaymentTaskData[]>([]);
  const [dashboardData, setDashboardData] = React.useState<DashboardData>();
  const [_loadingTasks, setLoadingTasks] = React.useState(false);

  const loadingData = async () => {
    setLoadingTasks(true);
    const dashboardData: EntityTaskData[] = [];
    setDashboardData({
      entities: entites.map((e) => ({
        entity: e,
        inboxAmount: 0,
        outboxAmount: 0,
      })),
    });
    for (const entity of entites) {
      if (!entity || !entity.id) continue;
      try {
        const { data: tasksByEntityToData } = await tasksByEntityTo({
          variables: {
            entityId: entity.id,
            status: 'INCOMPLETE',
            limit: 100,
          },
        });
        const tasksTo = tasksByEntityToData?.tasksByEntityTo?.items || [];

        const { data: tasksByEntityFromData } = await tasksByEntityFrom({
          variables: {
            entityId: entity.id,
            status: 'INCOMPLETE',
            limit: 100,
          },
        });

        const tasksFrom = tasksByEntityFromData?.tasksByEntityFrom?.items || [];

        dashboardData.push({
          entity,
          to: getEntityTaskCardData(tasksTo),
          from: getEntityTaskCardData(tasksFrom),
        });

        const results: { payment: Payment; entity: Entity; task: Task }[] = [];
        for (const task of tasksTo) {
          if (
            entity &&
            task?.payments?.items &&
            task?.payments?.items.length > 0
          ) {
            // console.log(task);
            for (const payment of task.payments.items) {
              if (payment && isUpcomingPayment(payment)) {
                results.push({ entity, payment, task });
              }
            }
          }
        }
        setPaymentsData((data) => [...data, ...results]);
      } catch (err) {
        console.log(err);
      }
    }
    const inboxAmount =
      dashboardData?.reduce(
        (total: number, entity: EntityTaskData) =>
          total + (entity?.to?.amount ?? 0),
        0
      ) || 0;
    const outboxAmount =
      dashboardData?.reduce(
        (total: number, entity: EntityTaskData) =>
          total + (entity?.from?.amount ?? 0),
        0
      ) || 0;
    setDashboardData({ entities: dashboardData, inboxAmount, outboxAmount });
    setLoadingTasks(false);
  };

  React.useEffect(() => {
    if (entites && entites.length > 0) {
      loadingData();
    }
  }, [entites]);

  return {
    paymentsData,
    dashboardData,
    handleLoadMore,
    hasNextPage,
    loading: dashboardData === undefined,
  };
};
