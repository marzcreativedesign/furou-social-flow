
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type Role = 'free' | 'premium' | 'admin';

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<Role>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole('free');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('free');
      } else {
        setRole(data.role as Role);
      }
      
      setIsLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, isLoading };
};
