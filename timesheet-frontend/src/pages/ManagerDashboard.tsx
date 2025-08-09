import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/manager/TaskForm';
import TaskList from '../components/manager/TaskList';
import ErrorBoundary from '../components/manager/ErrorBoundary';
import TimesheetSummary from '../components/manager/TimesheetSummary';

const ManagerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <TaskForm />
      <ErrorBoundary>
        <TaskList />
        <TimesheetSummary />
      </ErrorBoundary>
    </div>
  );
};

export default ManagerDashboard;
