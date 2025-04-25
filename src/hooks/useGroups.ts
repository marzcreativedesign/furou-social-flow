
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupsService, GroupInvitesService } from '@/services/groups';
import { toast } from 'sonner';

interface CreateGroupData {
  name: string;
  description?: string;
  image_url?: string;
}

interface TransformedGroup {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  members?: number;
  created_at?: string;
}

export const useGroups = () => {
  const queryClient = useQueryClient();
  
  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      try {
        const { data, error } = await GroupsService.getUserGroups();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (!data) {
          return [];
        }

        // Map para evitar grupos duplicados
        const groupsMap = new Map<string, TransformedGroup>();

        data.forEach(item => {
          if (item.groups?.id) {
            const groupId = item.groups.id;
            if (!groupsMap.has(groupId)) {
              groupsMap.set(groupId, {
                id: groupId,
                name: item.groups?.name || "",
                description: item.groups?.description || "",
                image_url: item.groups?.image_url || "",
                created_at: item.groups?.created_at,
              });
            }
          }
        });

        return Array.from(groupsMap.values());
      } catch (error) {
        console.error('Error loading groups:', error);
        toast.error('Erro ao carregar grupos');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
  
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: CreateGroupData) => {
      const { data, error } = await GroupsService.createGroup(groupData);
        
      if (error) {
        throw new Error(error.message);
      }
        
      return data;
    },
    onSuccess: () => {
      toast.success('Grupo criado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar grupo: ${error.message}`);
    }
  });

  const inviteToGroupMutation = useMutation({
    mutationFn: async ({ groupId, email }: { groupId: string, email: string }) => {
      const { data, error } = await GroupInvitesService.inviteUserToGroup(groupId, email);
        
      if (error) {
        throw new Error(error.message);
      }
        
      return data;
    },
    onSuccess: () => {
      toast.success('Convite enviado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao enviar convite: ${error.message}`);
    }
  });
  
  return {
    groups,
    isLoading,
    error,
    refetch,
    createGroup: createGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    inviteToGroup: inviteToGroupMutation.mutate,
    isInviting: inviteToGroupMutation.isPending
  };
};
