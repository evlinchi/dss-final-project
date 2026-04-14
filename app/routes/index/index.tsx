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
    users,
    setCompletedTasks,
    setUncompletedTasks,
    setUsers,
    filteredByUserId,
    setFilteredByUserId,
    uncompletedTasksSortedBy,
    setUncompletedTasksSortedBy,
    completedTasksSortedBy,
    setCompletedTasksSortedBy,
    getUncompletedTasksSortByLabels,
    getCompletedTasksSortByLabels,
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
    <div className="relative w-full h-full flex gap-5 p-5">
      <Combobox
        items={users.map((user) => [user.id, user.username])}
        onValueChange={(e) => setFilteredByUserId(e ? Number(e) : null)}
        value={filteredByUserId}
      >
        <ComboboxInput
          placeholder="Select user"
          size={10}
          value={
            users.find((user) => user.id === filteredByUserId)?.username || ""
          }
        />
        <ComboboxContent align="center">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {([key, label]) => (
              <ComboboxItem key={key} value={key}>
                {label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Combobox
        items={Object.entries(getUncompletedTasksSortByLabels())}
        defaultValue={uncompletedTasksSortedBy}
        onValueChange={(e) =>
          setUncompletedTasksSortedBy(e as UncompletedTasksSortBy)
        }
      >
        <ComboboxInput
          placeholder="Select sort order"
          value={getUncompletedTasksSortByLabels()[uncompletedTasksSortedBy]}
          size={10}
        />
        <ComboboxContent align="center">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {([key, label]) => (
              <ComboboxItem key={key} value={key}>
                {label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Combobox
        items={Object.entries(getCompletedTasksSortByLabels())}
        defaultValue={completedTasksSortedBy}
        onValueChange={(e) =>
          setCompletedTasksSortedBy(e as CompletedTasksSortBy)
        }
      >
        <ComboboxInput
          placeholder="Select sort order"
          value={getCompletedTasksSortByLabels()[completedTasksSortedBy]}
          size={10}
        />
        <ComboboxContent align="center">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {([key, label]) => (
              <ComboboxItem key={key} value={key}>
                {label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <UncompletedTasks
        tasks={uncompletedTasks}
        loading={loading}
        error={error}
        completeTask={completeTask}
      />
      <CompletedTasks
        tasks={completedTasks}
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
