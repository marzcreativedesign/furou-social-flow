
import * as React from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const { data: { subscription } } = AuthService.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    AuthService.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await AuthService.signInWithEmail(email, password);
      if (!error) {
        toast.success("Login realizado com sucesso!");
        navigate('/home');
      }
      return { error };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error, data } = await AuthService.signUpWithEmail(email, password);
      
      if (!error && data.user) {
        await AuthService.updateProfile(data.user.id, { full_name: fullName });
        toast.success("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.");
      }
      
      return { error };
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await AuthService.resetPassword(email);
      if (!error) {
        toast.success("Enviamos as instruções de recuperação para seu e-mail.");
      }
      return { error };
    } catch (error: any) {
      console.error("Password reset error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setSession(null);
      setUser(null);
      navigate('/', { replace: true });
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Erro ao realizar logout");
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
