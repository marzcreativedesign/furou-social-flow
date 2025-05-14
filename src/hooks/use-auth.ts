
/**
 * Re-export the useAuth hook from the AuthContext with performance optimizations
 * to prevent unnecessary rerenders and improve state management
 */
import { useContext, useMemo } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Use memoization to prevent unnecessary rerenders
  return useMemo(() => context, [
    context.user,
    context.loading,
    context.error
  ]);
};
