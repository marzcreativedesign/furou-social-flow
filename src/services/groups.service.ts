
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember, GroupInvite, CreateGroupRequest, CreateInviteRequest, RankingUser } from "@/types/group";
import { toast } from "sonner";
import { NotificationsService } from "./notifications.service";
import { SupabaseService } from "./supabase.service";

export const GroupsService = {
  // Grupos
  createGroup: async (groupData: CreateGroupRequest) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await SupabaseService.groups.insert({
        name: groupData.name,
        description: groupData.description || null,
        type: groupData.type || null,
        creator_id: user.user.id
      });

      if (error) throw error;
      return { data: data[0] as unknown as Group, error: null };
    } catch (error: any) {
      console.error("Erro ao criar grupo:", error);
      toast.error("Erro ao criar grupo: " + error.message);
      return { data: null, error };
    }
  },

  getGroups: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await SupabaseService.group_members.selectByUser(user.user.id);

      if (error) throw error;
      
      // Transformando para o formato desejado
      const groups = data.map((item: any) => ({
        ...item.groups,
        is_admin: item.is_admin
      }));
      
      return { data: groups as Group[], error: null };
    } catch (error: any) {
      console.error("Erro ao buscar grupos:", error);
      return { data: [], error };
    }
  },

  getGroupById: async (groupId: string) => {
    try {
      const { data, error } = await SupabaseService.groups.selectById(groupId);

      if (error) throw error;
      return { data: data as unknown as Group, error: null };
    } catch (error: any) {
      console.error(`Erro ao buscar grupo ${groupId}:`, error);
      return { data: null, error };
    }
  },

  // Membros
  getGroupMembers: async (groupId: string) => {
    try {
      const { data, error } = await SupabaseService.group_members.selectWithProfiles(groupId);

      if (error) throw error;
      return { data: data as unknown as GroupMember[], error: null };
    } catch (error: any) {
      console.error(`Erro ao buscar membros do grupo ${groupId}:`, error);
      return { data: [], error };
    }
  },

  leaveGroup: async (groupId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await SupabaseService.group_members.delete(groupId, user.user.id);

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error(`Erro ao sair do grupo ${groupId}:`, error);
      toast.error("Erro ao sair do grupo: " + error.message);
      return { data: null, error };
    }
  },

  // Convites
  createInvite: async (inviteData: CreateInviteRequest) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se já existe um convite pendente para este e-mail
      const { data: existingInvites } = await supabase
        .from('group_invites')
        .select('*')
        .eq('group_id', inviteData.group_id)
        .eq('invitee_email', inviteData.invitee_email)
        .eq('status', 'pending');

      if (existingInvites && existingInvites.length > 0) {
        // Se já existir um convite pendente, retorna ele
        return { data: existingInvites[0] as unknown as GroupInvite, error: null };
      }

      // Criar novo convite
      const { data, error } = await SupabaseService.group_invites.insert({
        group_id: inviteData.group_id,
        inviter_id: user.user.id,
        invitee_email: inviteData.invitee_email,
        status: 'pending' as 'pending',
        viewed: false,
        invite_code: crypto.randomUUID(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      });

      if (error) throw error;
      
      // Buscar dados do grupo para a notificação
      const { data: group } = await SupabaseService.groups.selectById(inviteData.group_id);
      
      // Tentativa de encontrar o usuário pelo e-mail
      const { data: targetUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteData.invitee_email)
        .single();
      
      // Se o usuário existe, enviar notificação
      if (targetUser) {
        await NotificationsService.createNotification({
          title: "Novo convite de grupo",
          content: `Você foi convidado para participar do grupo ${group?.name || 'Desconhecido'}`,
          type: "invite",
          related_id: data.id,
          user_id: targetUser.id
        });
      }
      
      return { data: data as unknown as GroupInvite, error: null };
    } catch (error: any) {
      console.error("Erro ao criar convite:", error);
      toast.error("Erro ao criar convite: " + error.message);
      return { data: null, error };
    }
  },

  getPendingInvites: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar o e-mail do usuário atual
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.user.id)
        .single();

      if (!profile?.email) {
        throw new Error("E-mail do usuário não encontrado");
      }

      const { data, error } = await SupabaseService.group_invites.selectPending(profile.email);

      if (error) throw error;
      return { data: data as unknown as GroupInvite[], error: null };
    } catch (error: any) {
      console.error("Erro ao buscar convites pendentes:", error);
      return { data: [], error };
    }
  },

  acceptInvite: async (inviteCode: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar o convite pelo código
      const { data: invite, error: inviteError } = await SupabaseService.group_invites.selectByCode(inviteCode);

      if (inviteError) throw inviteError;
      if (!invite) throw new Error("Convite não encontrado ou expirado");

      // Cast the invite to the expected type
      const typedInvite = invite as unknown as GroupInvite;

      // Verificar se o convite não expirou
      if (new Date(typedInvite.expires_at) < new Date()) {
        // Atualizar o status do convite para expirado
        await SupabaseService.group_invites.update(typedInvite.id, { status: 'expired' });

        throw new Error("Este convite expirou");
      }

      // Iniciar uma transação
      // Como não podemos usar transações diretamente, vamos fazer as operações em sequência
      
      // 1. Adicionar usuário ao grupo se ainda não for membro
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', typedInvite.group_id)
        .eq('user_id', user.user.id)
        .single();

      if (!existingMember) {
        const { error: memberError } = await SupabaseService.group_members.insert({
          group_id: typedInvite.group_id,
          user_id: user.user.id,
          is_admin: false
        });

        if (memberError) throw memberError;
      }

      // 2. Atualizar o status do convite
      const { error: updateError } = await SupabaseService.group_invites.update(
        typedInvite.id, 
        {
          status: 'accepted',
          viewed: true
        }
      );

      if (updateError) throw updateError;

      // Buscar dados do grupo para a resposta
      const { data: group } = await SupabaseService.groups.selectById(typedInvite.group_id);
      const typedGroup = group as unknown as Group;

      // Enviar notificação ao criador do convite
      if (typedInvite.inviter_id) {
        await NotificationsService.createNotification({
          title: "Convite aceito",
          content: `Seu convite para o grupo ${typedGroup.name || 'Desconhecido'} foi aceito`,
          type: "group",
          related_id: typedInvite.group_id,
          user_id: typedInvite.inviter_id
        });
      }

      return { 
        data: { 
          invite: typedInvite, 
          group: typedGroup
        }, 
        error: null 
      };
    } catch (error: any) {
      console.error("Erro ao aceitar convite:", error);
      toast.error("Erro ao aceitar convite: " + error.message);
      return { data: null, error };
    }
  },

  rejectInvite: async (inviteId: string) => {
    try {
      const { error } = await SupabaseService.group_invites.update(
        inviteId, 
        {
          status: 'expired',
          viewed: true
        }
      );

      if (error) throw error;
      return { data: true, error: null };
    } catch (error: any) {
      console.error("Erro ao rejeitar convite:", error);
      toast.error("Erro ao rejeitar convite: " + error.message);
      return { data: null, error };
    }
  },

  // Rankings
  getConfirmedEventRanking: async (limit: number = 10) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-confirmed-events-ranking', {
        body: { limit_count: limit }
      });

      if (error) throw error;
      return { data: data as RankingUser[], error: null };
    } catch (error: any) {
      console.error("Erro ao buscar ranking de confirmados:", error);
      return { data: [], error };
    }
  },

  getMissedEventRanking: async (limit: number = 10) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-missed-events-ranking', {
        body: { limit_count: limit }
      });

      if (error) throw error;
      return { data: data as RankingUser[], error: null };
    } catch (error: any) {
      console.error("Erro ao buscar ranking de furões:", error);
      return { data: [], error };
    }
  }
};
