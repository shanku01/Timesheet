// src/components/associate/TaskList.tsx
import React from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  estimatedHours: number;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) return <p>No tasks assigned.</p>;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Assigned Tasks</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm text-blue-600">Estimated: {task.estimatedHours} hrs</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
