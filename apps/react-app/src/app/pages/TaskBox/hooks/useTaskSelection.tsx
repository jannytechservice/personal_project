import { Task, TaskStatus, getTask } from '@admiin-com/ds-graphql';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID } from '@admiin-com/ds-graphql';

export const useTaskSelection = () => {
  const { id } = useParams();
  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));
  const entityId = selectedEntityIdData?.selectedEntityId;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: getTaskData, loading } = useQuery(gql(getTask), {
    variables: {
      id,
      entityId,
    },
    skip: !id || !entityId,
    notifyOnNetworkStatusChange: true,
  });

  const task = React.useMemo(
    () =>
      getTaskData?.getTask
        ? { ...getTaskData?.getTask, amount: getTaskData?.getTask.amount / 100 }
        : null,
    [getTaskData]
  );

  const [selectedTasks, setSelectedTasks] = React.useState<Array<Task>>([]);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const multiSelect = (task: Task, isUpdate = false) => {
    const index = selectedTasks.findIndex((t) => t.id === task.id);
    let updated = [];
    if (index >= 0) {
      updated = [
        ...selectedTasks.slice(0, index),
        ...(isUpdate ? [task] : []),
        ...selectedTasks.slice(index + 1),
      ];
    } else updated = selectedTasks.concat(task);
    setSelectedTasks(updated);
    if (updated.length > 0 && selectedTask) handleTaskSelection(null);
  };

  const handleTaskSelection = React.useCallback(
    (task: Task | null) => {
      if (task) {
        const statusFilter = getStatusFilter(task.status);
        navigate(
          `/taskbox/${task.id}?direction=${task.direction}&status=${statusFilter}`
        );
        setSelectedTask(task);
      } else {
        setSelectedTask(null);
        navigate(`/taskbox?${searchParams.toString()}`);
      }
    },
    [navigate, selectedTask, searchParams]
  );

  const getStatusFilter = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.INCOMPLETE:
      case TaskStatus.DRAFT:
        return 'Due';
      case TaskStatus.COMPLETED:
        return 'Completed';
      case TaskStatus.SCHEDULED:
        return 'Scheduled';
      default:
        return 'Due';
    }
  };

  React.useEffect(() => {
    if (task) {
      handleTaskSelection(task);
    }
  }, [task]);
  console.log('selection', task, selectedTask);

  return {
    selectedTasks,
    setSelectedTasks,
    selectedTask,
    loadingTask: loading,
    detailView: !!id,
    setSelectedTask: handleTaskSelection,
    multiSelect,
  };
};
