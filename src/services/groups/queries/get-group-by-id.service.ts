
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "../utils";

export const GetGroupByIdService = {
  /**
   * Retrieves a specific group by ID
   */
  async getGroupById(id: string) {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", id)
        .single();

      return { data, error };
    } catch (error) {
      return handleError(error, "Error retrieving group details");
    }
  }
};
