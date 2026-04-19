import { useEffect, useState } from "react";
import type { Route } from "../index/+types/index";
import CompletedTasks from "./partials/completed-tasks";
import UncompletedTasks from "./partials/uncompleted-tasks";
import type { Task } from "~/interfaces/task.interface";
import {
  getCompletedTasks,
  getUncompletedTasks,
} from "~/services/tasks.service";
import type { User } from "~/interfaces/user.interface";
import { getUsersWithTasks } from "~/services/users.service";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import {
  FilteredDataProvider,
  UncompletedTasksSortBy,
  useFilteredData,
} from "./helpers/filtered-data-provider";

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

function Index() {
  const {
    completedTasks,
    uncompletedTasks,
    setCompletedTasks,
    setUncompletedTasks,
    setUsers,
  } = useFilteredData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [completedResult, uncompletedResult, usersResult] =
          await Promise.allSettled([
            getCompletedTasks(),
            getUncompletedTasks(),
            getUsersWithTasks(),
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

        if (usersResult.status === "fulfilled") {
          setUsers(usersResult.value);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (err) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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

  const uncompleteTask = (taskId: number) => {
    setCompletedTasks((prev) => prev.filter((task) => task.id !== taskId));
    const uncompletedTask = completedTasks.find((task) => task.id === taskId);
    if (uncompletedTask) {
      setUncompletedTasks((prev) => [
        ...prev,
        {
          ...uncompletedTask,
          completed: false,
          completedAt: undefined,
        },
      ]);
    }
  };

  return (
    <div className="relative w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-3 sm:gap-4 mt-4 sm:mt-4">
      <UncompletedTasks
        loading={loading}
        error={error}
        completeTask={completeTask}
      />
      <CompletedTasks
        loading={loading}
        error={error}
        uncompleteTask={uncompleteTask}
      />
    </div>
  );
}

export default function IndexWrapper() {
  return (
    <FilteredDataProvider>
      <Index />
    </FilteredDataProvider>
  );
}
