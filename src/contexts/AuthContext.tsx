import React, { createContext, useState, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { mockUser, mockProfile } from '@/data/mockData';

// Create a mock session for demo purposes
const createMockSession = (): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: mockUser as unknown as User
});

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: typeof mockProfile | null;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{
    error: any | null;
    data: { user: User | null; session: Session | null } | null;
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

// AuthProvider with mock authentication (no login required)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always authenticated with mock user
  const [user] = useState<User | null>(mockUser as unknown as User);
  const [session] = useState<Session | null>(createMockSession());
  const [loading] = useState(false);
  const [error] = useState<any | null>(null);

  const signIn = async (_email: string, _password: string) => {
    return { 
      data: { user: mockUser as unknown as User, session: createMockSession() }, 
      error: null 
    };
  };

  const signUp = async (_email: string, _password: string, _fullName?: string) => {
    return { 
      data: { user: mockUser as unknown as User, session: createMockSession() }, 
      error: null 
    };
  };

  const resetPassword = async (_email: string) => {
    return { error: null };
  };

  const signOut = async () => {
    console.log('Sign out called (demo mode - no action taken)');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile: mockProfile,
      signIn,
      signUp,
      signOut,
      loading,
      error,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
