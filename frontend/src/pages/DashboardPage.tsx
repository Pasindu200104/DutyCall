// Import the router link, task data, helpers and components used on the dashboard.
import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../constants/taskOptions";
import { formatDate, isOverdue } from "../utils/dateHelpers";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";

// The home page: numbers and charts that give an overview of all tasks.
export default function DashboardPage() {
  const { tasks, isLoading, errorMessage, reloadTasks } = useTasks();

  // The three possible screens before the real content: loading, error and empty.
  if (isLoading) return <Spinner message="Loading your dashboard..." />;
  if (errorMessage) return <ErrorState message={errorMessage} onRetry={reloadTasks} />;
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task and it will show up here."
        action={<Link to="/tasks/new"><Button>Create a task</Button></Link>}
      />
    );
  }

  // Count the numbers shown in the stat cards.
  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const inProgressCount = tasks.filter((task) => task.status === "in_progress").length;
  const overdueCount = tasks.filter((task) => isOverdue(task.dueDate, task.status)).length;

  // The next tasks that are due (not completed), the closest due date first.
  const upcomingTasks = tasks
    .filter((task) => task.status !== "completed")
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A quick look at how your tasks are going." />

      {/* Four number cards. */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={tasks.length} accentClass="border-l-brand" />
        <StatCard label="In progress" value={inProgressCount} accentClass="border-l-blue-500" />
        <StatCard label="Completed" value={completedCount} accentClass="border-l-emerald-500" />
        <StatCard label="Overdue" value={overdueCount} accentClass="border-l-red-500" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Bars that show how many tasks are in each status. */}
        <Card>
          <h2 className="mb-4 text-base font-bold text-gray-900">Tasks by status</h2>
          <ul className="flex flex-col gap-3">
            {STATUS_OPTIONS.map((option) => {
              const count = tasks.filter((task) => task.status === option.value).length;
              const percent = Math.round((count / tasks.length) * 100);
              return (
                <li key={option.value}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{option.label}</span>
                    <span className="text-gray-500">{count} ({percent}%)</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${option.dotClass}`} style={{ width: `${percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Counts for each priority. */}
        <Card>
          <h2 className="mb-4 text-base font-bold text-gray-900">Open tasks by priority</h2>
          <ul className="grid grid-cols-2 gap-3">
            {PRIORITY_OPTIONS.map((option) => {
              const count = tasks.filter((task) => task.priority === option.value && task.status !== "completed").length;
              return (
                <li key={option.value} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-3">
                  <PriorityBadge priority={option.value} />
                  <span className="text-xl font-extrabold text-gray-900">{count}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* The next tasks that need attention. */}
      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Coming up next</h2>
          <Link to="/tasks" className="text-sm font-semibold text-brand hover:underline">View all tasks</Link>
        </div>
        <ul className="divide-y divide-gray-100">
          {upcomingTasks.map((task) => (
            <li key={task.id}>
              <Link to={`/tasks/${task.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-gray-50">
                <span className="text-sm font-semibold text-gray-900">{task.title}</span>
                <span className="flex items-center gap-2">
                  <StatusBadge status={task.status} />
                  <span className={`text-xs font-medium ${isOverdue(task.dueDate, task.status) ? "text-red-600" : "text-gray-500"}`}>
                    {formatDate(task.dueDate)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
