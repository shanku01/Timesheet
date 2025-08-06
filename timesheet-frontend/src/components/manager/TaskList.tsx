// src/components/manager/TaskList.tsx
import { useEffect, useState } from 'react';
import { fetchAllTasks } from '../../services/taskService';
import type { Task } from '../../types/task';

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchEmail, setSearchEmail] = useState<string>('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchAllTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.assignedTo.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>

      <input
        type="text"
        placeholder="Search by email..."
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full"
      />

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Description</th>
              <th>Estimated</th>
              <th>Assigned To</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="border-b text-sm">
                <td className="py-2">{task.description}</td>
                <td>{task.estimatedHours} hrs</td>
                <td>{task.assignedTo}</td>
                <td>{new Date(task.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
