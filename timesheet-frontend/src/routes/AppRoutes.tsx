import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ManagerDashboard from '../pages/ManagerDashboard';
import AssociateDashboard from '../pages/AssociateDashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/associate/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <AssociateDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
