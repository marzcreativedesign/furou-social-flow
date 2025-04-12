
import { createContext, useContext, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { useAuthState } from '@/hooks/useAuthState';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { session, user, isLoading } = useAuthState();
  const navigate = useNavigate();

  // Método de login com email e senha
  const signIn = async (email: string, password: string) => {
    const { error } = await AuthService.signInWithEmail(email, password);
    return { error };
  };

  // Método de cadastro com email e senha
  const signUp = async (email: string, password: string) => {
    const { error } = await AuthService.signUpWithEmail(email, password);
    return { error };
  };

  // Método para encerrar a sessão
  const signOut = async () => {
    await AuthService.signOut();
  };

  // Método de login com Google
  const signInWithGoogle = async () => {
    await AuthService.signInWithGoogle();
  };

  // Método de login com Apple
  const signInWithApple = async () => {
    await AuthService.signInWithApple();
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acessar o contexto de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
