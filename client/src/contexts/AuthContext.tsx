import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Token'ı kontrol et ve kullanıcı bilgilerini getir
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }

    // Token yenileme zamanlayıcısı
    const refreshInterval = setInterval(() => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        refreshAccessToken(refreshToken);
      }
    }, 14 * 60 * 1000); // 14 dakikada bir token yenile

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get<User>('/auth/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await api.post<{ accessToken: string; refreshToken: string }>(
        '/auth/refresh-token',
        { refreshToken }
      );
      
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    setError(error instanceof Error ? error.message : 'Authentication failed');
  };

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
        '/auth/login',
        { username, password }
      );
      
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const register = async (name: string, username: string, password: string) => {
    try {
      setError(null);
      const response = await api.post<{ user: User; accessToken: string; refreshToken: string }>(
        '/auth/register',
        { name, username, password }
      );
      
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.put<User>('/auth/profile', data);
      setUser(response.data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const rolePermissions: { [key: string]: string[] } = {
      admin: ['create_post', 'edit_post', 'delete_post', 'manage_users', 'manage_categories'],
      moderator: ['create_post', 'edit_post', 'delete_post', 'manage_categories'],
      member: ['create_comment', 'edit_own_comment', 'delete_own_comment'],
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 