// Import the shared request function and the comment type.
import { request } from "./apiClient";
import type { TaskComment } from "../types/task";

// Get all comments that belong to one task.
export function getCommentsByTask(taskId: number): Promise<TaskComment[]> {
  return request<TaskComment[]>(`/comments?taskId=${taskId}&_sort=createdAt&_order=asc`);
}

// Add a new comment to a task.
export function addComment(taskId: number, author: string, text: string): Promise<TaskComment> {
  return request<TaskComment>("/comments", {
    method: "POST",
    body: JSON.stringify({ taskId, author, text, createdAt: new Date().toISOString() }),
  });
}
