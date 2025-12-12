
/**
 * Re-export the useAuth hook from the AuthContext
 */
import { useContext, useMemo } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return useMemo(() => context, [
    context.user,
    context.loading,
    context.error
  ]) as AuthContextType;
};
