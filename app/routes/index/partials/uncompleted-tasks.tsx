import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import { CheckCircle2Icon } from "lucide-react";
import TaskPanelCard from "./task-panel-card";
import {
  UncompletedTasksSortBy,
  useFilteredData,
} from "../helpers/filtered-data-provider";

export default function UncompletedTasks({
  loading,
  error,
  completeTask,
}: {
  loading: boolean;
  error: string | null;
  completeTask: (taskId: number) => void;
}) {
  const {
    users,
    filteredByUserId,
    setFilteredByUserId,
    uncompletedTasksSortedBy,
    setUncompletedTasksSortedBy,
    getUncompletedTasksSortByLabels,
    paginatedUncompletedTasks,
    uncompletedTasksCurrentPage,
    setUncompletedTasksCurrentPage,
    uncompletedTasksTotalPages,
  } = useFilteredData();

  const headerControls = (
    <>
      <Combobox
        items={users.map((user) => [user.id, user.username])}
        onValueChange={(value) =>
          setFilteredByUserId(value ? Number(value) : null)
        }
        value={filteredByUserId}
      >
        <ComboboxInput
          placeholder="Select user"
          size={14}
          value={
            users.find((user) => user.id === filteredByUserId)?.username || ""
          }
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
      <Combobox
        items={Object.entries(getUncompletedTasksSortByLabels())}
        defaultValue={uncompletedTasksSortedBy}
        onValueChange={(value) =>
          setUncompletedTasksSortedBy(value as UncompletedTasksSortBy)
        }
      >
        <ComboboxInput
          placeholder="Sort by title "
          value={getUncompletedTasksSortByLabels()[uncompletedTasksSortedBy]}
          size={9}
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
    </>
  );

  return (
    <TaskPanelCard
      title="Uncompleted Tasks"
      loading={loading}
      error={error}
      tasks={paginatedUncompletedTasks}
      actionIcon={<CheckCircle2Icon className="size-4" />}
      onTaskAction={completeTask}
      currentPage={uncompletedTasksCurrentPage}
      onPageChange={setUncompletedTasksCurrentPage}
      totalPages={uncompletedTasksTotalPages}
      headerControls={headerControls}
      noTasksMessage="No uncompleted tasks remaining."
    />
  );
}
