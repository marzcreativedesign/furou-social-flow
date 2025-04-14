
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Users, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupsAdmin, type Group } from "@/hooks/useGroupsAdmin";
import GroupSearch from "./groups/GroupSearch";
import GroupEditDialog from "./groups/GroupEditDialog";
import GroupDeleteDialog from "./groups/GroupDeleteDialog";

const GroupManagement = () => {
  const { groups, loading, fetchGroups } = useGroupsAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setOpenEditDialog(true);
  };

  const handleDeletePrompt = (group: Group) => {
    setEditingGroup(group);
    setOpenDeleteDialog(true);
  };

  const saveGroupChanges = async (group: Group) => {
    try {
      const { error } = await supabase
        .from('groups')
        .update({
          name: group.name,
          description: group.description,
          image_url: group.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', group.id);

      if (error) throw error;

      await fetchGroups();

      toast({
        title: "Grupo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating group:', error);
      toast({
        title: "Erro ao atualizar grupo",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const deleteGroup = async () => {
    if (!editingGroup) return;

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', editingGroup.id);

      if (error) throw error;

      await fetchGroups();

      toast({
        title: "Grupo excluído",
        description: "O grupo foi excluído com sucesso.",
      });

      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: "Erro ao excluir grupo",
        description: "Não foi possível excluir o grupo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Grupos</h2>
        <Button onClick={fetchGroups} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <GroupSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Membros</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[250px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                </TableRow>
              ))
            ) : filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Nenhum grupo encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map(group => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description ? 
                    group.description.length > 100 ? 
                      `${group.description.slice(0, 100)}...` : 
                      group.description
                    : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{group.member_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {group.created_at ? new Date(group.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditGroup(group)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePrompt(group)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <GroupEditDialog
        group={editingGroup}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        onSave={saveGroupChanges}
      />

      <GroupDeleteDialog
        group={editingGroup}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onDelete={deleteGroup}
      />
    </div>
  );
};

export default GroupManagement;
