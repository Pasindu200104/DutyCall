// Import the types and the helper that gives today's date.
import type { TaskInput } from "../types/task";
import { getTodayText } from "./dateHelpers";

// An object that holds one error message for each field that is wrong.
export type TaskFormErrors = Partial<Record<keyof TaskInput, string>>;

// Check every field of the form and return the error messages (an empty object means all good).
export function validateTask(values: TaskInput, isNewTask: boolean): TaskFormErrors {
  const errors: TaskFormErrors = {};

  // The title is required and must have a sensible length.
  const title = values.title.trim();
  if (title === "") {
    errors.title = "Enter a title for the task.";
  } else if (title.length < 3) {
    errors.title = "The title needs at least 3 characters.";
  } else if (title.length > 80) {
    errors.title = "The title can have at most 80 characters.";
  }

  // The description is optional but cannot be too long.
  if (values.description.length > 500) {
    errors.description = "The description can have at most 500 characters.";
  }

  // An assignee must be chosen.
  if (values.assignee === "") {
    errors.assignee = "Choose who is responsible for this task.";
  }

  // The due date is required. New tasks cannot be due in the past.
  if (values.dueDate === "") {
    errors.dueDate = "Choose a due date.";
  } else if (isNewTask && values.dueDate < getTodayText()) {
    errors.dueDate = "The due date cannot be in the past.";
  }

  return errors;
}
