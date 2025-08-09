import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { JSX } from 'react';

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: JSX.Element;
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  if (!allowedRoles.includes(user.user.role)) return <Navigate to="*" />;

  return children;
};

export default ProtectedRoute;
