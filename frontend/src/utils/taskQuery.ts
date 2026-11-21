// Import the task types and the priority list (used to sort by priority).
import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { PRIORITY_OPTIONS } from "../constants/taskOptions";

// The choices a user makes on the task list page.
export interface TaskQuery {
  searchText: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  sortBy: "dueDate" | "priority" | "title" | "createdAt";
  sortDirection: "asc" | "desc";
  page: number;
}

// The starting values for the list page.
export const DEFAULT_QUERY: TaskQuery = {
  searchText: "",
  status: "all",
  priority: "all",
  sortBy: "dueDate",
  sortDirection: "asc",
  page: 1,
};

// Keep only the tasks that match the search text, status and priority.
export function filterTasks(tasks: Task[], query: TaskQuery): Task[] {
  const search = query.searchText.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch =
      search === "" ||
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search) ||
      task.assignee.toLowerCase().includes(search);
    const matchesStatus = query.status === "all" || task.status === query.status;
    const matchesPriority = query.priority === "all" || task.priority === query.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
}

// Find how important a priority is as a number, so priorities can be compared.
function getPriorityWeight(priority: TaskPriority): number {
  const option = PRIORITY_OPTIONS.find((item) => item.value === priority);
  return option ? option.weight : 0;
}

// Sort the tasks by the chosen column and direction (a copy is sorted, the original is not changed).
export function sortTasks(tasks: Task[], query: TaskQuery): Task[] {
  const sortedTasks = [...tasks];

  sortedTasks.sort((first, second) => {
    let result = 0;

    if (query.sortBy === "title") {
      result = first.title.localeCompare(second.title);
    } else if (query.sortBy === "priority") {
      result = getPriorityWeight(first.priority) - getPriorityWeight(second.priority);
    } else if (query.sortBy === "createdAt") {
      result = first.createdAt.localeCompare(second.createdAt);
    } else {
      result = first.dueDate.localeCompare(second.dueDate);
    }

    return query.sortDirection === "asc" ? result : -result;
  });

  return sortedTasks;
}

// Cut the list down to the tasks that belong on the current page.
export function paginateTasks(tasks: Task[], page: number, perPage: number): Task[] {
  const startIndex = (page - 1) * perPage;
  return tasks.slice(startIndex, startIndex + perPage);
}
