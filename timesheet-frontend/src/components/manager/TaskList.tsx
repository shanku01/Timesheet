import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface User {
  _id: string;
  email: string;
  name: string;
}

interface Task {
  _id?: string;
  title?: string;
  description: string;
  timeSpent: number;
  assignedTo:  User;
  date: string;
}

const TaskList = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllTasks = async () => {
    if (!user?.token) return [];
    const response = await axios.get(`/api/tasks`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log('Fetched tasks:', response.data);
    return response.data;
  };

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllTasks();
        setTasks(data);
      } catch {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [user?.token]);

  // Memoize filtered tasks, recompute only when searchTerm or tasks changes
  const filteredTasks = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return tasks;

    return tasks.filter((task) => {
      const combinedFields = `
        ${task.title || ''}
        ${task.description}
        ${task.timeSpent}
        ${task.assignedTo.email || ''}
        ${new Date(task.date).toLocaleDateString()}
      `.toLowerCase();

      return combinedFields.includes(search);
    });
  }, [searchTerm, tasks]);

  console.log('Filtered Tasks:', filteredTasks);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
    <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Assigned Tasks</h2>

    <input
      type="text"
      placeholder="Search tasks by any field..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="mb-6 px-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />

    {loading ? (
      <p className="text-gray-600 text-center">Loading tasks...</p>
    ) : error ? (
      <p className="text-red-600 text-center font-medium">{error}</p>
    ) : filteredTasks.length === 0 ? (
      <p className="text-gray-600 text-center">No tasks found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300">Title</th>
              <th className="py-3 px-4 border-b border-gray-300">Description</th>
              <th className="py-3 px-4 border-b border-gray-300">Estimated Hours</th>
              <th className="py-3 px-4 border-b border-gray-300">Assigned To Email</th>
              <th className="py-3 px-4 border-b border-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr
                key={task._id}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="py-3 px-4 border-b border-gray-200">{task.title || '-'}</td>
                <td className="py-3 px-4 border-b border-gray-200">{task.description}</td>
                <td className="py-3 px-4 border-b border-gray-200">{task.timeSpent} hrs</td>
                <td className="py-3 px-4 border-b border-gray-200">{task.assignedTo.email}</td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {new Date(task.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    </div>
  );
};

export default TaskList;
