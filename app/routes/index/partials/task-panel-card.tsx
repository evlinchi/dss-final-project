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
import { AlertCircle, Inbox } from "lucide-react";
import TaskCard from "./task-card";

interface TaskPanelCardProps {
  title: string;
  loading: boolean;
  error: string | null;
  tasks: Task[];
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
  onPageChange,
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
    <div className="glass relative flex-1 min-h-0 overflow-hidden rounded-2xl sm:rounded-3xl shadow-[var(--shadow-md)] p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-b border-border/60 pb-3">
        <div className="space-y-1">
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

      <div className="relative flex-1 overflow-y-auto overflow-x-visible">
        <div className="pointer-events-none sticky top-0 z-10 h-4 w-full bg-gradient-to-b from-[var(--card)] to-transparent" />

        {loading && <SkeletonList count={5} />}

        {error && (
          <div className="alert-destructive rounded-xl p-4 text-sm flex items-start gap-3">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <EmptyState message={noTasksMessage} />
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

        <div className="pointer-events-none sticky bottom-0 z-10 h-4 w-full bg-gradient-to-t from-[var(--card)] to-transparent" />
      </div>

      {!loading && !error && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 border-t border-border/60 pt-3">
          <div className="w-full sm:w-auto overflow-x-auto">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonList({ count }: { count: number }) {
  return (
    <ul className="space-y-2 sm:space-y-3" aria-label="Loading tasks" aria-busy>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-border/50 bg-muted/40 animate-pulse"
        />
      ))}
    </ul>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">All clear</p>
        <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      </div>
    </div>
  );
}
