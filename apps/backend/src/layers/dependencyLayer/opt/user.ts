import { randomUUID } from 'crypto';
import {
  ActivityType,
  Entity,
  Payment,
  RewardStatus,
  Task,
  TaskDirection,
  User,
} from './API';
import { createRecord, getRecord, updateRecord } from './dynamoDB';
import { minimumCountForReferral, minimumTaskAmountForReferral } from './utils';

const { TABLE_ENTITY, TABLE_TASK, TABLE_USER, TABLE_ACTIVITY, TABLE_REFERRAL } =
  process.env;

export const updateRewardRecord = async (payment: Payment) => {
  console.log('updating reward for payment:', payment);
  try {
    const amount = payment.netAmount || payment?.amount || 0;
    const task = await getRecord(TABLE_TASK ?? '', {
      id: payment?.taskId,
      entityId: payment?.entityId,
    });
    if (!task) throw new Error(`Task with id ${payment?.taskId} not found.`);
    const entityId = task.entityId;

    const entity: Entity = await getRecord(TABLE_ENTITY ?? '', {
      id: entityId,
    });
    if (!entity) throw new Error(`Entity with id ${entityId} not found.`);

    const userId = entity.owner;
    const user: User = await getRecord(TABLE_USER ?? '', { id: userId });
    if (!user) throw new Error(`User with id ${userId} not found.`);

    const incrementalPoints = await allocatedPoints(user.statusPoint || 0);
    const newPoints = Math.round((amount / 100) * incrementalPoints);

    let newPointsTotal = user.pointsTotal || 0;
    let newPointsBalance = user.pointsBalance || 0;

    if (task.direction === TaskDirection.RECEIVING) {
      newPointsTotal += newPoints;
      newPointsBalance += newPoints;

      await createRecord(TABLE_ACTIVITY ?? '', {
        id: randomUUID(),
        compositeId: `${userId}#REWARD`,
        message: 'PAYMENT_PAID',
        userId,
        entityId: task.entityId,
        type: ActivityType.REWARD,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          name: JSON.stringify({
            name: `${entity.name} - ${task?.reference}`,
            points: newPoints,
          }),
        },
      });
    }
    console.log('new points', newPoints, newPointsTotal, newPointsBalance);

    await updateRecord(
      TABLE_USER ?? '',
      { id: userId },
      {
        pointsTotal: newPointsTotal,
        pointsBalance: newPointsBalance,
      }
    );
  } catch (error: any) {
    console.error('Error in updateRewardRecord:', error);
    throw new Error(`Failed to update reward record: ${error.message}`);
  }
};

export const updateReferral = async (task: Task) => {
  try {
    const entityId = task.entityId;
    const entity: Entity = await getRecord(TABLE_ENTITY ?? '', {
      id: entityId,
    });
    if (!entity) throw new Error(`Entity with id ${entityId} not found.`);

    const userId = entity.owner;
    const user: User = await getRecord(TABLE_USER ?? '', { id: userId });
    if (!user) throw new Error(`User with id ${userId} not found.`);

    const newPoints = 5;
    let newStatusPoint = user.statusPoint || 0;
    newStatusPoint += newPoints;

    await updateRecord(
      TABLE_USER ?? '',
      { id: userId },
      {
        statusPoint: newStatusPoint,
        loyaltyStatus: getLoyaltyStatus(newStatusPoint),
        nextLoyaltyStatus: getNextLoyaltyStatus(newStatusPoint),
        nextLoyaltyStatusPoint: loyaltyPoints[getLoyaltyStatus(newStatusPoint)],
      }
    );

    if (task.direction === TaskDirection.SENDING) {
      const referral = await getRecord(TABLE_REFERRAL ?? '', {
        referredId: userId,
      });
      if (
        referral &&
        task.amount &&
        task.amount >= minimumTaskAmountForReferral
      ) {
        const newTaskPaidCount = (referral.taskPaidCount || 0) + 1;
        let referredCompleted = referral.referredCompleted;
        if (newTaskPaidCount >= minimumCountForReferral) {
          referredCompleted = true;
        }
        await updateRecord(
          TABLE_REFERRAL ?? '',
          { referredId: userId },
          {
            taskPaidCount: referredCompleted
              ? minimumCountForReferral
              : newTaskPaidCount,
            referredCompleted: referredCompleted,
          }
        );
      }
    }
  } catch (error: any) {
    console.error('Error in updateReferral:', error);
    throw new Error(`Failed to update referral: ${error.message}`);
  }
};

export const loyaltyPoints = {
  BRONZE: 300,
  SILVER: 600,
  GOLD: 1000,
  PLATINUM: 2000,
  DIAMOND: 3000,
};

export const getLoyaltyStatus = (statusPoint: number): RewardStatus => {
  let status = 'BRONZE';
  if (statusPoint <= loyaltyPoints.BRONZE) status = 'BRONZE';
  else if (statusPoint <= loyaltyPoints.SILVER) status = 'SILVER';
  else if (statusPoint <= loyaltyPoints.GOLD) status = 'GOLD';
  else if (statusPoint <= loyaltyPoints.PLATINUM) status = 'PLATINUM';
  else if (statusPoint <= loyaltyPoints.DIAMOND) status = 'DIAMOND';
  return status as RewardStatus;
};

export const getNextLoyaltyStatus = (statusPoint: number): RewardStatus => {
  let status = 'BRONZE';
  if (statusPoint >= loyaltyPoints.BRONZE) status = 'SILVER';
  else if (statusPoint >= loyaltyPoints.SILVER) status = 'GOLD';
  else if (statusPoint >= loyaltyPoints.GOLD) status = 'PLATINUM';
  else if (statusPoint >= loyaltyPoints.PLATINUM) status = 'DIAMOND';
  else if (statusPoint >= loyaltyPoints.DIAMOND) status = 'DIAMOND';
  return status as RewardStatus;
};

export const allocatedPoints = async (statusPoint: number) => {
  const points: Record<RewardStatus, number> = {
    BRONZE: 1,
    SILVER: 1.2,
    GOLD: 1.4,
    PLATINUM: 1.45,
    DIAMOND: 1.5,
  };
  const status = getLoyaltyStatus(statusPoint);
  return points[status];
};
