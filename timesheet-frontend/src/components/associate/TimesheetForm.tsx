// src/components/associate/TimesheetForm.tsx
import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
}

interface Props {
  tasks: Task[];
  onSubmit: () => void;
  isSubmitted: boolean;
  selectedDate: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const TimesheetForm: React.FC<Props> = ({ tasks, onSubmit, isSubmitted, selectedDate }) => {
  const [entries, setEntries] = useState<{ [taskId: number]: number }>({});
  const [totalHours, setTotalHours] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [submittedData, setSubmittedData] = useState<{ taskId: number; hours: number }[]>([]);

  useEffect(() => {
    setEntries({});
    setTotalHours(0);
    setError(null);
    setSubmittedData([]);
  }, [selectedDate]);

  useEffect(() => {
    const total = Object.values(entries).reduce((sum, hours) => sum + (hours || 0), 0);
    setTotalHours(total);
  }, [entries]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (taskId: number, value: string) => {
    const hours = parseFloat(value);
    if (isNaN(hours) || hours < 0 || hours > 24) return;
    setEntries((prev) => ({ ...prev, [taskId]: hours }));
  };

  const validate = () => {
    if (Object.keys(entries).length === 0) {
      setError('Please fill hours for at least one task.');
      return false;
    }

    const hasNonZero = Object.values(entries).some((val) => val > 0);
    if (!hasNonZero) {
      setError('Enter more than 0 hours for at least one task.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = Object.entries(entries).map(([taskId, hours]) => ({
      taskId: Number(taskId),
      hours,
      date: selectedDate,
    }));

    try {
      const res = await fetch('/api/timesheet/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Timesheet submitted successfully!', 'success');
        setSubmittedData(payload.map(({ taskId, hours }) => ({ taskId, hours })));
        onSubmit();
      } else {
        showToast('Submission failed. Try again.', 'error');
      }
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  const getTaskTitle = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    return task ? task.title : 'Unknown Task';
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl relative">
      <h2 className="text-2xl font-semibold mb-4">Fill Timesheet for {selectedDate}</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {toast && (
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 mt-[-40px] px-4 py-2 rounded shadow-lg text-white transition-opacity duration-500 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-4">
            <label className="w-48">{task.title}</label>
            <input
              type="number"
              className="border px-2 py-1 rounded w-24"
              min={0}
              max={24}
              disabled={isSubmitted}
              value={entries[task.id] ?? ''}
              onChange={(e) => handleChange(task.id, e.target.value)}
            />
            <span>hrs</span>
          </div>
        ))}

        <div className="mt-4 text-lg font-medium">
          Total Hours: <span className="text-blue-600">{totalHours}</span>
        </div>

        <button
          type="button"
          disabled={isSubmitted}
          className={`mt-4 px-4 py-2 rounded text-white ${
            isSubmitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleSubmit}
        >
          {isSubmitted ? 'Timesheet Submitted' : 'Submit Timesheet'}
        </button>
      </form>

      {submittedData.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Submitted Preview</h3>
          <ul className="list-disc list-inside text-gray-700">
            {submittedData.map((item) => (
              <li key={item.taskId}>
                {getTaskTitle(item.taskId)} — <strong>{item.hours} hrs</strong>
              </li>
            ))}
          </ul>
          <div className="mt-2 font-semibold">Total: {totalHours} hrs</div>
        </div>
      )}
    </div>
  );
};

export default TimesheetForm;
