
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember, GroupInvite, CreateGroupRequest, CreateInviteRequest, RankingUser } from "@/types/group";
import { toast } from "sonner";
import { NotificationsService } from "./notifications.service";

export const GroupsService = {
  // Grupos
  createGroup: async (groupData: CreateGroupRequest) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from('groups')
        .insert({
          name: groupData.name,
          description: groupData.description || null,
          type: groupData.type || null,
          creator_id: user.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Group, error: null };
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

      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          is_admin,
          groups:group_id(
            id,
            name,
            description,
            type,
            creator_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.user.id);

      if (error) throw error;
      
      // Transformando para o formato desejado
      const groups = data.map(item => ({
        ...item.groups,
        is_admin: item.is_admin
      }));
      
      return { data: groups as unknown as Group[], error: null };
    } catch (error: any) {
      console.error("Erro ao buscar grupos:", error);
      return { data: [], error };
    }
  },

  getGroupById: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

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
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id,
          group_id,
          user_id,
          is_admin,
          created_at,
          updated_at,
          profiles:user_id(id, full_name, avatar_url, email)
        `)
        .eq('group_id', groupId);

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

      const { data, error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.user.id);

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
      const { data, error } = await supabase
        .from('group_invites')
        .insert({
          group_id: inviteData.group_id,
          inviter_id: user.user.id,
          invitee_email: inviteData.invitee_email
        })
        .select()
        .single();

      if (error) throw error;
      
      // Buscar dados do grupo para a notificação
      const { data: group } = await supabase
        .from('groups')
        .select('name')
        .eq('id', inviteData.group_id)
        .single();
      
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

      const { data, error } = await supabase
        .from('group_invites')
        .select(`
          id,
          group_id,
          inviter_id,
          invitee_email,
          invite_code,
          status,
          viewed,
          created_at,
          expires_at,
          group:group_id(id, name, description),
          inviter:inviter_id(id, full_name, avatar_url)
        `)
        .eq('invitee_email', profile.email)
        .eq('status', 'pending');

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
      const { data: invite, error: inviteError } = await supabase
        .from('group_invites')
        .select('*')
        .eq('invite_code', inviteCode)
        .eq('status', 'pending')
        .single();

      if (inviteError) throw inviteError;
      if (!invite) throw new Error("Convite não encontrado ou expirado");

      // Verificar se o convite não expirou
      if (new Date(invite.expires_at) < new Date()) {
        // Atualizar o status do convite para expirado
        await supabase
          .from('group_invites')
          .update({ status: 'expired' })
          .eq('id', invite.id);

        throw new Error("Este convite expirou");
      }

      // Iniciar uma transação
      // Como não podemos usar transações diretamente, vamos fazer as operações em sequência
      
      // 1. Adicionar usuário ao grupo se ainda não for membro
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', invite.group_id)
        .eq('user_id', user.user.id)
        .single();

      if (!existingMember) {
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: invite.group_id,
            user_id: user.user.id,
            is_admin: false
          });

        if (memberError) throw memberError;
      }

      // 2. Atualizar o status do convite
      const { error: updateError } = await supabase
        .from('group_invites')
        .update({
          status: 'accepted',
          viewed: true
        })
        .eq('id', invite.id);

      if (updateError) throw updateError;

      // Buscar dados do grupo para a resposta
      const { data: group } = await supabase
        .from('groups')
        .select('*')
        .eq('id', invite.group_id)
        .single();

      // Enviar notificação ao criador do convite
      if (invite.inviter_id) {
        await NotificationsService.createNotification({
          title: "Convite aceito",
          content: `Seu convite para o grupo ${group?.name || 'Desconhecido'} foi aceito`,
          type: "group",
          related_id: invite.group_id,
          user_id: invite.inviter_id
        });
      }

      return { 
        data: { 
          invite: invite as unknown as GroupInvite, 
          group: group as unknown as Group 
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
      const { error } = await supabase
        .from('group_invites')
        .update({
          status: 'expired',
          viewed: true
        })
        .eq('id', inviteId);

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
