import type { TaskItemProps, TaskStatus } from '../../types';
import { formatDate } from '../../utils/taskUtils';

function TaskItem({
  task,
  isFirst,
  isLast,
  onStatusChange,
  onDelete,
  onMove,
}: TaskItemProps) {
  return (
    <div className={`task-item status-${task.status} priority-${task.priority}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button onClick={() => onMove(task.id, 'up')} disabled={isFirst}>
        ↑
      </button>
      <button onClick={() => onMove(task.id, 'down')} disabled={isLast}>
        ↓
      </button>
      <button onClick={() => onDelete(task.id)}>Delete</button>

      <p>
        Priority: {task.priority}
        {task.priority === 'high' && ' 🔥'}
      </p>
      <p>Due: {formatDate(task.dueDate)}</p>

      {task.status === 'completed' && <span className="done-badge">✅ Done!</span>}
    </div>
  );
}

export default TaskItem;