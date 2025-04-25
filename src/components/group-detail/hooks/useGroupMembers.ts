
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { GroupMembersService, GroupInvitesService } from "@/services/groups";
import { GroupMember, MemberRole } from "../types";

export const useGroupMembers = (groupId: string) => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await GroupMembersService.getGroupMembers(groupId);
      
      if (error) throw new Error(error.message);
      
      if (data) {
        const formattedMembers: GroupMember[] = data.map(member => {
          // Determine role
          let role: MemberRole = "member";
          if (member.is_admin) {
            role = "admin"; // Default admins to "admin" role
          }
          
          return {
            id: member.id,
            user_id: member.user_id,
            name: member.profile?.full_name || member.profile?.username || 'Usuário',
            email: member.profile?.email,
            avatarUrl: member.profile?.avatar_url || `https://i.pravatar.cc/150?u=${member.user_id}`,
            role: role,
            is_admin: member.is_admin
          };
        });
        
        setMembers(formattedMembers);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os membros do grupo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [groupId, toast]);

  const removeMember = async (member: GroupMember) => {
    try {
      const { error } = await GroupMembersService.removeMember(groupId, member.user_id);
      if (error) throw new Error(error.message);
      
      setMembers(prev => prev.filter(m => m.id !== member.id));
      toast({
        title: "Sucesso",
        description: "Membro removido com sucesso"
      });
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o membro",
        variant: "destructive"
      });
    }
  };

  const updateRole = async (member: GroupMember, isNewAdmin: boolean) => {
    try {
      const { error } = await GroupMembersService.updateMember(groupId, member.user_id, isNewAdmin);
      if (error) throw new Error(error.message);
      
      setMembers(prev => prev.map(m => 
        m.id === member.id 
          ? { ...m, role: isNewAdmin ? "admin" : "member", is_admin: isNewAdmin }
          : m
      ));
      
      toast({
        title: "Sucesso",
        description: `Função atualizada com sucesso`
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a função do membro",
        variant: "destructive"
      });
    }
  };

  const inviteMember = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await GroupInvitesService.inviteUserToGroup(groupId, email);
      if (error) throw new Error(error.message);
      
      toast({
        title: "Sucesso",
        description: "Convite enviado com sucesso"
      });
      return true;
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    members,
    loading,
    fetchMembers,
    removeMember,
    updateRole,
    inviteMember
  };
};
