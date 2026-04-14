import { type FetchedUser, type User } from "~/interfaces/user.interface";
import * as request from "../lib/request";
import * as tasksService from "./tasks.service";

export const getUsersByIds = async (userIds: number[]): Promise<User[]> => {
  const filteredIds = userIds.map((id) => `id=${id}`).join("&");

  const result = await request.get<FetchedUser[]>(
    `https://jsonplaceholder.typicode.com/users?${filteredIds}`,
  );

  const users: User[] = result.map((user: FetchedUser) => ({
    id: user.id,
    username: user.username,
  }));

  return users;
};

export async function getUsersWithTasks(): Promise<User[]> {
  const result = await tasksService.getTasks();

  const userIds = [...new Set(result.map((task) => task.userId))];

  return getUsersByIds(userIds);
}
