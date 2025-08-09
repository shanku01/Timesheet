import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskWithTimesheet from '../components/associate/TaskwithTimesheet';
import TimesheetSummary from '../components/associate/TimesheetSummary';

interface Task {
  _id: string;
  title: string;
  description?: string;
}

const AssociateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `/api/tasks/my?status=pending&date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const handleTimesheetSubmit = async (taskId: string, hours: number) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      await axios.post(
        "/api/timesheets",
        {
          taskId,
          actualHours: hours,
          date: today, 
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      window.location.reload();
      fetchTasks();
    } catch (err) {
      console.error("Error submitting timesheet", err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Associate Dashboard
        </h1>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="bg-yellow-500 text-white font-bold px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

    
      <div className="bg-white shadow rounded-lg p-4 mb-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition"
            >
              <TaskWithTimesheet
                task={task}
                onSubmit={handleTimesheetSubmit}
                selectedDate={selectedDate}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-white rounded-lg shadow border border-gray-200">
            <p className="text-gray-500">No pending tasks{selectedDate?" for "+selectedDate:""}.</p>
          </div>
        )}
      </div>

      
      <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-4">
        <TimesheetSummary selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default AssociateDashboard;
