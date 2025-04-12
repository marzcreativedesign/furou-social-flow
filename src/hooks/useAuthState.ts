
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthService } from '@/services/auth.service';

/**
 * Hook para gerenciar o estado de autenticação
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Configurar listener para mudanças no estado de autenticação
    const { data: { subscription } } = AuthService.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // Verificar sessão existente
    AuthService.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, isLoading };
};
