
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./utils";
import { getCurrentUser } from "./utils";

export const ParticipantManagementService = {
  async joinEvent(eventId: string) {
    try {
      const user = await getCurrentUser();
      
      // Check if user is already participating
      const { data: existingParticipation, error: checkError } = await supabase
        .from("event_confirmations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (checkError) {
        return handleError(checkError, "Erro ao verificar participação existente");
      }
      
      if (existingParticipation) {
        // Update if already exists
        const { data, error } = await supabase
          .from("event_confirmations")
          .update({ status: "confirmed" })
          .eq("id", existingParticipation.id);
        
        if (error) {
          return handleError(error, "Erro ao atualizar participação no evento");
        }
        
        return { data, error: null };
      }
      
      // Create new participation
      const { data, error } = await supabase
        .from("event_confirmations")
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: "confirmed"
        });
      
      if (error) {
        return handleError(error, "Erro ao participar do evento");
      }
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao participar do evento");
    }
  },
  
  async declineEvent(eventId: string) {
    try {
      const user = await getCurrentUser();
      
      // Check if user is already participating
      const { data: existingParticipation, error: checkError } = await supabase
        .from("event_confirmations")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (checkError) {
        return handleError(checkError, "Erro ao verificar participação existente");
      }
      
      if (existingParticipation) {
        // Update if already exists
        const { data, error } = await supabase
          .from("event_confirmations")
          .update({ status: "declined" })
          .eq("id", existingParticipation.id);
        
        if (error) {
          return handleError(error, "Erro ao atualizar participação no evento");
        }
        
        return { data, error: null };
      }
      
      // Create new participation with declined status
      const { data, error } = await supabase
        .from("event_confirmations")
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: "declined"
        });
      
      if (error) {
        return handleError(error, "Erro ao recusar o evento");
      }
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao recusar o evento");
    }
  },
};
