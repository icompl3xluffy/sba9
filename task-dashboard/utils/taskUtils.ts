import type {
  Task,
  FilterOptions,
  SortOption,
  TaskFormData,
  TaskFormErrors,
  TaskStats,
} from '../types';

// Keep only the tasks that match the status, priority, and search words
export function filterTasks(tasks: Task[], filters: FilterOptions): Task[] {
  const search = filters.search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (!filters.status || t.status === filters.status) &&
      (!filters.priority || t.priority === filters.priority) &&
      (!search ||
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search))
  );
}

// Return a sorted COPY of the list (the original stays the same)
export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
  const copy = [...tasks];
  const priorityRank = { high: 0, medium: 1, low: 2 };

  if (sortBy === 'dueDate') {
    copy.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  } else if (sortBy === 'priority') {
    copy.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  } else if (sortBy === 'title') {
    copy.sort((a, b) => a.title.localeCompare(b.title));
  }
  return copy;
}

// Check the form and return a message for every field that is wrong
export function validateTaskForm(data: TaskFormData): TaskFormErrors {
  const errors: TaskFormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required.';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required.';
  }

  if (!data.dueDate) {
    errors.dueDate = 'Due date is required.';
  }

  return errors;
}

// Turn 2024-01-01 into a friendly date like 1/1/2024
export function formatDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString();
}

// Count how many tasks are in each status
export function getTaskStats(tasks: Task[]): TaskStats {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };
}

// Save tasks in the browser so they are still there after a refresh
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load saved tasks (returns an empty list if nothing is saved or it is broken)
export function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem('tasks');
    return saved ? (JSON.parse(saved) as Task[]) : [];
  } catch {
    return [];
  }
}

// Download the tasks as a .json file
export function exportTasks(tasks: Task[]): void {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tasks.json';
  link.click();
  URL.revokeObjectURL(url);
}


export function parseImportedTasks(text: string): Task[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error('File must contain a list of tasks.');
  }
  const validStatus = ['pending', 'in-progress', 'completed'];
  const validPriority = ['low', 'medium', 'high'];

  data.forEach((t) => {
    if (
      typeof t.id !== 'string' ||
      typeof t.title !== 'string' ||
      typeof t.description !== 'string' ||
      typeof t.dueDate !== 'string' ||
      !validStatus.includes(t.status) ||
      !validPriority.includes(t.priority)
    ) {
      throw new Error('One or more tasks are not in the right format.');
    }
  });
  return data as Task[];
}