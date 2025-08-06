// src/context/AuthContext.tsx
import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
type Role = 'manager' | 'associate';

interface AuthContextType {
  user: { email: string; role: Role } | null;
  login: (userData: { email: string; role: Role }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string; role: Role } | null>(null);

  const login = (userData: { email: string; role: Role }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
