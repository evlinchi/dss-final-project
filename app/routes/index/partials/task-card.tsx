import { Button } from "~/components/ui/button";
import type { Task } from "~/interfaces/task.interface";
import type { ReactNode } from "react";
import confetti from "canvas-confetti";

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
  const completeTaskAnimation = () => {
    const end = Date.now() + 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };
    frame();
  };

  return (
    <li
      className="group rounded-xl sm:rounded-2xl border border-border/70 bg-background/80 p-3 sm:p-4 shadow-sm transition hover:shadow-lg cursor-pointer"
      onClick={() => {
        onAction(task.id);

        if (!task.completed) {
          completeTaskAnimation();
        }
      }}
    >
      <div
        className={`relative flex gap-2 sm:gap-3 ${!showCompletedAt || !task.completedAt ? "flex-col items-center justify-center min-h-16 sm:flex-row sm:items-start sm:justify-between sm:min-h-auto" : "flex-col sm:flex-row sm:items-start sm:justify-between"}`}
      >
        <div
          className={`flex flex-col ${!showCompletedAt || !task.completedAt ? "text-center sm:text-left" : "items-start justify-start"}`}
        >
          <p className="text-sm sm:text-base font-medium text-foreground overflow-hidden line-clamp-3">
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
          className={`shrink-0 ${!showCompletedAt || !task.completedAt ? "self-center sm:self-auto" : ""} ${
            !task.completed
              ? "group-hover:border-green-500 group-hover:text-green-500 hover:text-green-500"
              : "group-hover:border-red-500 group-hover:text-red-500 hover:text-red-500"
          }`}
        >
          {actionIcon}
        </Button>
      </div>
    </li>
  );
}
