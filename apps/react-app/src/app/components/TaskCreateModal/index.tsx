import TaskCreatModal from './TaskCreateModal';
import { useTaskCreateModal } from './useTaskCreateModal';

function TaskCreatModalContainer() {
  const props = useTaskCreateModal();

  return <TaskCreatModal {...props} />;
}
export default TaskCreatModalContainer;
