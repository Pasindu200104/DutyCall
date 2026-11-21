// Import the React tools and our service functions.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import * as taskService from "../services/taskService";
import type { Task, TaskInput, TaskStatus } from "../types/task";

// Everything the rest of the app can read or do with tasks.
interface TaskContextValue {
  tasks: Task[];
  isLoading: boolean;
  errorMessage: string;
  reloadTasks: () => Promise<void>;
  createTask: (input: TaskInput) => Promise<Task>;
  updateTask: (taskId: number, changes: Partial<TaskInput>) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  changeTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
}

// Create the shared box that holds the task data.
const TaskContext = createContext<TaskContextValue | null>(null);

// The provider loads the tasks once and keeps them in one place (the single source of truth).
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Load all tasks from the API and record any error so the UI can show it.
  const reloadTasks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const loadedTasks = await taskService.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load the tasks the first time the app opens.
  useEffect(() => {
    reloadTasks();
  }, [reloadTasks]);

  // Create a task on the server, then add it to the list on screen.
  async function createTask(input: TaskInput): Promise<Task> {
    const newTask = await taskService.createTask(input);
    setTasks((currentTasks) => [...currentTasks, newTask]);
    return newTask;
  }

  // Update a task on the server, then replace it in the list on screen.
  async function updateTask(taskId: number, changes: Partial<TaskInput>): Promise<Task> {
    const updatedTask = await taskService.updateTask(taskId, changes);
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    return updatedTask;
  }

  // Delete a task on the server, then remove it from the list on screen.
  async function deleteTask(taskId: number): Promise<void> {
    await taskService.deleteTask(taskId);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  // Move a task to a new status. The screen updates straight away (optimistic update),
  // and if the server fails we put the old status back and pass the error on.
  async function changeTaskStatus(taskId: number, status: TaskStatus): Promise<void> {
    const previousTask = tasks.find((task) => task.id === taskId);
    if (!previousTask || previousTask.status === status) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task))
    );

    try {
      await taskService.updateTask(taskId, { status });
    } catch (error) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? previousTask : task))
      );
      throw error;
    }
  }

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, errorMessage, reloadTasks, createTask, updateTask, deleteTask, changeTaskStatus }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// A small helper hook so components can write useTasks() to get the task data.
export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }
  return context;
}
