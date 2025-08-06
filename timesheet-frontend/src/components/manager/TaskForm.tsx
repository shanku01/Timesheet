// src/components/manager/TaskForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createTask } from '../../services/taskService';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Dummy user list (Replace with actual API call if needed)
const USERS = [
  { email: 'alice@example.com' },
  { email: 'bob@example.com' },
  { email: 'charlie@example.com' },
];

const schema = yup.object().shape({
  description: yup.string().required('Description is required'),
  estimatedHours: yup
    .number()
    .typeError('Estimated Hours must be a number')
    .positive('Must be positive')
    .required('Estimated Hours is required'),
  assignedTo: yup.string().email('Invalid email').required('Assigned To is required'),
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

  const [users, setUsers] = useState<{ email: string }[]>([]);

  useEffect(() => {
    // Ideally, fetch from API
    setUsers(USERS);
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await createTask({
        ...data,
        estimatedHours: parseFloat(data.estimatedHours),
      });
      toast.success('✅ Task assigned successfully!');
      reset();
    } catch (err) {
      toast.error('❌ Error assigning task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow space-y-4 mb-4">
      <h2 className="text-xl font-semibold">Assign New Task</h2>

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
          {...register('estimatedHours')}
          placeholder="Estimated Hours"
          className="w-full p-2 border rounded"
          type="number"
        />
        {errors.estimatedHours && (
          <p className="text-red-600 text-sm">{errors.estimatedHours.message}</p>
        )}
      </div>

      <div>
        <select
          {...register('assignedTo')}
          className="w-full p-2 border rounded bg-white"
          defaultValue=""
        >
          <option value="" disabled>
            Select user to assign
          </option>
          {users.map((user) => (
            <option key={user.email} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
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
        disabled={isSubmitting}
        className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Assigning...' : 'Assign Task'}
      </button>
    </form>
  );
};

export default TaskForm;
