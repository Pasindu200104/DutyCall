// Import the router link, hooks and components used on the list page.
import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useTaskList } from "../hooks/useTaskList";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../constants/taskOptions";
import { formatDate, isOverdue } from "../utils/dateHelpers";
import type { TaskPriority, TaskStatus } from "../types/task";
import type { TaskQuery } from "../utils/taskQuery";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import Avatar from "../components/ui/Avatar";
import { SelectInput, TextInput } from "../components/ui/FormField";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";

// The list page: all tasks with search, filters, sorting and pagination.
export default function TaskListPage() {
  const { tasks, isLoading, errorMessage, reloadTasks } = useTasks();
  const { query, updateQuery, resetQuery, filteredCount, totalPages, currentPage, visibleTasks } = useTaskList();

  // Loading and error screens.
  if (isLoading) return <Spinner message="Loading tasks..." />;
  if (errorMessage) return <ErrorState message={errorMessage} onRetry={reloadTasks} />;

  return (
    <div>
      <PageHeader
        title="Task list"
        subtitle={`${filteredCount} of ${tasks.length} tasks`}
        action={<Link to="/tasks/new"><Button>+ New task</Button></Link>}
      />

      {/* The search box, filters and sorting choices. */}
      <Card className="mb-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <TextInput id="search" label="Search" type="search" placeholder="Search by title, description or person" value={query.searchText} onChange={(event) => updateQuery({ searchText: event.target.value })} />
          </div>
          <SelectInput id="filter-status" label="Status" value={query.status} onChange={(event) => updateQuery({ status: event.target.value as TaskStatus | "all" })}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </SelectInput>
          <SelectInput id="filter-priority" label="Priority" value={query.priority} onChange={(event) => updateQuery({ priority: event.target.value as TaskPriority | "all" })}>
            <option value="all">All priorities</option>
            {PRIORITY_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </SelectInput>
          <SelectInput id="sort-by" label="Sort by" value={`${query.sortBy}-${query.sortDirection}`} onChange={(event) => {
            const [sortBy, sortDirection] = event.target.value.split("-");
            updateQuery({ sortBy: sortBy as TaskQuery["sortBy"], sortDirection: sortDirection as TaskQuery["sortDirection"] });
          }}>
            <option value="dueDate-asc">Due date (soonest)</option>
            <option value="dueDate-desc">Due date (latest)</option>
            <option value="priority-desc">Priority (highest)</option>
            <option value="priority-asc">Priority (lowest)</option>
            <option value="title-asc">Title (A to Z)</option>
            <option value="createdAt-desc">Newest first</option>
          </SelectInput>
        </div>
      </Card>

      {/* Empty states: no tasks at all, or no tasks that match the filters. */}
      {tasks.length === 0 && (
        <EmptyState title="No tasks yet" description="Create your first task to get started." action={<Link to="/tasks/new"><Button>Create a task</Button></Link>} />
      )}
      {tasks.length > 0 && filteredCount === 0 && (
        <EmptyState title="No tasks match your search" description="Try a different word or clear the filters." action={<Button variant="secondary" onClick={resetQuery}>Clear filters</Button>} />
      )}

      {/* The rows. Each row is a link to the task details page. */}
      {visibleTasks.length > 0 && (
        <ul className="flex flex-col gap-2">
          {visibleTasks.map((task) => (
            <li key={task.id}>
              <Link to={`/tasks/${task.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-brand">
                <div className="min-w-0 flex-1 basis-60">
                  <p className="truncate text-sm font-bold text-gray-900">{task.title}</p>
                  <p className={`mt-1 text-xs font-medium ${isOverdue(task.dueDate, task.status) ? "text-red-600" : "text-gray-500"}`}>
                    Due {formatDate(task.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                  <Avatar name={task.assignee} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => updateQuery({ page })} />
    </div>
  );
}
