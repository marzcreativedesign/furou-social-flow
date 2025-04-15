
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./utils";
import { getCurrentUser } from "./utils";

export const ParticipantManagementService = {
  async joinEvent(eventId: string, status: 'confirmed' | 'declined' = 'confirmed') {
    try {
      const user = await getCurrentUser();
      
      // Check if user already has a confirmation
      const { data: existingConfirmation } = await supabase
        .from("event_confirmations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (existingConfirmation) {
        // Update existing confirmation
        const { data, error } = await supabase
          .from("event_confirmations")
          .update({ status })
          .eq("id", existingConfirmation.id)
          .select();
        
        if (error) {
          return handleError(error, "Erro ao atualizar confirmação");
        }
        
        return { data, error: null };
      }
      
      // Create new confirmation
      const { data, error } = await supabase
        .from("event_confirmations")
        .insert({
          event_id: eventId,
          user_id: user.id,
          status
        })
        .select();
      
      if (error) {
        return handleError(error, "Erro ao confirmar presença");
      }
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao confirmar presença");
    }
  },
  
  async updateParticipantStatus(eventId: string, userId: string, status: string) {
    try {
      const { data: existingConfirmation } = await supabase
        .from("event_confirmations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .maybeSingle();
      
      if (existingConfirmation) {
        const { data, error } = await supabase
          .from("event_confirmations")
          .update({ status })
          .eq("id", existingConfirmation.id)
          .select();
        
        if (error) {
          return handleError(error, "Erro ao atualizar status");
        }
        
        return { data, error: null };
      }
      
      // Create new confirmation if none exists
      const { data, error } = await supabase
        .from("event_confirmations")
        .insert({
          event_id: eventId,
          user_id: userId,
          status
        })
        .select();
      
      if (error) {
        return handleError(error, "Erro ao atualizar status");
      }
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao atualizar status");
    }
  },

  async updateParticipationStatus(eventId: string, status: string) {
    const user = await getCurrentUser();
    return this.updateParticipantStatus(eventId, user.id, status);
  }
};
