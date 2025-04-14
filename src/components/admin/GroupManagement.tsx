
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Search, Users, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Group = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  member_count?: number;
}

const GroupManagement = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      // For each group, count members
      const groupsWithMembers = await Promise.all(groupsData.map(async (group) => {
        const { count, error: countError } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);
          
        if (countError) {
          console.error('Error counting members for group:', group.id, countError);
          return { ...group, member_count: 0 };
        }
        
        return { ...group, member_count: count || 0 };
      }));

      setGroups(groupsWithMembers);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Erro ao carregar grupos",
        description: "Não foi possível carregar a lista de grupos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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

  const saveGroupChanges = async () => {
    if (!editingGroup) return;

    try {
      const { error } = await supabase
        .from('groups')
        .update({
          name: editingGroup.name,
          description: editingGroup.description,
          image_url: editingGroup.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingGroup.id);

      if (error) throw error;

      setGroups(groups.map(group => 
        group.id === editingGroup.id ? {
          ...editingGroup,
          member_count: group.member_count // Preserve member count
        } : group
      ));

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
      // Delete group
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', editingGroup.id);

      if (error) throw error;

      // Update local state
      setGroups(groups.filter(group => group.id !== editingGroup.id));

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

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
      </div>

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

      {/* Edit Group Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
            <DialogDescription>
              Atualize as informações do grupo.
            </DialogDescription>
          </DialogHeader>
          {editingGroup && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="name"
                  value={editingGroup.name}
                  onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="description"
                  rows={3}
                  value={editingGroup.description || ''}
                  onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="image_url" className="text-sm font-medium">
                  URL da imagem
                </label>
                <Input
                  id="image_url"
                  value={editingGroup.image_url || ''}
                  onChange={(e) => setEditingGroup({...editingGroup, image_url: e.target.value})}
                />
                {editingGroup.image_url && (
                  <div className="mt-2">
                    <img 
                      src={editingGroup.image_url} 
                      alt={editingGroup.name}
                      className="w-full h-40 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={saveGroupChanges}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o grupo "{editingGroup?.name}"?
              Esta ação também excluirá todas as associações de membros e eventos.
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteGroup}>
              Excluir grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupManagement;
