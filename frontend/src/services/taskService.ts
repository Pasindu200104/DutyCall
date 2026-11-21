// Import the shared request function and the task types.
import { request } from "./apiClient";
import type { Task, TaskInput } from "../types/task";

// Get every task.
export function getTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

// Get one task by its id.
export function getTaskById(taskId: number): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`);
}

// Create a new task. The server adds the id, and we add the creation time here.
export function createTask(input: TaskInput): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ ...input, createdAt: new Date().toISOString() }),
  });
}

// Update some fields of an existing task (PATCH only changes the fields we send).
export function updateTask(taskId: number, changes: Partial<TaskInput>): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

// Delete a task and also delete the comments that belong to it.
export function deleteTask(taskId: number): Promise<null> {
  return request<null>(`/tasks/${taskId}?_dependent=comments`, { method: "DELETE" });
}
