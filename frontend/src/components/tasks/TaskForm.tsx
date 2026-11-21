// Import the React tools, types, validation and reusable form pieces.
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { TaskInput } from "../../types/task";
import { PRIORITY_OPTIONS, STATUS_OPTIONS, TEAM_MEMBERS } from "../../constants/taskOptions";
import { validateTask, type TaskFormErrors } from "../../utils/validateTask";
import { SelectInput, TextArea, TextInput } from "../ui/FormField";
import Button from "../ui/Button";

interface TaskFormProps {
  initialValues: TaskInput;
  isNewTask: boolean;
  submitLabel: string;
  cancelPath: string;
  onSubmit: (values: TaskInput) => Promise<void>;
}

// The form used for both creating and editing a task.
export default function TaskForm({ initialValues, isNewTask, submitLabel, cancelPath, onSubmit }: TaskFormProps) {
  const [values, setValues] = useState<TaskInput>(initialValues);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Update one field in the form. We also clear that field's error as the user types a fix.
  function handleChange(field: keyof TaskInput, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  // Run when the user presses the save button.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    // Step 1: check every field. If something is wrong, show the errors and stop.
    const foundErrors = validateTask(values, isNewTask);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    // Step 2: send the clean values to the page that owns this form.
    setIsSaving(true);
    try {
      await onSubmit({ ...values, title: values.title.trim(), description: values.description.trim() });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save the task.");
      setIsSaving(false);
    }
  }

  return (
    // noValidate turns off the browser's own pop ups so our friendly messages are used instead.
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* A message for errors that come from the server. */}
      {submitError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <TextInput id="title" label="Title" value={values.title} error={errors.title} placeholder="For example: Design the login page" onChange={(event) => handleChange("title", event.target.value)} />

      <TextArea id="description" label={`Description (${values.description.length}/500)`} rows={4} value={values.description} error={errors.description} placeholder="Add more detail about this task" onChange={(event) => handleChange("description", event.target.value)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectInput id="status" label="Status" value={values.status} onChange={(event) => handleChange("status", event.target.value)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectInput>

        <SelectInput id="priority" label="Priority" value={values.priority} onChange={(event) => handleChange("priority", event.target.value)}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectInput>

        <SelectInput id="assignee" label="Assignee" value={values.assignee} error={errors.assignee} onChange={(event) => handleChange("assignee", event.target.value)}>
          <option value="">Choose a person</option>
          {TEAM_MEMBERS.map((member) => (
            <option key={member} value={member}>{member}</option>
          ))}
        </SelectInput>

        <TextInput id="dueDate" label="Due date" type="date" value={values.dueDate} error={errors.dueDate} onChange={(event) => handleChange("dueDate", event.target.value)} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Link to={cancelPath}>
          <Button type="button" variant="secondary">Cancel</Button>
        </Link>
        <Button type="submit" isLoading={isSaving}>{submitLabel}</Button>
      </div>
    </form>
  );
}
