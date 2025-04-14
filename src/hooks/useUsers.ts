
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserRole = "free" | "premium" | "admin";

export type UserWithRole = {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  role: UserRole;
  created_at: string | null;
};

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      const authUsers = authUsersData?.users || [];

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = [];
      
      for (const profile of profiles) {
        const authUser = authUsers.find(au => au.id === profile.id);
        if (!authUser) continue;
        
        const userRoles = roles.filter(role => role.user_id === profile.id);
        const highestRole = userRoles.reduce((prev, current) => {
          if (current.role === 'admin') return 'admin' as UserRole;
          if (current.role === 'premium' && prev !== 'admin') return 'premium' as UserRole;
          return prev;
        }, 'free' as UserRole);

        usersWithRoles.push({
          ...profile,
          email: authUser.email || "",
          role: highestRole
        });
      }

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers
  };
};
