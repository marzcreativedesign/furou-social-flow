
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

/**
 * Serviço para gerenciar operações de autenticação com o Supabase
 */
export const AuthService = {
  /**
   * Login com email e senha
   */
  signInWithEmail: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  /**
   * Cadastro com email e senha
   */
  signUpWithEmail: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
  },

  /**
   * Login com o provedor Google
   */
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  },

  /**
   * Login com o provedor Apple
   */
  signInWithApple: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  },

  /**
   * Encerrar a sessão atual
   */
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  /**
   * Obter a sessão atual
   */
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  /**
   * Configurar listener para mudanças no estado de autenticação
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
