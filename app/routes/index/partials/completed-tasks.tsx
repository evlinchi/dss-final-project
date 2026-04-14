import { Button } from "~/components/ui/button";
import type { Task } from "~/interfaces/task.interface";

export default function CompletedTasks({
  tasks,
  loading,
  error,
  uncompleteTask,
}: {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  uncompleteTask: (taskId: number) => void;
}) {
  return (
    <div className="relative w-full h-full bg-green-500">
      <h1>Completed Tasks</h1>
      {loading && "Loading..."}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <ul>
          {tasks.map((task) => (
            <>
              <li key={task.id}>{task.title}</li>
              {task.completedAt && (
                <li>{new Date(task.completedAt).toLocaleDateString()}</li>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => uncompleteTask(task.id)}
              >
                Mark as Uncompleted
              </Button>
            </>
          ))}
        </ul>
      )}
    </div>
  );
}
