
import { supabase } from "@/integrations/supabase/client";
import { handleError, getCurrentUser } from "../utils";

export const GetGroupsService = {
  /**
   * Retrieves all groups where the current user is a member
   */
  async getUserGroups() {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from("group_members" as any)
        .select("groups(*)")
        .eq("user_id", user.id);

      return { 
        data: data?.map(item => (item as any).groups) || [], 
        error 
      };
    } catch (error) {
      return handleError(error, "Error retrieving user groups");
    }
  },

  /**
   * Retrieves all public groups
   */
  async getPublicGroups() {
    try {
      const { data, error } = await supabase
        .from("groups" as any)
        .select("*")
        .eq("type", "public");

      return { data, error };
    } catch (error) {
      return handleError(error, "Error retrieving public groups");
    }
  }
};
