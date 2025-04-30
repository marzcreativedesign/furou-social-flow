
import { supabase } from "@/integrations/supabase/client";

export const EventManagementService = {
  /**
   * Atualiza um evento existente
   */
  async updateEvent(id: string, eventData: any) {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", id)
        .select();

      return { data: data?.[0], error };
    } catch (error) {
      console.error("Error updating event:", error);
      return { data: null, error };
    }
  },

  /**
   * Exclui um evento
   */
  async deleteEvent(id: string) {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      return { error };
    } catch (error) {
      console.error("Error deleting event:", error);
      return { error };
    }
  }
};
