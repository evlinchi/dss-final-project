import { Button } from "~/components/ui/button";
import type { Task } from "~/interfaces/task.interface";

export default function UncompletedTasks({
  tasks,
  loading,
  error,
  completeTask,
}: {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  completeTask: (taskId: number) => void;
}) {
  return (
    <div className="relative w-full h-full bg-blue-500">
      <h1>Uncompleted Tasks</h1>
      {loading && "Loading..."}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <ul>
          {tasks.map((task) => (
            <>
              <li key={task.id}>{task.title}</li>
              <Button
                variant="outline"
                size="sm"
                onClick={() => completeTask(task.id)}
              >
                Mark as Completed
              </Button>
            </>
          ))}
        </ul>
      )}
    </div>
  );
}
