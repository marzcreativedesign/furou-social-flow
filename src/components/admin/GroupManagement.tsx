
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, RefreshCw, PencilIcon, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupsAdmin } from "@/hooks/useGroupsAdmin";
import { Input } from "@/components/ui/input";

const GroupManagement = () => {
  const { groups, loading, fetchGroups } = useGroupsAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Input
          placeholder="Buscar grupos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
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
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description || "—"}</TableCell>
                  <TableCell>{group.member_count}</TableCell>
                  <TableCell>
                    {group.created_at
                      ? new Date(group.created_at).toLocaleDateString('pt-BR')
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-1">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  {searchQuery ? "Nenhum grupo encontrado para esta busca" : "Nenhum grupo cadastrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GroupManagement;
