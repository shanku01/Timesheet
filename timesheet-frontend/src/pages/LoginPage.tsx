// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await loginUser(email, password);
      login(user); // sets context
      if (user.user.role === 'manager') navigate('/manager/dashboard');
      else navigate('/associate/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
    <form 
      onSubmit={handleSubmit} 
      className="bg-white/80 backdrop-blur-md p-8 shadow-xl rounded-2xl w-full max-w-sm border border-blue-100"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        Welcome Back
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-sm text-center bg-red-50 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
      >
        Login
      </button>
    </form>
  </div>
  );
};

export default LoginPage;
