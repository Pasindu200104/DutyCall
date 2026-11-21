// Import the types so the lists below are checked by TypeScript.
import type { TaskPriority, TaskStatus } from "../types/task";

// Every status with its label and the Tailwind colours used for badges and dots.
export const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  columnClass: string;
}[] = [
  { value: "todo", label: "To do", badgeClass: "bg-slate-100 text-slate-700", dotClass: "bg-slate-400", columnClass: "bg-slate-100/70" },
  { value: "in_progress", label: "In progress", badgeClass: "bg-blue-100 text-blue-700", dotClass: "bg-blue-500", columnClass: "bg-blue-50" },
  { value: "review", label: "Review", badgeClass: "bg-amber-100 text-amber-800", dotClass: "bg-amber-500", columnClass: "bg-amber-50" },
  { value: "completed", label: "Completed", badgeClass: "bg-emerald-100 text-emerald-700", dotClass: "bg-emerald-500", columnClass: "bg-emerald-50" },
];

// Every priority with its label and colours. The order goes from lowest to highest.
export const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  badgeClass: string;
  weight: number;
}[] = [
  { value: "low", label: "Low", badgeClass: "bg-slate-100 text-slate-600", weight: 1 },
  { value: "normal", label: "Normal", badgeClass: "bg-sky-100 text-sky-700", weight: 2 },
  { value: "high", label: "High", badgeClass: "bg-orange-100 text-orange-700", weight: 3 },
  { value: "urgent", label: "Urgent", badgeClass: "bg-red-100 text-red-700", weight: 4 },
];

// The people a task can be assigned to.
export const TEAM_MEMBERS: string[] = [
  "Pasindu Fernando",
  "Nimali Perera",
  "Kasun Silva",
  "Tharindu Jayasuriya",
];

// The name used when the current user writes a comment.
export const CURRENT_USER_NAME = "Pasindu Fernando";

// How many tasks are shown on each page of the task list.
export const TASKS_PER_PAGE = 6;
