
import { useState, useCallback } from "react";
import { GroupsService } from "@/services/groups.service";
import { Group, GroupMember, GroupInvite, CreateGroupRequest, CreateInviteRequest } from "@/types/group";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGroups = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estado para armazenar o ID do grupo selecionado
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Buscar todos os grupos do usuário
  const {
    data: groups,
    isLoading: loadingGroups,
    refetch: refetchGroups
  } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      const { data, error } = await GroupsService.getGroups();
      if (error) throw error;
      return data;
    }
  });

  // Buscar membros de um grupo específico
  const {
    data: groupMembers,
    isLoading: loadingMembers,
    refetch: refetchMembers
  } = useQuery({
    queryKey: ['groupMembers', selectedGroupId],
    queryFn: async () => {
      if (!selectedGroupId) return [];
      const { data, error } = await GroupsService.getGroupMembers(selectedGroupId);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedGroupId
  });

  // Buscar convites pendentes para o usuário
  const {
    data: pendingInvites,
    isLoading: loadingInvites,
    refetch: refetchInvites
  } = useQuery({
    queryKey: ['pendingInvites'],
    queryFn: async () => {
      const { data, error } = await GroupsService.getPendingInvites();
      if (error) throw error;
      return data;
    }
  });

  // Mutation para criar grupo
  const createGroupMutation = useMutation({
    mutationFn: (groupData: CreateGroupRequest) => GroupsService.createGroup(groupData),
    onSuccess: () => {
      toast({ 
        title: "Grupo criado com sucesso!",
        description: "Seu novo grupo foi criado e você já é o administrador."
      });
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar grupo",
        description: error.message, 
        variant: "destructive"
      });
    }
  });

  // Mutation para sair do grupo
  const leaveGroupMutation = useMutation({
    mutationFn: (groupId: string) => GroupsService.leaveGroup(groupId),
    onSuccess: () => {
      toast({ title: "Você saiu do grupo" });
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      setSelectedGroupId(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao sair do grupo",
        description: error.message, 
        variant: "destructive"
      });
    }
  });

  // Mutation para criar convite
  const createInviteMutation = useMutation({
    mutationFn: (inviteData: CreateInviteRequest) => GroupsService.createInvite(inviteData),
    onSuccess: () => {
      toast({ title: "Convite enviado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao enviar convite",
        description: error.message, 
        variant: "destructive"
      });
    }
  });

  // Mutation para aceitar convite
  const acceptInviteMutation = useMutation({
    mutationFn: (inviteCode: string) => GroupsService.acceptInvite(inviteCode),
    onSuccess: () => {
      toast({ title: "Convite aceito com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao aceitar convite",
        description: error.message, 
        variant: "destructive"
      });
    }
  });

  // Mutation para rejeitar convite
  const rejectInviteMutation = useMutation({
    mutationFn: (inviteId: string) => GroupsService.rejectInvite(inviteId),
    onSuccess: () => {
      toast({ title: "Convite rejeitado" });
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao rejeitar convite",
        description: error.message, 
        variant: "destructive"
      });
    }
  });
  
  // Funções auxiliares encapsuladas
  const createGroup = useCallback((groupData: CreateGroupRequest) => {
    return createGroupMutation.mutateAsync(groupData);
  }, [createGroupMutation]);

  const leaveGroup = useCallback((groupId: string) => {
    return leaveGroupMutation.mutateAsync(groupId);
  }, [leaveGroupMutation]);

  const createInvite = useCallback((inviteData: CreateInviteRequest) => {
    return createInviteMutation.mutateAsync(inviteData);
  }, [createInviteMutation]);

  const acceptInvite = useCallback((inviteCode: string) => {
    return acceptInviteMutation.mutateAsync(inviteCode);
  }, [acceptInviteMutation]);

  const rejectInvite = useCallback((inviteId: string) => {
    return rejectInviteMutation.mutateAsync(inviteId);
  }, [rejectInviteMutation]);

  return {
    // Data
    groups,
    groupMembers,
    pendingInvites,
    selectedGroupId,
    
    // Loading states
    loadingGroups,
    loadingMembers,
    loadingInvites,
    creatingGroup: createGroupMutation.isPending,
    leavingGroup: leaveGroupMutation.isPending,
    sendingInvite: createInviteMutation.isPending,
    acceptingInvite: acceptInviteMutation.isPending,
    rejectingInvite: rejectInviteMutation.isPending,
    
    // Actions
    setSelectedGroupId,
    createGroup,
    leaveGroup,
    createInvite,
    acceptInvite,
    rejectInvite,
    
    // Refetch functions
    refetchGroups,
    refetchMembers,
    refetchInvites
  };
};
