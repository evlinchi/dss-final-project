import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import { RotateCcwIcon } from "lucide-react";
import TaskPanelCard from "./task-panel-card";
import {
  CompletedTasksSortBy,
  useFilteredData,
} from "../helpers/filtered-data-provider";

export default function CompletedTasks({
  loading,
  error,
  uncompleteTask,
}: {
  loading: boolean;
  error: string | null;
  uncompleteTask: (taskId: number) => void;
}) {
  const {
    completedTasksSortedBy,
    setCompletedTasksSortedBy,
    getCompletedTasksSortByLabels,
    paginatedCompletedTasks,
    completedTasksCurrentPage,
    setCompletedTasksCurrentPage,
    completedTasksTotalPages,
  } = useFilteredData();

  const headerControls = (
    <Combobox
      items={Object.entries(getCompletedTasksSortByLabels())}
      defaultValue={completedTasksSortedBy}
      onValueChange={(value) =>
        setCompletedTasksSortedBy(value as CompletedTasksSortBy)
      }
    >
      <ComboboxInput
        placeholder="Sort by date"
        value={getCompletedTasksSortByLabels()[completedTasksSortedBy]}
        size={10}
        labelBackgroundClassName="bg-card"
      />
      <ComboboxContent align="start">
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
  );

  return (
    <TaskPanelCard
      title="Completed Tasks"
      loading={loading}
      error={error}
      tasks={paginatedCompletedTasks}
      actionIcon={<RotateCcwIcon className="size-4" />}
      onTaskAction={uncompleteTask}
      showCompletedAt
      currentPage={completedTasksCurrentPage}
      onPageChange={setCompletedTasksCurrentPage}
      totalPages={completedTasksTotalPages}
      headerControls={headerControls}
      noTasksMessage="There are no completed tasks yet."
    />
  );
}
