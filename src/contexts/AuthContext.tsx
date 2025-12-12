
import React, { createContext, useState, useContext } from 'react';
import { mockUser, mockProfile } from '@/data/mockData';

// Mock user type to match Supabase User structure
export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: MockUser | null;
  session: any | null;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: any | null;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    data?: any;
  }>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always logged in with mock user
  const [user] = useState<MockUser | null>(mockUser as MockUser);
  const [session] = useState<any | null>({ user: mockUser });
  const [loading] = useState(false);
  const [error] = useState<any | null>(null);

  const signIn = async (_email: string, _password: string) => {
    // Mock sign in - always successful
    return { data: { user: mockUser, session: { user: mockUser } }, error: null };
  };

  const signUp = async (_email: string, _password: string, _fullName?: string) => {
    // Mock sign up - always successful
    return { data: { user: mockUser, session: { user: mockUser } }, error: null };
  };

  const resetPassword = async (_email: string) => {
    // Mock reset password - always successful
    return { error: null };
  };

  const signOut = async () => {
    // Mock sign out - does nothing since we're always "logged in"
    console.log('Mock sign out');
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
    error,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
