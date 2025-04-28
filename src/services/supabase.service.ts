
import { supabase } from "@/integrations/supabase/client";
import { Group, GroupMember, GroupInvite } from "@/types/group";

// This service provides typed wrappers around Supabase operations
// to handle missing database tables in the Supabase types
export const SupabaseService = {
  groups: {
    insert: async (data: Partial<Omit<Group, "id">>) => {
      return await (supabase
        .from('groups') as any)
        .insert(data)
        .select();
    },
    select: async () => {
      return await (supabase
        .from('groups') as any)
        .select('*');
    },
    selectById: async (id: string) => {
      return await (supabase
        .from('groups') as any)
        .select('*')
        .eq('id', id)
        .single();
    }
  },
  
  group_members: {
    select: async () => {
      return await (supabase
        .from('group_members') as any)
        .select('*');
    },
    selectWithProfiles: async (groupId: string) => {
      return await (supabase
        .from('group_members') as any)
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
    },
    selectByUser: async (userId: string) => {
      return await (supabase
        .from('group_members') as any)
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
        .eq('user_id', userId);
    },
    insert: async (data: Partial<Omit<GroupMember, "id">>) => {
      return await (supabase
        .from('group_members') as any)
        .insert(data)
        .select();
    },
    delete: async (groupId: string, userId: string) => {
      return await (supabase
        .from('group_members') as any)
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
    }
  },
  
  group_invites: {
    select: async () => {
      return await (supabase
        .from('group_invites') as any)
        .select('*');
    },
    selectPending: async (email: string) => {
      return await (supabase
        .from('group_invites') as any)
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
        .eq('invitee_email', email)
        .eq('status', 'pending');
    },
    selectByCode: async (code: string) => {
      return await (supabase
        .from('group_invites') as any)
        .select(`
          *,
          group:group_id(*)
        `)
        .eq('invite_code', code)
        .single();
    },
    insert: async (data: Partial<Omit<GroupInvite, "id">>) => {
      return await (supabase
        .from('group_invites') as any)
        .insert(data)
        .select()
        .single();
    },
    update: async (id: string, data: Partial<GroupInvite>) => {
      return await (supabase
        .from('group_invites') as any)
        .update(data)
        .eq('id', id);
    }
  }
};
