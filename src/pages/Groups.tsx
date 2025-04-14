
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { GroupsService } from "@/services/groups.service";
import { useAuth } from "@/contexts/AuthContext";
import GroupCard from "@/components/groups/GroupCard";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import NoGroups from "@/components/groups/NoGroups";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  members?: number;
  lastActivity?: string;
  created_at?: string;
}

const Groups = () => {
  const { toast: toastUI } = useToast();
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      
      setIsFetching(true);
      try {
        const { data, error } = await GroupsService.getUserGroups();
        
        if (error) {
          console.error("Error fetching groups:", error);
          toast.error("Não foi possível carregar seus grupos");
          return;
        }
        
        if (data) {
          // Create a map to track unique groups and avoid duplicate keys
          const groupsMap = new Map();
          
          data.forEach(item => {
            if (item.groups?.id) {
              const groupId = item.groups.id;
              
              // If we haven't added this group yet, add it
              if (!groupsMap.has(groupId)) {
                groupsMap.set(groupId, {
                  id: groupId,
                  name: item.groups?.name || "",
                  description: item.groups?.description || "",
                  image_url: item.groups?.image_url || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3",
                  members: 1, // Will be updated with actual count in future
                  lastActivity: "Recentemente",
                  created_at: item.groups?.created_at
                });
              }
            }
          });
          
          // Convert map to array
          const formattedGroups = Array.from(groupsMap.values());
          setGroups(formattedGroups);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error("Ocorreu um erro ao carregar os grupos");
      } finally {
        setIsFetching(false);
      }
    };

    fetchGroups();
  }, [user, toastUI]);

  const handleGroupCreated = (newGroup: Group) => {
    setGroups(prevGroups => [...prevGroups, newGroup]);
    toast.success("Grupo criado com sucesso!");
  };

  return (
    <MainLayout title="Seus Grupos">
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Seus grupos</h2>
          <CreateGroupDialog onGroupCreated={handleGroupCreated} />
        </div>
        
        {isFetching ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <GroupCard key={group.id} {...group} />
            ))}
          </div>
        ) : (
          <NoGroups onCreateClick={() => setIsDialogOpen(true)} />
        )}
      </div>
    </MainLayout>
  );
};

export default Groups;
