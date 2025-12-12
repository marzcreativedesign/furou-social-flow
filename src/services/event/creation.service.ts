
import { supabase } from "@/integrations/supabase/client";
import type { CreateEventData } from "./types";

export const EventCreationService = {
  /**
   * Cria um novo evento
   */
  async createEvent(eventData: CreateEventData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("events")
        .insert([{
          ...eventData,
          creator_id: user.id
        }])
        .select();

      return { data: data?.[0], error };
    } catch (error) {
      console.error("Error creating event:", error);
      return { data: null, error };
    }
  }
};
