import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import type { Task } from "~/interfaces/task.interface";
import type { ReactNode } from "react";
import TaskCard from "./task-card";

interface TaskPanelCardProps {
  title: string;
  loading: boolean;
  error: string | null;
  tasks: Task[];
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  actionIcon: ReactNode;
  onTaskAction: (taskId: number) => void;
  headerControls?: ReactNode;
  showCompletedAt?: boolean;
  noTasksMessage?: string;
}

const DEFAULT_PAGE_SIZES: [number, string][] = [
  [5, "5 per page"],
  [10, "10 per page"],
  [20, "20 per page"],
  [50, "50 per page"],
];

export default function TaskPanelCard({
  title,
  loading,
  error,
  tasks,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  actionIcon,
  onTaskAction,
  headerControls,
  showCompletedAt = false,
  noTasksMessage = "No tasks found.",
}: TaskPanelCardProps) {
  const renderPagination = () => {
    if (totalPages <= 1) {
      return <div className="w-full" />;
    }

    const buildPages = () => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages = [1];
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push(-1);
      }

      for (let page = start; page <= end; page += 1) {
        pages.push(page);
      }

      if (end < totalPages - 1) {
        pages.push(-1);
      }

      pages.push(totalPages);
      return pages;
    };

    return (
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {buildPages().map((page, index) =>
            page === -1 ? (
              <PaginationEllipsis key={`ellipsis-${index}`} />
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-secondary/95 shadow-lg sm:shadow-xl shadow-slate-950/5 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-b border-border/70 pb-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Tasks
          </p>
          <h2 className="text-lg sm:text-xl font-semibold leading-6">
            {title}
          </h2>
        </div>
        {headerControls ? (
          <div className="flex flex-wrap items-center gap-2">
            {headerControls}
          </div>
        ) : null}
      </div>

      <div className="relative flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 h-4 w-full bg-linear-180 from-secondary to-transparent" />

        {loading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {noTasksMessage}
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <ul className="space-y-2 sm:space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                actionIcon={actionIcon}
                onAction={onTaskAction}
                showCompletedAt={showCompletedAt}
              />
            ))}
          </ul>
        )}

        <div className="sticky bottom-0 z-10 h-4 w-full bg-linear-180 from-transparent to-secondary pointer-events-none" />
      </div>

      {!loading && !error && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/70 pt-3">
          <div className="w-full sm:w-auto sm:min-w-44">
            <Combobox
              items={DEFAULT_PAGE_SIZES}
              defaultValue={pageSize}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <ComboboxInput
                placeholder="Per page"
                value={`${pageSize}`}
                size={5}
              />
              <ComboboxContent align="start" side="top">
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
          </div>
          <div className="w-full sm:w-auto overflow-x-auto">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
}
