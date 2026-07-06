// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// تعریف ساختار اطلاعات کاربر
export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

// تعریف ساختار Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (pi_user_id: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// تنظیم پایه Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (pi_user_id: string, username: string) => {
    try {
      const response = await api.post('/auth/pi-login', { pi_user_id, username });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
