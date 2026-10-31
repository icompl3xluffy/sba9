import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { TaskFormProps, TaskFormData, TaskFormErrors } from '../../../types';
import { validateTaskForm } from '../../../utils/taskUtils';

// What the form looks like when it is empty
const emptyForm: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

function TaskForm({ onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);
  const [errors, setErrors] = useState<TaskFormErrors>({});

  // Runs every time you type. It saves what you typed and clears that field's error.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  // Runs when you click "Add Task"
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const foundErrors = validateTaskForm(formData);
    setErrors(foundErrors);

    // If there are any errors, stop here and show them
    if (Object.keys(foundErrors).length > 0) return;

    onSubmit(formData);
    setFormData(emptyForm);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>Add a Task</h2>

      <label>
        Title
        <input name="title" value={formData.title} onChange={handleChange} />
      </label>
      {errors.title && <p className="error">{errors.title}</p>}

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      {errors.description && <p className="error">{errors.description}</p>}

      <label>
        Priority
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label>
        Due Date
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </label>
      {errors.dueDate && <p className="error">{errors.dueDate}</p>}

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;