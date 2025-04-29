
import { supabase } from "@/integrations/supabase/client";

export const AuthService = {
  signInWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error };
    }
  },
  
  signUpWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { data: null, error };
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error("Error signing out:", error);
      return { error };
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error };
    }
  },
  
  updatePassword: async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error("Error updating password:", error);
      return { error };
    }
  },
  
  updateProfile: async (userId: string, profile: { [key: string]: any }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId);
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  },
  
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error("Error getting session:", error);
      return { data: null, error };
    }
  },
};
