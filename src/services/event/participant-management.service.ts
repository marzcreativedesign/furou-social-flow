import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./utils";
import { getCurrentUser } from "./utils";

export const ParticipantManagementService = {
  async joinEvent(eventId: string) {
    try {
      const user = await getCurrentUser();
      
      // Check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (existingParticipant) {
        // User is already a participant, update their status instead
        return this.updateParticipantStatus(eventId, user.id, "confirmed");
      }
      
      // Otherwise, add them as a new participant
      const { data, error } = await supabase.from("event_participants").insert({
        event_id: eventId,
        user_id: user.id,
        status: "confirmed"
      });
      
      if (error) {
        return handleError(error, "Erro ao participar do evento");
      }
      
      return { data, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao participar do evento");
    }
  },
  
  async updateParticipantStatus(eventId: string, userId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from("event_participants")
        .update({ status })
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .select();
      
      if (error) {
        return handleError(error, "Erro ao atualizar status de participação");
      }
      
      return { data, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao atualizar status de participação");
    }
  },

  async updateParticipationStatus(eventId: string, status: string) {
    const user = await getCurrentUser();
    return this.updateParticipantStatus(eventId, user.id, status);
  }
};
