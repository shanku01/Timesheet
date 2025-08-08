import React, { useState } from 'react';

interface TaskProps {
  task: any;
  onSubmit: (taskId: string, hours: number) => void;
  selectedDate: string;
}

const TaskWithTimesheet: React.FC<TaskProps> = ({ task, onSubmit }) => {
  const [hours, setHours] = useState<number>(0);

  const handleSubmit = () => {
    if (!hours || hours <= 0) return alert('Please enter valid hours');
    onSubmit(task._id, hours);
  };

  return (
    <div className="border p-4 rounded shadow-sm flex items-center justify-between">
      <div>
        <h2 className="font-bold">{task.title}</h2>
        <p>Description: {task.description}</p>
        <p>Estimated time: {task.timeSpent}</p>
        <p>Due: {new Date(task.date).toLocaleDateString()}</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TaskWithTimesheet;
