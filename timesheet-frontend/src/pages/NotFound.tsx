// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="mb-6">Page not found</p>
      <Link to="/" className="text-blue-600 underline">
        Go to Login
      </Link>
    </div>
  );
};

export default NotFound;
