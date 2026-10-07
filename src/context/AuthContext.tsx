import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);

    // Simulate network authentication request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || !password) {
      const err = 'Please enter both email and password.';
      setError(err);
      setIsLoading(false);
      return { success: false, message: err };
    }

    if (password.length < 6) {
      const err = 'Password must be at least 6 characters.';
      setError(err);
      setIsLoading(false);
      return { success: false, message: err };
    }

    // Success mock user
    const username = email.split('@')[0];
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);

    const loggedInUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: formattedName || 'Vadakaru Member',
      email: email.trim().toLowerCase(),
      role: 'Member',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=4f46e5&color=fff&size=128`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setUser(loggedInUser);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);

    // Simulate network registration request
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (!name.trim()) {
      const err = 'Please enter your full name.';
      setError(err);
      setIsLoading(false);
      return { success: false, message: err };
    }

    if (password.length < 6) {
      const err = 'Password must be at least 6 characters.';
      setError(err);
      setIsLoading(false);
      return { success: false, message: err };
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'New Member',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=4f46e5&color=fff&size=128`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
