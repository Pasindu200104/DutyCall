// The four columns (statuses) a task can be in on the board.
export type TaskStatus = "todo" | "in_progress" | "review" | "completed";

// How important a task is.
export type TaskPriority = "low" | "normal" | "high" | "urgent";

// The full shape of a task as it is stored in the backend.
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  createdAt: string;
}

// The data a user fills in when creating or editing a task (the server adds id and createdAt).
export type TaskInput = Omit<Task, "id" | "createdAt">;

// A comment written on a task.
export interface TaskComment {
  id: number;
  taskId: number;
  author: string;
  text: string;
  createdAt: string;
}
