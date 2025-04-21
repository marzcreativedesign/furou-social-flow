
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupsService } from '@/services/groups.service';
import { ErrorService } from '@/services/error.service';
import { LoggerService } from '@/services/logger.service';
import { DataTransformerService, TransformedGroup } from '@/services/data-transformer.service';

interface CreateGroupData {
  name: string;
  description?: string;
  image_url?: string;
}

export const useGroups = () => {
  const queryClient = useQueryClient();
  
  // Consulta para buscar grupos do usuário
  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      LoggerService.info('Fetching user groups');
      
      const { data, error } = await GroupsService.getUserGroups();
      
      if (error) {
        LoggerService.error('Error fetching user groups', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Map para evitar grupos duplicados
        const groupsMap = new Map<string, TransformedGroup>();

        data.forEach(item => {
          if (item.groups?.id) {
            const groupId = item.groups.id;
            if (!groupsMap.has(groupId)) {
              const transformedGroup = DataTransformerService.transformGroupData({
                id: groupId,
                name: item.groups?.name || "",
                description: item.groups?.description || "",
                image_url: item.groups?.image_url || "",
                created_at: item.groups?.created_at,
                group_members: [item]
              });
              
              if (transformedGroup) {
                groupsMap.set(groupId, transformedGroup);
              }
            }
          }
        });

        return Array.from(groupsMap.values());
      }
      
      return [];
    },
    meta: {
      onError: (error: any) => {
        ErrorService.handleError(error, 'Carregando grupos');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  // Mutação para criar um novo grupo
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: CreateGroupData) => {
      LoggerService.info('Creating new group', groupData);
      return await GroupsService.createGroup(groupData);
    },
    onSuccess: () => {
      LoggerService.info('Group created successfully');
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
    },
    onError: (error: any) => {
      ErrorService.handleError(error, 'Criando grupo');
    }
  });
  
  return {
    groups,
    isLoading,
    error,
    refetch,
    createGroup: createGroupMutation.mutate,
    isCreating: createGroupMutation.isPending
  };
};
