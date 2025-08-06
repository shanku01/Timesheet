// src/services/taskService.ts
import axios from 'axios';
import type { Task } from '../types/task';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const createTask = async (task: Task) => {
  const response = await axios.post(`${API_BASE}/tasks`, task);
  return response.data;
};

export const fetchAllTasks = async () => {
  const response = await axios.get(`${API_BASE}/tasks`);
  return response.data;
};
