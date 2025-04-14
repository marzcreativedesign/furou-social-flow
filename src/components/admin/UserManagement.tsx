
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import UserSearch from "./UserSearch";
import UsersTable from "./UsersTable";
import UserEditDialog from "./UserEditDialog";
import { User } from "@supabase/supabase-js";

type UserRole = "free" | "premium" | "admin";

type UserWithRole = {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  role: UserRole;
  created_at: string | null;
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleEditUser = (user: UserWithRole) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <UserSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <UsersTable 
        users={filteredUsers}
        loading={loading}
        onEditUser={handleEditUser}
      />

      <UserEditDialog
        user={editingUser}
        open={openDialog}
        onOpenChange={setOpenDialog}
        onUserUpdate={fetchUsers}
      />
    </div>
  );
};

export default UserManagement;
