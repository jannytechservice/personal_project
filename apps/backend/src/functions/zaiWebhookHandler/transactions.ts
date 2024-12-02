const {
  TABLE_CONTACT,
  TABLE_PAYMENT,
  TABLE_TASK,
  TABLE_ENTITY,
  TABLE_TRANSACTION,
  WEB_DOMAIN,
  FROM_EMAIL,
} = process.env;
import {
  Payment,
  Task,
  TaskDirection,
  Transaction,
} from 'dependency-layer/API';
import { currencyNumber } from 'dependency-layer/code';
import { createRecord, getRecord } from 'dependency-layer/dynamoDB';
import { sendEmailEntityUsers } from 'dependency-layer/entity';
import { sendEmail } from 'dependency-layer/pinpoint';
import { updateRewardRecord } from 'dependency-layer/user';
import {
  ZaiTransaction,
  ZaiTransactionWebhookEvent,
} from 'dependency-layer/zai';
import { DateTime } from 'luxon';

export const handleTransactionsEvent = async (
  payload: ZaiTransactionWebhookEvent
) => {
  console.log('TRANSACTIONS event: ', JSON.stringify(payload));
  const transaction: ZaiTransaction = payload?.transactions;
  console.log('transaction: ', transaction);
  // Card payment transaction record
  if (
    transaction?.type === 'payment' &&
    transaction?.type_method === 'credit_card'
  ) {
    console.log('account_type: ', transaction?.account_type);
    console.log('Admiin payment id: ', transaction.account_id); // account_id === zaiItem.id === Admiin payment.id

    let paymentRecord: Payment | null = null;
    try {
      paymentRecord = await getRecord(TABLE_PAYMENT ?? '', {
        id: transaction.account_id,
      });
      console.log('paymentRecord: ', paymentRecord);
    } catch (err: any) {
      console.log('ERROR get payment record: ', err);
    }

    let taskRecord: Task | null = null;
    try {
      taskRecord = await getRecord(TABLE_TASK ?? '', {
        id: paymentRecord?.taskId,
        entityId: paymentRecord?.entityId,
      });
      console.log('taskRecord: ', taskRecord);
    } catch (err: any) {
      console.log('ERROR get task record: ', err);
    }

    // create transaction record
    const transactionRecord: Transaction = {
      id: transaction?.id,
      // accountId: transaction?.account_id,
      amount: transaction?.amount,
      currency: transaction?.currency,
      status: transaction?.state,
      type: transaction?.type,
      typeMethod: transaction?.type_method,
      buyerId: transaction?.related?.transactions?.[0]?.user_id ?? null,
      taskId: transaction?.account_id,
      entityId: taskRecord?.entityId,
      referredBy: null,
      createdAt: transaction?.created_at,
      updatedAt: transaction?.updated_at,
      __typename: 'Transaction',
    };

    if (taskRecord?.entityId) {
      // Assuming `entityId` is the primary key in the entity table
      const entity = await getRecord(TABLE_ENTITY ?? '', {
        id: taskRecord.entityId,
      });

      if (entity?.referredBy) {
        // Add referredBy to transactionRecord if it exists in the entity
        transactionRecord.referredBy = entity.referredBy;
      }
    }

    try {
      await createRecord(TABLE_TRANSACTION ?? '', transactionRecord);
      console.log('transactionRecord: ', transactionRecord);
    } catch (err) {
      console.log('ERROR create transaction record', err);
    }

    // email confirmation - invoice for payer if they created invoice in admiin and sent to contact
    if (
      taskRecord?.direction === TaskDirection.SENDING &&
      taskRecord &&
      paymentRecord?.netAmount
    ) {
      try {
        await sendEmailEntityUsers({
          entityId: paymentRecord?.entityId ?? '',
          templateName: 'invoice-confirmation-payee',
          templateData: {
            task: {
              ...taskRecord,
              url: `${WEB_DOMAIN}/taskbox/${taskRecord.id}`,
            },
            payment: {
              ...paymentRecord,
              netWithCurrency: currencyNumber({
                amount: paymentRecord?.netAmount / 100,
              }),
              dateFormatted: DateTime.fromISO(
                transactionRecord?.createdAt ?? ''
              ).toLocaleString(DateTime.DATE_HUGE),
            },
            template: {
              title: 'Your Invoice Has Been Paid',
              preheader: `A Payment for your Invoice ${taskRecord?.reference} has been received`,
            },
          },
        });
      } catch (err: any) {
        console.log('ERROR send invoice-confirmation-payee: ', err);
      }

      let contactToRecord;
      try {
        contactToRecord = await getRecord(TABLE_CONTACT ?? '', {
          id: taskRecord?.toId,
        });
        console.log('contactToRecord: ', contactToRecord);
      } catch (err: any) {
        console.log('ERROR get contact record: ', err);
      }

      try {
        await sendEmail({
          senderAddress: FROM_EMAIL ?? '',
          toAddresses: [contactToRecord.email],
          templateName: 'invoice-confirmation-payer',
          templateData: {
            task: taskRecord,
            user: {
              firstName: contactToRecord.firstName,
            },
            payment: {
              ...paymentRecord,
              totalWithCurrency: transactionRecord?.amount
                ? currencyNumber({ amount: transactionRecord?.amount / 100 })
                : '',
              dateFormatted: DateTime.fromISO(
                transactionRecord.createdAt ?? ''
              ).toLocaleString(DateTime.DATE_HUGE),
              method: transactionRecord.typeMethod,
            },
            template: {
              title: 'Invoice Payment Receipt',
              preheader: `Your Receipt For Invoice ${taskRecord?.reference}`,
            },
          },
        });
      } catch (err: any) {
        console.log('ERROR send invoice-confirmation-payer: ', err);
      }
    }

    try {
      if (paymentRecord && taskRecord && taskRecord.entityId) {
        await updateRewardRecord(transaction, paymentRecord, taskRecord);
      }
    } catch (err) {
      console.log('ERROR updateRewardAndReferralRecord: ', err);
    }
  } else if (
    transaction?.type === 'disbursement' &&
    transaction?.type_method === 'direct_credit'
  ) {
    const transactionRecord: Transaction = {
      id: transaction?.id,
      amount: transaction?.amount,
      currency: transaction?.currency,
      description: transaction?.description,
      status: transaction?.state,
      type: transaction?.type,
      typeMethod: transaction?.type_method,
      // debitCredit: transaction?.debit_credit,
      entityId: transaction?.account_id,
      referredBy: null,
      createdAt: transaction?.created_at,
      updatedAt: transaction?.updated_at,
      __typename: 'Transaction',
    };

    if (transaction?.account_id) {
      // Assuming `entityId` is the primary key in the entity table
      const entity = await getRecord(TABLE_ENTITY ?? '', {
        id: transaction.account_id,
      });

      if (entity?.referredBy) {
        // Add referredBy to transactionRecord if it exists in the entity
        transactionRecord.referredBy = entity.referredBy;
      }
    }

    try {
      await createRecord(TABLE_TRANSACTION ?? '', transactionRecord);
      console.log('transactionRecord: ', transactionRecord);
    } catch (err) {
      console.log('ERROR create transaction record', err);
    }
  }
  // npp payin - not in use (payto / payid - would not be functional anymore)
  //else if (
  //  transaction?.type === 'deposit' &&
  //  transaction?.type_method === 'npp_payin' &&
  //  transaction?.state === 'successful'
  //) {
  //  console.log('NPP_PAYIN transaction: ', transaction);
  //
  //  // TODO: see if necessary, can also get further transaction details?
  //  // Basic details - Show Transaction API
  //  // Additional details - Show Transaction Supplementary Data API
  //  let tasks: Task[] = [];
  //
  //  // PAYTO pay in received
  //  if (transaction?.payin_details?.agreement_uuid) {
  //    console.log('PAYTO PAYIN');
  //
  //    //const instructionId = transaction?.payin_details?.instruction_id;
  //    //console.log('instructionId: ', instructionId);
  //
  //    // get tasks for agreement to reconcile
  //    try {
  //      const params = {
  //        tableName: TABLE_TASK ?? '',
  //        indexName: 'tasksByAgreementUuid',
  //        keys: {
  //          agreementUuid: transaction.payin_details.agreement_uuid
  //        }
  //      };
  //
  //      tasks = await queryRecords(params);
  //      console.log('tasks: ', tasks);
  //    } catch (err) {
  //      console.log('ERROR query agreement tasks: ', err);
  //    }
  //
  //    // for each task
  //    for (const task of tasks) {
  //      console.log('task: ', task);
  //      // query task payments pending pay to transfer
  //      let taskPayments;
  //      try {
  //        const params = {
  //          tableName: TABLE_PAYMENT ?? '',
  //          indexName: 'paymentsByTask',
  //          keys: {
  //            taskId: task.id
  //          },
  //          filter: {
  //            status: PaymentStatus.PENDING_PAYMENT_INITIATION
  //          }
  //        };
  //        taskPayments = await queryRecords(params);
  //        console.log('taskPayments: ', taskPayments);
  //      } catch (err: any) {
  //        console.log('ERROR getTaskPayments: ', err);
  //        //throw new Error(err.message);
  //      }
  //
  //      if (!taskPayments || taskPayments.length === 0) {
  //        console.log(
  //          'could not find task payments for task to reconcile: ',
  //          task.id
  //        );
  //      }
  //      else {
  //        // calculate total amount that should have been received
  //        let totalAmount = 0;
  //        for (const taskPayment of taskPayments) {
  //          totalAmount += taskPayment.amount;
  //        }
  //
  //        const isPaid =
  //          totalAmount !== 0 && totalAmount === transaction.amount;
  //        if (!isPaid) {
  //          console.log('UNABLE TO RECONCILE AMOUNT: ', taskPayments);
  //        }
  //
  //        // reconcile payment
  //        else {
  //          for (const taskPayment of taskPayments) {
  //            totalAmount += taskPayment.amount;
  //
  //            // set payment status to paid
  //            let updatedTaskPayment;
  //            try {
  //              updatedTaskPayment = await updateRecord(
  //                TABLE_PAYMENT ?? '',
  //                { id: taskPayments[0].id },
  //                {
  //                  status: PaymentStatus.COMPLETED,
  //                  paidAt: new Date().toISOString(), //TODO: from transaction?
  //                  updatedAt: new Date().toISOString()
  //                  //zaiUpdatedAt: //TODO: set this? or should we remove completely?
  //                }
  //              );
  //              console.log('updatedTaskPayment: ', updatedTaskPayment);
  //            } catch (err: any) {
  //              console.log('ERROR update task payment record', err);
  //            }
  //
  //            // if only installment, mark task as paid
  //            let updateTaskParams: Partial<Task> = {};
  //            if (
  //              taskPayment.installment === 1 &&
  //              taskPayment.installments === 1
  //            ) {
  //              updateTaskParams = {
  //                ...updateTaskParams,
  //                // updatedAt: new Date().toISOString(),
  //                paymentStatus: TaskPaymentStatus.PAID
  //              };
  //
  //              // if signed, set task status as completed
  //              if (
  //                task?.status !== TaskStatus.COMPLETED &&
  //                task.signatureStatus !== TaskSignatureStatus.PENDING_SIGNATURE
  //              ) {
  //                updateTaskParams = {
  //                  ...updateTaskParams,
  //                  status: TaskStatus.COMPLETED,
  //                  fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
  //                  toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`
  //                };
  //              }
  //            }
  //
  //            // For task with multiple installments, If all payments are paid, mark task as completed
  //            else {
  //              let allTaskPayments;
  //              try {
  //                const params = {
  //                  tableName: TABLE_PAYMENT ?? '',
  //                  indexName: 'paymentsByTask',
  //                  keys: {
  //                    taskId: task.id
  //                  }
  //                };
  //                allTaskPayments = await queryRecords(params);
  //                console.log('allTaskPayments: ', allTaskPayments);
  //              } catch (err: any) {
  //                console.log('ERROR get all task payments: ', err);
  //              }
  //
  //              // if all paid, mark task as paid
  //              const allPaid =
  //                allTaskPayments &&
  //                allTaskPayments.every(
  //                  (taskPayment) =>
  //                    taskPayment.status === PaymentStatus.COMPLETED
  //                );
  //
  //              if (allPaid) {
  //                updateTaskParams = {
  //                  ...updateTaskParams,
  //                  paymentStatus: TaskPaymentStatus.PAID
  //                };
  //
  //                // if signed, set task status as completed
  //                if (
  //                  task?.status !== TaskStatus.COMPLETED &&
  //                  task.signatureStatus !==
  //                  TaskSignatureStatus.PENDING_SIGNATURE
  //                ) {
  //                  updateTaskParams = {
  //                    ...updateTaskParams,
  //                    status: TaskStatus.COMPLETED,
  //                    fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
  //                    toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`
  //                  };
  //                }
  //              }
  //            }
  //
  //            // update task if params to do so
  //            if (Object.entries(updateTaskParams)?.length > 0) {
  //              let updatedTask;
  //              try {
  //                updatedTask = await updateRecord(
  //                  TABLE_TASK ?? '',
  //                  { id: task.id, entityId: task.entityId },
  //                  updateTaskParams
  //                );
  //                console.log('updatedTask: ', updatedTask);
  //              } catch (err: any) {
  //                console.log('ERROR update task record', err);
  //              }
  //            }
  //
  //            // get seller for phone number - required for amex
  //            let sellerEntity;
  //            try {
  //              sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
  //                id: taskPayment.fromId
  //              });
  //              console.log('sellerEntity: ', sellerEntity);
  //            } catch (err: any) {
  //              console.log('ERROR get entity: ', err);
  //            }
  //
  //            // create zai item to transfer funds from buyer's wallet to seller's wallet
  //            let zaiItem;
  //            try {
  //              const zaiItemParams = {
  //                id: taskPayment.id,
  //                name: `task: ${taskPayment.id}`,
  //                payment_type: 2,
  //                amount: taskPayment.amount,
  //                currency: 'AUD',
  //                buyer_id: taskPayment.buyerId,
  //                seller_id: taskPayment.sellerId
  //              };
  //
  //              console.log('zaiItemParams: ', zaiItemParams);
  //              const zaiItemData = await createZaiItem(
  //                zaiAuthToken?.access_token,
  //                zaiItemParams
  //              );
  //              console.log('zaiItemData: ', zaiItemData);
  //
  //              zaiItem = zaiItemData?.items;
  //            } catch (err: any) {
  //              console.log('ERROR createZaiItem: ', err);
  //            }
  //
  //            //make payment for item
  //            if (zaiItem?.id) {
  //              let itemPaymentData;
  //              const itemPaymentParams = {
  //                account_id: transaction.account_id,
  //                ip_address: taskPayment.ipAddress,
  //                merchant_phone: sellerEntity?.contact?.phone
  //              };
  //              console.log('makeZaiPayment params: ', itemPaymentParams);
  //              try {
  //                itemPaymentData = await makeZaiPayment(
  //                  zaiAuthToken?.access_token,
  //                  zaiItem.id,
  //                  itemPaymentParams
  //                );
  //                console.log('makeZaiPayment data: ', itemPaymentData);
  //                zaiItem = itemPaymentData?.items;
  //              } catch (err: any) {
  //                console.log('ERROR makeZaiPayment: ', JSON.stringify(err));
  //              }
  //
  //              // get wallet to see if funds disbursed
  //              let wallet;
  //              try {
  //                wallet = await getWallet(
  //                  zaiAuthToken?.access_token,
  //                  accountId
  //                );
  //                console.log('wallet: ', wallet);
  //
  //                //TODO: see if disbursed
  //              } catch (err: any) {
  //                console.log('ERROR get wallet: ', err);
  //              }
  //            }
  //          }
  //        }
  //      }
  //    }
  //  }
  //
  //  // PAYID pay in received
  //  else {
  //    console.log('PAYID PAYIN');
  //    // get TABLE_PAY_IN_PAYMENTS by paymentUserId
  //    let payInPaymentRecords;
  //    try {
  //      payInPaymentRecords = await queryRecords({
  //        tableName: TABLE_PAY_IN_PAYMENTS ?? '',
  //        indexName: 'payInPaymentsByProviderUser',
  //        keys: {
  //          paymentUserId: transaction?.user_id,
  //          status: PayInPaymentStatus.PENDING_PAYID_TRANSFER
  //        }
  //      });
  //      console.log(
  //        'payInPaymentRecords: ',
  //        JSON.stringify(payInPaymentRecords)
  //      );
  //    } catch (err) {
  //      console.log('ERROR query pay in payments: ', err);
  //    }
  //
  //    if (!payInPaymentRecords || payInPaymentRecords.length === 0) {
  //      console.log('NO PAY IN PAYMENTS TO RECONCILE FOR USER');
  //    }
  //
  //    // get tasks for payment
  //    else {
  //      for (const payInPaymentRecord of payInPaymentRecords) {
  //        const keys = payInPaymentRecord?.billPayments?.map(
  //          ({ id }: { id: string }) => ({
  //            entityId: payInPaymentRecord.entityId,
  //            id
  //          })
  //        );
  //        //if (!keys || keys.length === 0) {
  //        //  console.log('NO BILLS / KEYS')
  //        //}
  //        //else {
  //        try {
  //          tasks = await batchGet({
  //            tableName: TABLE_TASK ?? '',
  //            keys
  //          });
  //
  //          console.log('tasks: ', tasks);
  //        } catch (err: any) {
  //          console.log('ERROR batch get tasks: ', err);
  //          throw new Error(err.message);
  //        }
  //
  //        if (!tasks || tasks.length === 0) {
  //          console.log('NO TASKS FOUND FOR NPP PAYIN reconciliation');
  //        }
  //
  //        // reconcile payments
  //        else {
  //          for (const task of tasks) {
  //            console.log('task: ', task);
  //            // query task payments pending pay to transfer
  //            let taskPayments;
  //            try {
  //              const params = {
  //                tableName: TABLE_PAYMENT ?? '',
  //                indexName: 'paymentsByTask',
  //                keys: {
  //                  taskId: task.id
  //                },
  //                filter: {
  //                  status: PaymentStatus.PENDING_PAYID_TRANSFER
  //                }
  //              };
  //              taskPayments = await queryRecords(params);
  //              console.log('taskPayments: ', taskPayments);
  //            } catch (err: any) {
  //              console.log('ERROR getTaskPayments: ', err);
  //              console.log(err.message);
  //            }
  //
  //            if (!taskPayments || taskPayments.length === 0) {
  //              console.log(
  //                'could not find task payments for task to reconcile: ',
  //                task.id
  //              );
  //            }
  //
  //            // reconcile payments
  //            else {
  //              // calculate total amount that should have been received
  //              let totalAmount = 0;
  //              for (const taskPayment of taskPayments) {
  //                totalAmount += taskPayment.amount;
  //              }
  //
  //              let isPaid = false;
  //              if (totalAmount !== 0 && totalAmount === transaction.amount) {
  //                isPaid = true;
  //              }
  //
  //              // get wallet to see if can be reconciled with payid payin payment
  //              else {
  //                let wallet;
  //                try {
  //                  wallet = await getWallet(
  //                    zaiAuthToken?.access_token,
  //                    accountId
  //                  );
  //                  console.log('wallet: ', wallet);
  //                } catch (err: any) {
  //                  console.log('ERROR get wallet: ', err);
  //                }
  //
  //                if (
  //                  totalAmount !== 0 &&
  //                  totalAmount === wallet?.wallet_accounts?.balance
  //                ) {
  //                  isPaid = true;
  //                }
  //              }
  //
  //              if (!isPaid) {
  //                console.log('UNABLE TO RECONCILE AMOUNT: ', taskPayments);
  //              }
  //              else {
  //                for (const taskPayment of taskPayments) {
  //                  console.log('taskPayment: ', taskPayment);
  //                  // forward funds to seller
  //                  //let buyerId;
  //                  //let sellerId;
  //                  // payment buyer is an entity
  //                  //if (taskPayment.toType === FromToType.ENTITY) {
  //                  //  let buyerEntity;
  //                  //  try {
  //                  //    buyerEntity = await getRecord(TABLE_ENTITY ?? '', {
  //                  //      id: taskPayment.toId,
  //                  //    });
  //                  //    console.log('buyerEntity: ', buyerEntity);
  //                  //    buyerId = buyerEntity.paymentUserId;
  //                  //  } catch (err: any) {
  //                  //    console.log('ERROR get entity: ', err);
  //                  //  }
  //                  //
  //                  //  if (!buyerEntity) {
  //                  //    console.log('ERROR_GET_ENTITY_TO');
  //                  //  }
  //                  //}
  //
  //                  // payment buyer is a contact
  //                  //else if (taskPayment.toType === FromToType.CONTACT) {
  //                  //  let buyerContact;
  //                  //  try {
  //                  //    buyerContact = await getRecord(TABLE_CONTACT ?? '', {
  //                  //      id: taskPayment.toId,
  //                  //    });
  //                  //    console.log('buyerContact: ', buyerContact);
  //                  //    buyerId = buyerContact.paymentUserId;
  //                  //  } catch (err: any) {
  //                  //    console.log('ERROR get contact: ', err);
  //                  //    //throw new Error(err.message);
  //                  //  }
  //                  //
  //                  //  if (!buyerContact) {
  //                  //    console.log('ERROR_GET_CONTACT_TO');
  //                  //  }
  //                  //}
  //
  //                  // invalidate toType
  //                  //else {
  //                  //  console.log('ERROR_TO_TYPE');
  //                  //}
  //
  //                  let sellerEntity;
  //                  try {
  //                    sellerEntity = await getRecord(TABLE_ENTITY ?? '', {
  //                      id: taskPayment.fromId
  //                    });
  //                    console.log('entityTo: ', sellerEntity);
  //                    //sellerId = sellerEntity.paymentUserId;
  //                  } catch (err: any) {
  //                    console.log('ERROR get entity: ', err);
  //                    console.log(err.message);
  //                  }
  //
  //                  if (!sellerEntity) {
  //                    console.log('ERROR_GET_ENTITY_TO');
  //                  }
  //
  //                  console.log('taskPayment: ', taskPayment);
  //                  // create zai item to transfer funds from buyer's wallet to seller's wallet
  //                  const zaiItemParams = {
  //                    id: taskPayment.id,
  //                    name: `task: ${taskPayment.id}`,
  //                    payment_type: 2,
  //                    amount: taskPayment.amount,
  //                    currency: 'AUD',
  //                    buyer_id: taskPayment.buyerId,
  //                    seller_id: taskPayment.sellerId
  //                  };
  //
  //                  console.log('zaiItemParams: ', zaiItemParams);
  //
  //                  let zaiItem;
  //                  try {
  //                    const zaiItemData = await createZaiItem(
  //                      zaiAuthToken?.access_token,
  //                      zaiItemParams
  //                    );
  //                    console.log('zaiItemData: ', zaiItemData);
  //
  //                    zaiItem = zaiItemData?.items;
  //                  } catch (err: any) {
  //                    console.log('ERROR createZaiItem: ', err);
  //                    //throw new Error(err.message);
  //                  }
  //
  //                  //make payment for item
  //                  if (zaiItem?.id) {
  //                    let itemPaymentData;
  //                    const itemPaymentParams = {
  //                      account_id: transaction.account_id,
  //                      ip_address: taskPayment.ipAddress,
  //                      merchant_phone: sellerEntity?.contact?.phone
  //                    };
  //                    console.log('makeZaiPayment params: ', itemPaymentParams);
  //                    try {
  //                      itemPaymentData = await makeZaiPayment(
  //                        zaiAuthToken?.access_token,
  //                        zaiItem.id,
  //                        itemPaymentParams
  //                      );
  //                      console.log('makeZaiPayment data: ', itemPaymentData);
  //                      zaiItem = itemPaymentData?.items;
  //                    } catch (err: any) {
  //                      console.log(
  //                        'ERROR makeZaiPayment: ',
  //                        JSON.stringify(err)
  //                      );
  //                    }
  //
  //                    // get wallet to see if funds disbursed
  //                    let wallet;
  //                    try {
  //                      wallet = await getWallet(
  //                        zaiAuthToken?.access_token,
  //                        accountId
  //                      );
  //                      console.log('wallet: ', wallet);
  //
  //                      //TODO: see if disbursed
  //                    } catch (err: any) {
  //                      console.log('ERROR get wallet: ', err);
  //                    }
  //
  //                    // if disbursed funds, update payment to paid
  //                    if (zaiItem) {
  //                      // TODO: confirm if this is correct details to save if paid
  //                      let updatedTaskPayment;
  //                      try {
  //                        updatedTaskPayment = await updateRecord(
  //                          TABLE_PAYMENT ?? '',
  //                          { id: taskPayment.id },
  //                          {
  //                            status: ItemStatuses[zaiItem.status],
  //                            //zaiUpdatedAt: zaiItem.updated_at + '',
  //                            updatedAt: zaiItem.updated_at + '',
  //                            paidAt: new Date().toISOString()
  //                          }
  //                        );
  //                        console.log(
  //                          'updatedTaskPayment: ',
  //                          updatedTaskPayment
  //                        );
  //                      } catch (err: any) {
  //                        console.log('ERROR update task payment record', err);
  //                      }
  //
  //                      //TODO: only update if task actually paid completely?
  //
  //                      const updateTaskParams = {
  //                        paymentStatus: TaskPaymentStatus.PAID,
  //                        status: TaskStatus.COMPLETED,
  //                        //paidAt: paidOutAt,
  //                        fromSearchStatus: `${task.fromId}#${TaskSearchStatus.COMPLETED}`,
  //                        toSearchStatus: `${task.toId}#${TaskSearchStatus.COMPLETED}`
  //                      };
  //
  //                      // if not pending signature, update status to completed
  //                      if (
  //                        task.signatureStatus !==
  //                        TaskSignatureStatus.PENDING_SIGNATURE
  //                      ) {
  //                        updateTaskParams.status = TaskStatus.COMPLETED;
  //                      }
  //
  //                      try {
  //                        await updateRecord(
  //                          TABLE_TASK ?? '',
  //                          { entityId: task.entityId, id: task.id },
  //                          {
  //                            ...updateTaskParams,
  //                            updatedAt: new Date().toISOString()
  //                          }
  //                        );
  //                      } catch (err: any) {
  //                        console.log('ERROR update task status: ', err);
  //                        throw new Error(err.message);
  //                      }
  //
  //                      // update pay_in_payment record
  //                      try {
  //                        await updateRecord(
  //                          TABLE_PAY_IN_PAYMENTS ?? '',
  //                          { id: payInPaymentRecord.id },
  //                          {
  //                            status:
  //                            PayInPaymentStatus.PAID_OUT_PAYID_TRANSFER,
  //                            updatedAt: new Date().toISOString(),
  //                            receivedAt: transaction.created_at,
  //                            paidOutAt: zaiItem.updated_at
  //                          }
  //                        );
  //                      } catch (err: any) {
  //                        console.log(
  //                          'ERROR update pay in payment status: ',
  //                          err
  //                        );
  //                      }
  //                    }
  //                  }
  //                }
  //              }
  //            }
  //          }
  //          //}
  //        }
  //      }
  //    }
  //  }
  //
  //  // With PayID, it will be different as the funds will settle into the Buyer's wallet as opposed to the Seller's wallet.
  //  // So you can transfer the funds to each seller's wallet only after the reconciliation.
  //  // You can use reference details entered by them for each payin to reconcile at your end
  //}
  else {
    console.log('UNHANDLED transaction: ', transaction);
  }

  //let existingTransaction;
  //try {
  //  existingTransaction = await getRecord(TABLE_PAYMENT ?? '', {
  //    id
  //  });
  //
  //  console.log('existingTransaction: ', existingTransaction);
  //} catch (err) {
  //  console.log('ERROR get existing transaction: ', err);
  //}

  // updatedAt is later than existingTransaction.updatedAt

  //if (isUpdatedDateNewerThanExisting(updatedAt, existingTransaction?.updatedAt)) {
  //  //
  //
  //  try {
  //    const paymentParams = {
  //      updatedAt
  //    };
  //    console.log('paymentParams: ', paymentParams);
  //
  //    await updateRecord(TABLE_PAYMENT ?? '', { id }, paymentParams);
  //  } catch (err: any) {
  //    console.log('ERROR update payment record', err);
  //    throw new Error(err.message);
  //  }
  //
  //  // create transaction record if successful
  //  if (transaction?.state === 'successful') {
  //    const transactionParams = {
  //      id: transaction?.id,
  //    }
  //
  //    try {
  //      await createRecord(TABLE_TRANSACTION ?? '', transactionParams);
  //    } catch (err) {
  //      console.log('ERROR create transaction record', err);
  //    }
  //  }
  //}

  if (transaction?.type === 'payment') {
    //if (transaction?.type_method === 'credit_card') {
    //}
  }
};
