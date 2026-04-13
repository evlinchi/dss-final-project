import type { Task } from "~/interfaces/task.interface";

export default function CompletedTasks({
  tasks,
  loading,
  error,
}: {
  tasks: Task[];
  loading: boolean;
  error: string | null;
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
            </>
          ))}
        </ul>
      )}
    </div>
  );
}
