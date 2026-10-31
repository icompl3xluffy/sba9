import type { TaskListProps } from '../../../types';
import TaskItem from './TaskItem';

function TaskList({ tasks, onStatusChange, onDelete, onMove }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          isFirst={index === 0}
          isLast={index === tasks.length - 1}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
}

export default TaskList;