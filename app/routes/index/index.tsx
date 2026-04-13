import { useEffect, useState } from "react";
import type { Route } from "../index/+types/index";
import CompletedTasks from "./partials/completed-tasks";
import UncompletedTasks from "./partials/uncompleted-tasks";
import type { Task } from "~/interfaces/task.interface";
import {
  getCompletedTasks,
  getUncompletedTasks,
} from "~/services/tasks.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Taskly" },
    {
      name: "description",
      content:
        "A sleek and intuitive todo app built with React Router, designed to help you organize tasks, track progress, and boost productivity with a clean, user-friendly interface.",
    },
  ];
}

export default function Index() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [uncompletedTasks, setUncompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const [completedResult, uncompletedResult] = await Promise.allSettled([
          getCompletedTasks(),
          getUncompletedTasks(),
        ]);

        if (completedResult.status === "fulfilled") {
          setCompletedTasks(completedResult.value);
        } else {
          setError("Failed to fetch completed tasks.");
        }

        if (uncompletedResult.status === "fulfilled") {
          setUncompletedTasks(uncompletedResult.value);
        } else {
          setError("Failed to fetch uncompleted tasks.");
        }
      } catch (err) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completeTask = (taskId: number) => {
    setUncompletedTasks((prev) => prev.filter((task) => task.id !== taskId));
    const completedTask = uncompletedTasks.find((task) => task.id === taskId);
    if (completedTask) {
      setCompletedTasks((prev) => [
        ...prev,
        {
          ...completedTask,
          completed: true,
          completedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="relative w-full h-full flex gap-5 p-5">
      <UncompletedTasks
        tasks={uncompletedTasks}
        loading={loading}
        error={error}
        completeTask={completeTask}
      />
      <CompletedTasks tasks={completedTasks} loading={loading} error={error} />
    </div>
  );
}
