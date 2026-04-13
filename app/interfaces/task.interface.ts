export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  completedAt?: string; // Optional field to store completion timestamp
}
