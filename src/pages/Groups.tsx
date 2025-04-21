
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { GroupsService } from "@/services/groups.service";
import { useAuth } from "@/hooks/use-auth";
import GroupCard from "@/components/groups/GroupCard";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  members?: number;
  lastActivity?: string;
  created_at?: string;
}

// Skeleton for loading state
const GroupSkeleton = () => (
  <div className="flex flex-col rounded-lg border border-border overflow-hidden">
    <Skeleton className="h-40 w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      
      setIsFetching(true);
      try {
        const { data: groupMembers } = await GroupsService.getUserGroups();

        if (groupMembers && groupMembers.length > 0) {
          // Map para evitar grupos duplicados
          const groupsMap = new Map<string, Group>();

          groupMembers.forEach(item => {
            if (item.groups?.id) {
              const groupId = item.groups.id;
              if (!groupsMap.has(groupId)) {
                groupsMap.set(groupId, {
                  id: groupId,
                  name: item.groups?.name || "",
                  description: item.groups?.description || "",
                  image_url: item.groups?.image_url || "",
                  members: 1,
                  lastActivity: "",
                  created_at: item.groups?.created_at,
                });
              }
            }
          });

          const formattedGroups = Array.from(groupsMap.values());
          setGroups(formattedGroups);
        } else {
          setGroups([]);
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchGroups();
  }, [user]);

  const handleGroupCreated = (newGroup: Group) => {
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  return (
    <MainLayout title="Seus Grupos">
      <div className="px-4 py-4">
        {/* Botão Criar grupo, sempre fixo no topo à direita */}
        <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Seus grupos</h2>
          <Button 
            className="gap-2"
            onClick={() => setIsDialogOpen(true)}
            data-testid="create-group-global-cta"
          >
            <Plus className="h-4 w-4" />
            Criar grupo
          </Button>
        </div>
        <CreateGroupDialog 
          onGroupCreated={handleGroupCreated} 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />

        {isFetching ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <GroupSkeleton key={i} />
            ))}
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <GroupCard key={group.id} {...group} />
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            Nenhum grupo encontrado.
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Groups;
