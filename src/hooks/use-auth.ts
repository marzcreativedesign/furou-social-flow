
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * Re-export the useAuth hook from the AuthContext for better imports
 */
const useAuth = useAuthContext;

export { useAuth };
