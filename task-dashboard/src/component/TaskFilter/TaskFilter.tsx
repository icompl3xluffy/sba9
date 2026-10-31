import type { TaskFilterProps } from '../../types';

function TaskFilter({ filters, onFilterChange }: TaskFilterProps) {
  const hasActive = filters.status || filters.priority || filters.search;

  return (
    <div className="task-filter">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
      />

      <select
        value={filters.status ?? ''}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            status: (e.target.value || undefined) as TaskFilterProps['filters']['status'],
          })
        }
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={filters.priority ?? ''}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            priority: (e.target.value || undefined) as TaskFilterProps['filters']['priority'],
          })
        }
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {hasActive && (
        <div className="active-filters">
          <span>Active filters:</span>
          {filters.status && <span className="chip">{filters.status}</span>}
          {filters.priority && <span className="chip">{filters.priority}</span>}
          {filters.search && <span className="chip">"{filters.search}"</span>}
          <button onClick={() => onFilterChange({ search: '' })}>Clear</button>
        </div>
      )}
    </div>
  );
}

export default TaskFilter;