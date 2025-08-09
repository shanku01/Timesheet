import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  timeSpent: yup
    .number()
    .typeError('Estimated Hours must be a number')
    .positive('Must be positive')
    .required('Estimated Hours is required'),
  assignedTo: yup.string().required('Assigned To is required'),
  date: yup.string().required('Date is required'),
});

const TaskForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { user } = useAuth();

  const [users, setUsers] = useState<{ _id: string; email: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.token) {
        setLoadingUsers(false);
        return;
      }
      setLoadingUsers(true);
      try {
        const res = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user?.token]);


  const createTask = async (task: any) => {
    if (!user?.token) throw new Error('User not authenticated');

    const response = await axios.post('/api/tasks', task, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  };

  const onSubmit = async (data: any) => {
    try {
      await createTask({
        ...data,
        timeSpent: parseFloat(data.timeSpent),
      });
      toast.success('✅ Task assigned successfully!');
      reset();
    } catch {
      toast.error('❌ Error assigning task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow space-y-4 mb-4">
      <h2 className="text-xl font-semibold">Assign New Task</h2>

      <div>
        <input
          {...register('title')}
          placeholder="Task Title"
          className="w-full p-2 border rounded"
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <input
          {...register('description')}
          placeholder="Task Description"
          className="w-full p-2 border rounded"
        />
        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <input
          {...register('timeSpent')}
          placeholder="Estimated Hours"
          className="w-full p-2 border rounded"
          type="number"
          step="0.1"
        />
        {errors.timeSpent && (
          <p className="text-red-600 text-sm">{errors.timeSpent.message}</p>
        )}
      </div>

      <div>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <select
            {...register('assignedTo')}
            className="w-full p-2 border rounded bg-white"
            defaultValue=""
          >
            <option value="" disabled>
              Select user to assign
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        )}
        {errors.assignedTo && (
          <p className="text-red-600 text-sm">{errors.assignedTo.message}</p>
        )}
      </div>

      <div>
        <input {...register('date')} type="date" className="w-full p-2 border rounded" />
        {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || loadingUsers}
        className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
          isSubmitting || loadingUsers ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Assigning...' : 'Assign Task'}
      </button>
    </form>
  );
};

export default TaskForm;
