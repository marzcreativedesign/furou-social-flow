
import { useAuth as useAuthContextHook } from '@/contexts/AuthContext';

/**
 * Re-export the useAuth hook from the AuthContext for better imports
 */
export const useAuth = useAuthContextHook;
