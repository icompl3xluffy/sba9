export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type SortOption = 'none' | 'dueDate' | 'priority' | 'title';
export type Theme = 'light' | 'dark';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

// What the form collects (no id, because we make that when saving)
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

// One optional error message per form field
export interface TaskFormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export interface FilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  search: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface TaskItemProps {
  task: Task;
  isFirst: boolean;
  isLast: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, direction: 'up' | 'down') => void;
}

export interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, direction: 'up' | 'down') => void;
}

export interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
}

export interface TaskFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}