import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

type GroupMemberProfile = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
}

type GroupMember = {
  id: string;
  user_id: string;
  is_admin: boolean;
  profiles?: GroupMemberProfile;
}

export const GroupsService = {
  getUserGroups: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id, user_id, is_admin, 
          groups:group_id(
            id, name, description, image_url, created_at
          )
        `)
        .eq('user_id', user.user.id);
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return { data: null, error };
    }
  },

  getGroupById: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id, name, description, image_url, created_at,
          group_members(id, user_id, is_admin)
        `)
        .eq('id', groupId)
        .single();
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching group:", error);
      return { data: null, error };
    }
  },

  getGroupMembers: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id, user_id, is_admin,
          profiles:user_id(id, username, full_name, avatar_url, email)
        `)
        .eq('group_id', groupId);
        
      return { data: data as GroupMember[], error };
    } catch (error) {
      console.error("Error fetching group members:", error);
      return { data: null, error };
    }
  },
  
  getGroupEvents: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, title, date, location, image_url,
          group_events!inner(group_id)
        `)
        .eq('group_events.group_id', groupId)
        .limit(10);
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching group events:", error);
      return { data: null, error };
    }
  },

  createGroup: async (data: {
    name: string;
    description?: string;
    image_url?: string;
  }) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data: createdGroup, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description,
          image_url: data.image_url
        })
        .select()
        .single();
        
      if (groupError || !createdGroup) {
        throw groupError || new Error('Error creating group');
      }
      
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: createdGroup.id,
          user_id: user.user.id,
          is_admin: true
        });
        
      if (memberError) {
        console.error("Error adding member:", memberError);
        await supabase
          .from('groups')
          .delete()
          .eq('id', createdGroup.id);
          
        throw memberError;
      }
      
      return { data: createdGroup, error: null };
    } catch (error) {
      console.error("Error creating group:", error);
      return { data: null, error };
    }
  },
  
  addMemberToGroup: async (groupId: string, userId: string, isAdmin: boolean = false) => {
    try {
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (existingMember) {
        return { data: existingMember, error: null };
      }
      
      const { data, error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: userId,
          is_admin: isAdmin
        })
        .select()
        .single();
        
      return { data, error };
    } catch (error) {
      console.error("Error adding member to group:", error);
      return { data: null, error };
    }
  },
  
  inviteUserToGroup: async (groupId: string, email: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data: isAdmin } = await supabase
        .from('group_members')
        .select('is_admin')
        .eq('group_id', groupId)
        .eq('user_id', user.user.id)
        .eq('is_admin', true)
        .maybeSingle();
        
      if (!isAdmin) {
        throw new Error('Você não tem permissão para convidar usuários para este grupo');
      }
      
      const { data: invitedUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (!invitedUser) {
        return { 
          data: null, 
          error: { message: 'Usuário não encontrado com este email' }
        };
      }
      
      const { data: group } = await supabase
        .from('groups')
        .select('name')
        .eq('id', groupId)
        .single();
        
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: invitedUser.id,
          title: 'Convite para grupo',
          content: `Você foi convidado para participar do grupo "${group?.name}"`,
          type: 'group_invite',
          related_id: groupId
        });
        
      if (notificationError) {
        throw notificationError;
      }
      
      return { 
        data: { success: true, message: 'Convite enviado com sucesso' }, 
        error: null 
      };
    } catch (error) {
      console.error("Error inviting user to group:", error);
      return { data: null, error };
    }
  },
  
  updateMember: async (groupId: string, userId: string, isAdmin: boolean) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .update({ is_admin: isAdmin })
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      return { data, error };
    } catch (error) {
      console.error("Error updating group member:", error);
      return { data: null, error };
    }
  },
  
  removeMember: async (groupId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
        
      return { data, error };
    } catch (error) {
      console.error("Error removing group member:", error);
      return { data: null, error };
    }
  },
  
  addEventToGroup: async (groupId: string, eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_events')
        .insert({
          group_id: groupId,
          event_id: eventId
        });
        
      return { data, error };
    } catch (error) {
      console.error("Error adding event to group:", error);
      return { data: null, error };
    }
  }
};
