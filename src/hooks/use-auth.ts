
/**
 * Re-export the useAuth hook from the AuthContext for better imports
 * without creating circular dependencies
 */
import { useAuth } from '@/contexts/AuthContext';

export { useAuth };
