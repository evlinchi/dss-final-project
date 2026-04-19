import { Button } from "~/components/ui/button";
import type { Task } from "~/interfaces/task.interface";
import type { ReactNode } from "react";
//@ts-expect-error - ne e za react ppc
import confetti from "canvas-confetti";
import { useTheme } from "~/lib/use-theme";
import { getThemeMeta } from "~/lib/theme-meta";
import { cn } from "~/lib/utils";

interface TaskCardProps {
  task: Task;
  actionIcon: ReactNode;
  onAction: (taskId: number) => void;
  showCompletedAt?: boolean;
}

export default function TaskCard({
  task,
  actionIcon,
  onAction,
  showCompletedAt = false,
}: TaskCardProps) {
  const { theme } = useTheme();

  const completeTaskAnimation = () => {
    const duration = 1000;
    const colors = getThemeMeta(theme).confettiColors;
    let lastBurst = 0;

    const burstInterval = 40;
    const start = performance.now();
    const end = start + duration;

    const frame = (now: number) => {
      if (now >= end) return;

      if (now - lastBurst >= burstInterval) {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors,
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors,
        });

        lastBurst = now;
      }

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  return (
    <li
      className={cn(
        "group glass rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer",
        "transition-[transform,box-shadow,background-color] duration-200",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
        task.completed && "opacity-90",
      )}
      onClick={() => {
        onAction(task.id);
        if (!task.completed) completeTaskAnimation();
      }}
    >
      <div
        className={cn(
          "relative flex gap-2 sm:gap-3",
          !showCompletedAt || !task.completedAt
            ? "flex-col items-center justify-center min-h-16 sm:flex-row sm:items-center sm:justify-between sm:min-h-auto"
            : "flex-col sm:flex-row sm:items-start sm:justify-between",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            !showCompletedAt || !task.completedAt
              ? "items-center justify-center text-center sm:items-start sm:justify-center sm:text-left"
              : "items-start justify-start",
          )}
        >
          <p
            className={cn(
              "w-full overflow-hidden text-sm font-medium line-clamp-3 text-foreground sm:text-base",
              task.completed &&
                "text-muted-foreground line-through decoration-muted-foreground/60",
            )}
          >
            {task.title}
          </p>

          {showCompletedAt && task.completedAt ? (
            <p className="text-xs text-muted-foreground">
              {new Date(task.completedAt).toLocaleDateString()}
            </p>
          ) : null}
        </div>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            "shrink-0 self-center transition-colors sm:self-auto",
            !task.completed
              ? "group-hover:border-[color:var(--task-complete)] group-hover:text-[color:var(--task-complete)] hover:border-[color:var(--task-complete)] hover:text-[color:var(--task-complete)]"
              : "group-hover:border-destructive group-hover:text-destructive hover:border-destructive hover:text-destructive",
          )}
          aria-label={
            task.completed ? "Mark as not completed" : "Mark as completed"
          }
        >
          {actionIcon}
        </Button>
      </div>
    </li>
  );
}
