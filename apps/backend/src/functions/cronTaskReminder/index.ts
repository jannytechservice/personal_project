const { TABLE_TASK } = process.env;
import {
  Task,
  TaskPaymentStatus,
  TaskSignatureStatus,
  TaskStatus,
  TaskType,
} from 'dependency-layer/API';
import { queryRecords } from 'dependency-layer/dynamoDB';
import { sendInvoiceEmail } from 'dependency-layer/payment';
import { sendSignatureEmail } from 'dependency-layer/task';
import { Context, ScheduledEvent } from 'aws-lambda';
import { DateTime } from 'luxon';

// tasks that are 3 days before due and unactioned
const queryOverdueTasks = async () => {
  const daysAfterDue = DateTime.now()
    .setZone('Australia/Sydney')
    .minus({ days: 3 })
    .toISODate();

  console.log('3 daysAfterDue: ', daysAfterDue);

  // query by tasksByEntityTo
  return queryRecords({
    tableName: TABLE_TASK ?? '',
    indexName: 'tasksByStatus',
    keys: {
      status: TaskStatus.INCOMPLETE,
      dueAt: daysAfterDue,
    },
    limit: 1000,
  });
};

// tasks that are 3 days before due and unactioned
const queryUnactionedTasks = async () => {
  const daysBeforeDue = DateTime.now()
    .setZone('Australia/Sydney')
    .plus({ days: 3 })
    .toISODate();

  console.log('3 daysBeforeDue: ', daysBeforeDue);

  return queryRecords({
    tableName: TABLE_TASK ?? '',
    indexName: 'tasksByStatus',
    keys: {
      status: TaskStatus.INCOMPLETE,
      dueAt: daysBeforeDue,
    },
    limit: 1000,
  });
};

export const handler = async (event: ScheduledEvent, context: Context) => {
  console.log('Cron Lambda triggered with event:', event);
  console.log('Context:', context);

  let overDueTasks: Task[] = [];
  try {
    overDueTasks = await queryOverdueTasks();
    console.log('overDueTasks:', overDueTasks);
  } catch (error) {
    console.error('Error getting overdue tasks:', error);
    return;
  }

  for (const task of overDueTasks) {
    // signature reminder
    if (
      task.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE &&
      task.type === TaskType.SIGN_ONLY
    ) {
      // send reminder to entity
      try {
        await sendSignatureEmail(task, 'signature-overdue');
      } catch (err) {
        console.log('ERROR send signature email: ', err);
      }
    }

    // payment reminder
    else if (task.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT) {
      try {
        await sendInvoiceEmail(task, 'invoice-overdue');
      } catch (err) {
        console.log('ERROR send invoice email: ', err);
      }
    }
  }

  let unActionedTasks: Task[] = [];
  try {
    unActionedTasks = await queryUnactionedTasks();
    console.log('unActionedTasks:', unActionedTasks);
  } catch (error) {
    console.error('Error getting unactioned tasks:', error);
    return;
  }

  for (const task of unActionedTasks) {
    // signature reminder
    if (
      task.signatureStatus === TaskSignatureStatus.PENDING_SIGNATURE &&
      task.type === TaskType.SIGN_ONLY
    ) {
      // send reminder to entity
      try {
        await sendSignatureEmail(task, 'signature-reminder');
      } catch (err) {
        console.log('ERROR send signature email: ', err);
      }
    }

    // payment reminder
    else if (task.paymentStatus === TaskPaymentStatus.PENDING_PAYMENT) {
      try {
        await sendInvoiceEmail(task, 'invoice-reminder');
      } catch (err) {
        console.log('ERROR send invoice email: ', err);
      }
    }
  }
};
