import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type {
  Task,
  TaskStatus,
  TaskFormData,
  FilterOptions,
  SortOption,
  Theme,
} from '../../../types';
import {
  filterTasks,
  sortTasks,
  getTaskStats,
  saveTasks,
  loadTasks,
  exportTasks,
  parseImportedTasks,
} from '../../../utils/taskUtils';
import TaskList from '../TaskList/TaskList';
import TaskForm from '../TaskForm/TaskForm';
import TaskFilter from '../TaskFilter/TaskFilter';

interface DashboardProps {
  theme: Theme;
  onToggleTheme: () => void;
}

function Dashboard({ theme, onToggleTheme }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filters, setFilters] = useState<FilterOptions>({ search: '' });
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [message, setMessage] = useState('');

  // Save to the browser every time the tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visibleTasks = sortTasks(filterTasks(tasks, filters), sortBy);
  const stats = getTaskStats(tasks);

  const handleAdd = (data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      status: 'pending',
    };
    setTasks([...tasks, newTask]);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  // Swap a task with the one above or below it in the list you can see
  const handleMove = (taskId: string, direction: 'up' | 'down') => {
    const index = visibleTasks.findIndex((t) => t.id === taskId);
    const neighbor = visibleTasks[direction === 'up' ? index - 1 : index + 1];
    if (!neighbor) return;

    const copy = [...tasks];
    const a = copy.findIndex((t) => t.id === taskId);
    const b = copy.findIndex((t) => t.id === neighbor.id);
    [copy[a], copy[b]] = [copy[b], copy[a]];
    setTasks(copy);
    setSortBy('none'); // sorting would hide the move, so turn it off
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setTasks(parseImportedTasks(text));
      setMessage('Tasks imported!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Import failed.');
    }
    e.target.value = '';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <button onClick={onToggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <div className="stats">
        <div className="stat">Total<strong>{stats.total}</strong></div>
        <div className="stat">Pending<strong>{stats.pending}</strong></div>
        <div className="stat">In Progress<strong>{stats.inProgress}</strong></div>
        <div className="stat">Completed<strong>{stats.completed}</strong></div>
      </div>

      <TaskForm onSubmit={handleAdd} />

      <TaskFilter filters={filters} onFilterChange={setFilters} />

      <div className="toolbar">
        <label>
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="none">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
        <button onClick={() => exportTasks(tasks)}>Export</button>
        <label className="import-label">
          Import
          <input type="file" accept=".json" onChange={handleImport} hidden />
        </label>
      </div>
      {message && <p className="message">{message}</p>}

      <TaskList
        tasks={visibleTasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onMove={handleMove}
      />
    </div>
  );
}

export default Dashboard;