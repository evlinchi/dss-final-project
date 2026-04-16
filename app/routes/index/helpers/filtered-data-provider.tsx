import React, { createContext, useContext, useEffect, useState } from "react";
import type { Task } from "~/interfaces/task.interface";
import type { User } from "~/interfaces/user.interface";

export enum UncompletedTasksSortBy {
  TITLE_ASC = "TITLE_ASC",
  TITLE_DESC = "TITLE_DESC",
}

export enum CompletedTasksSortBy {
  COMPLETED_AT_ASC = "COMPLETED_AT_ASC",
  COMPLETED_AT_DESC = "COMPLETED_AT_DESC",
}

const UNCOMPLETED_TASKS_SORT_BY_LABELS: Record<UncompletedTasksSortBy, string> =
  {
    [UncompletedTasksSortBy.TITLE_ASC]: "Title (A-Z)",
    [UncompletedTasksSortBy.TITLE_DESC]: "Title (Z-A)",
  };

const COMPLETED_TASKS_SORT_BY_LABELS: Record<CompletedTasksSortBy, string> = {
  [CompletedTasksSortBy.COMPLETED_AT_ASC]: "Completed At (Oldest First)",
  [CompletedTasksSortBy.COMPLETED_AT_DESC]: "Completed At (Newest First)",
};

interface FilteredDataProviderProps {
  completedTasks: Task[];
  uncompletedTasks: Task[];
  users: User[];

  setCompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setUncompletedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;

  filteredByUserId: number | null;
  setFilteredByUserId: (userId: number | null) => void;

  uncompletedTasksSortedBy: UncompletedTasksSortBy;
  setUncompletedTasksSortedBy: (sortBy: UncompletedTasksSortBy) => void;

  completedTasksSortedBy: CompletedTasksSortBy;
  setCompletedTasksSortedBy: (sortBy: CompletedTasksSortBy) => void;

  getUncompletedTasksSortByLabels: () => Record<UncompletedTasksSortBy, string>;
  getCompletedTasksSortByLabels: () => Record<CompletedTasksSortBy, string>;

  // Pagination for uncompleted tasks
  uncompletedTasksCurrentPage: number;
  setUncompletedTasksCurrentPage: (page: number) => void;
  uncompletedTasksPageSize: number;
  setUncompletedTasksPageSize: (size: number) => void;
  paginatedUncompletedTasks: Task[];
  uncompletedTasksTotalPages: number;

  // Pagination for completed tasks
  completedTasksCurrentPage: number;
  setCompletedTasksCurrentPage: (page: number) => void;
  completedTasksPageSize: number;
  setCompletedTasksPageSize: (size: number) => void;
  paginatedCompletedTasks: Task[];
  completedTasksTotalPages: number;
}

const FilteredDataContext = createContext<
  FilteredDataProviderProps | undefined
>(undefined);

const FilteredDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [uncompletedTasks, setUncompletedTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [initialCompletedTasks, setInitialCompletedTasks] = useState<Task[]>(
    [],
  );
  const [initialUncompletedTasks, setInitialUncompletedTasks] = useState<
    Task[]
  >([]);

  const [filteredByUserId, setFilteredByUserId] = useState<number | null>(null);
  const [uncompletedTasksSortedBy, setUncompletedTasksSortedBy] =
    useState<UncompletedTasksSortBy>(UncompletedTasksSortBy.TITLE_ASC);
  const [completedTasksSortedBy, setCompletedTasksSortedBy] =
    useState<CompletedTasksSortBy>(CompletedTasksSortBy.COMPLETED_AT_DESC);

  // Pagination states
  const [uncompletedTasksCurrentPage, setUncompletedTasksCurrentPage] =
    useState(1);
  const [uncompletedTasksPageSize, setUncompletedTasksPageSize] = useState(10);
  const [completedTasksCurrentPage, setCompletedTasksCurrentPage] = useState(1);
  const [completedTasksPageSize, setCompletedTasksPageSize] = useState(10);

  // Paginated results
  const [paginatedUncompletedTasks, setPaginatedUncompletedTasks] = useState<
    Task[]
  >([]);
  const [paginatedCompletedTasks, setPaginatedCompletedTasks] = useState<
    Task[]
  >([]);

  const setCompletedTasksCustom: React.Dispatch<
    React.SetStateAction<Task[]>
  > = (action) => {
    setCompletedTasks(action);
    const newTasks =
      typeof action === "function" ? action(initialCompletedTasks) : action;
    setInitialCompletedTasks(newTasks);
  };

  const setUncompletedTasksCustom: React.Dispatch<
    React.SetStateAction<Task[]>
  > = (action) => {
    setUncompletedTasks(action);
    const newTasks =
      typeof action === "function" ? action(initialUncompletedTasks) : action;
    setInitialUncompletedTasks(newTasks);
  };

  useEffect(() => {
    let filteredCompleted = [...initialCompletedTasks];
    let filteredUncompleted = [...initialUncompletedTasks];

    if (filteredByUserId !== null) {
      filteredCompleted = filteredCompleted.filter(
        (task) => task.userId === filteredByUserId,
      );
      filteredUncompleted = filteredUncompleted.filter(
        (task) => task.userId === filteredByUserId,
      );
    }

    // Apply sorting for completed tasks
    switch (completedTasksSortedBy) {
      case CompletedTasksSortBy.COMPLETED_AT_ASC:
        filteredCompleted.sort((a, b) => {
          if (!a.completedAt && !b.completedAt) return 0;
          if (!a.completedAt) return 1;
          if (!b.completedAt) return -1;
          return (
            new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime()
          );
        });
        break;
      case CompletedTasksSortBy.COMPLETED_AT_DESC:
        filteredCompleted.sort((a, b) => {
          if (!a.completedAt && !b.completedAt) return 0;
          if (!a.completedAt) return 1;
          if (!b.completedAt) return -1;
          return (
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
          );
        });
        break;
    }

    // Apply sorting for uncompleted tasks
    switch (uncompletedTasksSortedBy) {
      case UncompletedTasksSortBy.TITLE_ASC:
        filteredUncompleted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case UncompletedTasksSortBy.TITLE_DESC:
        filteredUncompleted.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setCompletedTasks(filteredCompleted);
    setUncompletedTasks(filteredUncompleted);

    // Reset pages when filters or sorting change
    setUncompletedTasksCurrentPage(1);
    setCompletedTasksCurrentPage(1);
  }, [
    filteredByUserId,
    uncompletedTasksSortedBy,
    completedTasksSortedBy,
    initialCompletedTasks,
    initialUncompletedTasks,
  ]);

  // Pagination effect
  useEffect(() => {
    const startUncompleted =
      (uncompletedTasksCurrentPage - 1) * uncompletedTasksPageSize;
    const endUncompleted = startUncompleted + uncompletedTasksPageSize;
    setPaginatedUncompletedTasks(
      uncompletedTasks.slice(startUncompleted, endUncompleted),
    );
  }, [uncompletedTasks, uncompletedTasksCurrentPage, uncompletedTasksPageSize]);

  useEffect(() => {
    const startCompleted =
      (completedTasksCurrentPage - 1) * completedTasksPageSize;
    const endCompleted = startCompleted + completedTasksPageSize;
    setPaginatedCompletedTasks(
      completedTasks.slice(startCompleted, endCompleted),
    );
  }, [completedTasks, completedTasksCurrentPage, completedTasksPageSize]);

  const uncompletedTasksTotalPages = Math.max(
    1,
    Math.ceil(uncompletedTasks.length / uncompletedTasksPageSize),
  );
  const completedTasksTotalPages = Math.max(
    1,
    Math.ceil(completedTasks.length / completedTasksPageSize),
  );

  useEffect(() => {
    if (uncompletedTasksCurrentPage > uncompletedTasksTotalPages) {
      setUncompletedTasksCurrentPage(Math.max(1, uncompletedTasksTotalPages));
    }
  }, [uncompletedTasksTotalPages, uncompletedTasksCurrentPage]);

  useEffect(() => {
    if (completedTasksCurrentPage > completedTasksTotalPages) {
      setCompletedTasksCurrentPage(Math.max(1, completedTasksTotalPages));
    }
  }, [completedTasksTotalPages, completedTasksCurrentPage]);

  const getUncompletedTasksSortByLabels = () => {
    return UNCOMPLETED_TASKS_SORT_BY_LABELS;
  };

  const getCompletedTasksSortByLabels = () => {
    return COMPLETED_TASKS_SORT_BY_LABELS;
  };

  return (
    <FilteredDataContext.Provider
      value={{
        completedTasks,
        uncompletedTasks,
        users,
        setCompletedTasks: setCompletedTasksCustom,
        setUncompletedTasks: setUncompletedTasksCustom,
        setUsers,
        filteredByUserId,
        setFilteredByUserId,
        uncompletedTasksSortedBy,
        setUncompletedTasksSortedBy,
        completedTasksSortedBy,
        setCompletedTasksSortedBy,
        getUncompletedTasksSortByLabels,
        getCompletedTasksSortByLabels,
        uncompletedTasksCurrentPage,
        setUncompletedTasksCurrentPage,
        uncompletedTasksPageSize,
        setUncompletedTasksPageSize,
        paginatedUncompletedTasks,
        uncompletedTasksTotalPages,
        completedTasksCurrentPage,
        setCompletedTasksCurrentPage,
        completedTasksPageSize,
        setCompletedTasksPageSize,
        paginatedCompletedTasks,
        completedTasksTotalPages,
      }}
    >
      {children}
    </FilteredDataContext.Provider>
  );
};

export function useFilteredData() {
  const context = useContext(FilteredDataContext);
  if (!context) {
    throw new Error(
      "useFilteredData must be used within a FilteredDataProvider",
    );
  }
  return context;
}

export { FilteredDataContext, FilteredDataProvider };
