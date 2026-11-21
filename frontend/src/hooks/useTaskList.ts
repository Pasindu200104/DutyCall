// Import the React tools, the task data and the helper functions for filtering, sorting and paging.
import { useMemo, useState } from "react";
import { useTasks } from "../context/TaskContext";
import { TASKS_PER_PAGE } from "../constants/taskOptions";
import { DEFAULT_QUERY, filterTasks, paginateTasks, sortTasks, type TaskQuery } from "../utils/taskQuery";

// A hook that owns the search, filter, sort and page choices of the task list page.
export function useTaskList() {
  const { tasks } = useTasks();
  const [query, setQuery] = useState<TaskQuery>(DEFAULT_QUERY);

  // Change some choices. Going back to page 1 makes sense whenever the filters change.
  function updateQuery(changes: Partial<TaskQuery>) {
    setQuery((currentQuery) => ({ ...currentQuery, page: 1, ...changes }));
  }

  // Put every choice back to its starting value.
  function resetQuery() {
    setQuery(DEFAULT_QUERY);
  }

  // Work out the visible tasks. useMemo means this only runs again when the tasks or choices change.
  const result = useMemo(() => {
    const filteredTasks = sortTasks(filterTasks(tasks, query), query);
    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
    const currentPage = Math.min(query.page, totalPages);
    const visibleTasks = paginateTasks(filteredTasks, currentPage, TASKS_PER_PAGE);
    return { filteredCount: filteredTasks.length, totalPages, currentPage, visibleTasks };
  }, [tasks, query]);

  return { query, updateQuery, resetQuery, ...result };
}
