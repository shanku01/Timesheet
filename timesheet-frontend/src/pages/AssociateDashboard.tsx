// src/pages/AssociateDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/associate/TaskList';
import TimesheetForm from '../components/associate/TimesheetForm';
import TimesheetSummary from '../components/associate/TimesheetSummary';

interface Task {
  id: number;
  title: string;
  description: string;
  estimatedHours: number;
}

const AssociateDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refreshSummary, setRefreshSummary] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      // Replace this filter with a real one if tasks include date fields
      setFilteredTasks(tasks); // for now, all tasks are shown
    } else {
      setFilteredTasks(tasks);
    }
  }, [selectedDate, tasks]);

  const handleTimesheetSubmit = () => {
    setIsSubmitted(true); // lock the form
    setRefreshSummary((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Associate Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium mb-1">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <TaskList tasks={filteredTasks} />
      <TimesheetForm
        tasks={filteredTasks}
        onSubmit={handleTimesheetSubmit}
        isSubmitted={isSubmitted}
        selectedDate={selectedDate}
      />
      {refreshSummary ? (
            <TimesheetSummary key="1" selectedDate={selectedDate} />
            ) : (
            <TimesheetSummary key="2" selectedDate={selectedDate} />
            )}
    </div>
  );
};

export default AssociateDashboard;
