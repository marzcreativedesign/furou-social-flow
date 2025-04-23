
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
  
  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      LoggerService.info('Fetching user groups');
      
      try {
        const { data, error } = await GroupsService.getUserGroups();
        
        if (error) {
          LoggerService.error('Error fetching user groups', error);
          throw error;
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
      } catch (error) {
        ErrorService.handleError(error, 'Carregando grupos');
        return [];
      }
    },
  });
  
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: CreateGroupData) => {
      LoggerService.info('Creating new group', groupData);
      try {
        const { data, error } = await GroupsService.createGroup(groupData);
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        ErrorService.handleError(error, 'Criando grupo');
        throw error;
      }
    },
    onSuccess: () => {
      LoggerService.info('Group created successfully');
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
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
