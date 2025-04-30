
import { supabase } from "@/integrations/supabase/client";
import { handleError, getCurrentUser } from "./utils";

export const GroupMembersService = {
  /**
   * Retrieves all members of a group
   */
  async getGroupMembers(groupId) {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select("*, profiles:user_id(*)")
        .eq("group_id", groupId);

      return { data, error };
    } catch (error) {
      return handleError(error, "Error retrieving group members");
    }
  },

  /**
   * Checks if the current user is a member of a group
   */
  async isGroupMember(groupId) {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .maybeSingle();

      return { isMember: !!data, error };
    } catch (error) {
      return handleError(error, "Error checking group membership");
    }
  },

  /**
   * Checks if the current user is an admin of a group
   */
  async isGroupAdmin(groupId) {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from("group_members")
        .select("is_admin")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .eq("is_admin", true)
        .maybeSingle();

      return { isAdmin: !!data, error };
    } catch (error) {
      return handleError(error, "Error checking admin status");
    }
  }
};
