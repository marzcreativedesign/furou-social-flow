
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleError } from "./utils";
import { getCurrentUser } from "./utils";
import type { CreateEventData } from "./types";

export const EventCreationService = {
  async createEvent(eventData: CreateEventData) {
    try {
      const user = await getCurrentUser();
      
      // Insert the event with the authenticated user as creator
      // Removed .select() to prevent RLS recursion issues
      const { error } = await supabase.from("events").insert({
        ...eventData,
        creator_id: user.id
      });

      if (error) {
        return handleError(error, "Erro ao criar evento");
      }
      
      // If we need the created event data, fetch it separately after creation
      const { data: createdEvents } = await supabase
        .from("events")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      
      const data = createdEvents || [];
      
      // Also add the creator as a participant (confirmed)
      if (data && data.length > 0) {
        const eventId = data[0].id;
        const { error: participantError } = await supabase.from("event_confirmations").insert({
          event_id: eventId,
          user_id: user.id,
          status: "confirmed"
        });
        
        if (participantError) {
          console.error("Error adding creator as participant:", participantError);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao criar evento");
    }
  }
};
