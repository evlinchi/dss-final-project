import type { Task } from "~/interfaces/task.interface";
import * as request from "../lib/request";

export async function getUncompletedTasks(): Promise<Task[]> {
  const result = await request.get<Task[]>(
    "https://jsonplaceholder.typicode.com/todos?completed=false",
  );

  return result;
}

export async function getCompletedTasks(): Promise<Task[]> {
  const result = await request.get<Task[]>(
    "https://jsonplaceholder.typicode.com/todos?completed=true",
  );

  return result;
}
