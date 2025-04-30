
import { supabase } from "@/integrations/supabase/client";
import { handleError, getCurrentUser } from "./utils";

export const GroupManagementService = {
  /**
   * Creates a new group
   */
  async createGroup(groupData: any) {
    try {
      const user = await getCurrentUser();
      
      // Insert the group
      const { data, error } = await supabase
        .from("groups")
        .insert([{
          ...groupData,
          creator_id: user.id
        }])
        .select();
        
      if (error || !data?.[0]) {
        return { data: null, error: error || new Error("Failed to create group") };
      }
      
      // Add the creator as an admin member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert([{
          group_id: data[0].id,
          user_id: user.id,
          is_admin: true
        }]);

      return { data: data[0], error: memberError };
    } catch (error) {
      return handleError(error, "Error creating group");
    }
  },

  /**
   * Updates an existing group
   */
  async updateGroup(groupId: string, groupData: any) {
    try {
      const { data, error } = await supabase
        .from("groups")
        .update(groupData)
        .eq("id", groupId)
        .select();

      return { data: data?.[0], error };
    } catch (error) {
      return handleError(error, "Error updating group");
    }
  },

  /**
   * Deletes a group
   */
  async deleteGroup(groupId: string) {
    try {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);

      return { error };
    } catch (error) {
      return handleError(error, "Error deleting group");
    }
  }
};
