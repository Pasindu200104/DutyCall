// Import the router helper, task data, the form and other components.
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useToast } from "../context/ToastContext";
import type { TaskInput } from "../types/task";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import TaskForm from "../components/tasks/TaskForm";

// The starting values of an empty form.
const EMPTY_TASK: TaskInput = {
  title: "",
  description: "",
  status: "todo",
  priority: "normal",
  assignee: "",
  dueDate: "",
};

// The page at /tasks/new where a new task is created.
export default function CreateTaskPage() {
  const { createTask } = useTasks();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Save the task, show a success message and open the new task.
  async function handleSubmit(values: TaskInput) {
    const newTask = await createTask(values);
    showToast("Task created.");
    navigate(`/tasks/${newTask.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New task" subtitle="Fill in the details and save." />
      <Card>
        <TaskForm initialValues={EMPTY_TASK} isNewTask submitLabel="Create task" cancelPath="/tasks" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
