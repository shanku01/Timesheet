// src/types/task.d.ts
export interface Task {
  _id?: string;
  description: string;
  estimatedHours: number;
  assignedTo: string; // Associate's email or ID
  date: string;       // ISO format
}
