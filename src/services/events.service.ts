import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location?: string;
  is_public?: boolean;
  image_url?: string;
  address?: string;
  estimated_budget?: number | null;
  event_participants?: any[];
}

const handleError = (error: any, message: string) => {
  console.error(`Error: ${message}`, error);
  toast.error(message);
  return { data: null, error };
};

const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new Error("User not authenticated");
  }
  return data.user;
};

export const EventsService = {
  async createEvent(eventData: CreateEventData) {
    try {
      const user = await getCurrentUser();
      
      // Insert the event with the authenticated user as creator
      const { data, error } = await supabase.from("events").insert({
        ...eventData,
        creator_id: user.id
      }).select();

      if (error) {
        return handleError(error, "Erro ao criar evento");
      }
      
      // Also add the creator as a participant (confirmed)
      if (data && data.length > 0) {
        const eventId = data[0].id;
        const { error: participantError } = await supabase.from("event_participants").insert({
          event_id: eventId,
          user_id: user.id,
          status: "confirmed"
        });
        
        if (participantError) {
          console.error("Error adding creator as participant:", participantError);
          // We don't want to fail the whole operation if this fails
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return handleError(error, "Erro inesperado ao criar evento");
    }
  },
  
  async getEvents() {
    try {
      const user = await getCurrentUser();
      
      // Fixed OR query syntax with proper filtering
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(*)
        `)
        .or(`creator_id.eq.${user.id},event_participants.user_id.eq.${user.id}`);
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos");
      }
      
      return { data, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos");
    }
  },
  
  async getUserEvents() {
    return this.getEvents();
  },
  
  async getPublicEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(*)
        `)
        .eq("is_public", true)
        .order("date", { ascending: true });
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos públicos");
      }
      
      return { data, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos públicos");
    }
  },
  
  async getEventById(id: string) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(
            *,
            profiles(*)
          ),
          group_events(
            *,
            groups(*)
          ),
          comments(*)
        `)
        .eq("id", id)
        .maybeSingle();
      
      if (error) {
        return handleError(error, "Erro ao buscar detalhes do evento");
      }
      
      return { data, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar detalhes do evento");
    }
  },
  
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
