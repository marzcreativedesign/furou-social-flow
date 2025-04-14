
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import UserSearch from "./UserSearch";
import UsersTable from "./UsersTable";
import UserEditDialog from "./UserEditDialog";
import { useUsers } from "@/hooks/useUsers";
import type { UserWithRole } from "@/hooks/useUsers";

const UserManagement = () => {
  const { users, loading, fetchUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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
