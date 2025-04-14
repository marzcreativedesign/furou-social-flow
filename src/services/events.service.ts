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

export const EventsService = {
  async createEvent(eventData: CreateEventData) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Insert the event with the authenticated user as creator
      const { data, error } = await supabase.from("events").insert({
        ...eventData,
        creator_id: userData.user.id
      }).select();

      if (error) {
        console.error("Error creating event:", error);
        toast.error("Erro ao criar evento: " + error.message);
        return { data: null, error };
      }
      
      // Also add the creator as a participant (confirmed)
      if (data && data.length > 0) {
        const eventId = data[0].id;
        const { error: participantError } = await supabase.from("event_participants").insert({
          event_id: eventId,
          user_id: userData.user.id,
          status: "confirmed"
        });
        
        if (participantError) {
          console.error("Error adding creator as participant:", participantError);
          // We don't want to fail the whole operation if this fails
        }
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error creating event:", error);
      toast.error("Erro inesperado ao criar evento");
      return { data: null, error };
    }
  },
  
  async getEvents() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Get events where the user is either the creator or a participant
      // Fix the OR query syntax
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(*)
        `)
        .or(`creator_id.eq.${userData.user.id},event_participants.user_id.eq.${userData.user.id}`);
      
      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Erro ao buscar eventos");
      }
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected error fetching events:", error);
      toast.error("Erro inesperado ao buscar eventos");
      return { data: null, error };
    }
  },
  
  // Add getUserEvents as an alias to getEvents for backward compatibility
  async getUserEvents() {
    return this.getEvents();
  },
  
  async getPublicEvents() {
    try {
      // Get all public events
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
        console.error("Error fetching public events:", error);
        toast.error("Erro ao buscar eventos públicos");
      }
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected error fetching public events:", error);
      toast.error("Erro inesperado ao buscar eventos públicos");
      return { data: null, error };
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
        .single();
      
      if (error) {
        console.error("Error fetching event by ID:", error);
        toast.error("Erro ao buscar detalhes do evento");
      }
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected error fetching event by ID:", error);
      toast.error("Erro inesperado ao buscar detalhes do evento");
      return { data: null, error };
    }
  },
  
  async joinEvent(eventId: string) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      // Check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", userData.user.id)
        .maybeSingle();
      
      if (existingParticipant) {
        // User is already a participant, let's update their status instead
        return this.updateParticipantStatus(eventId, userData.user.id, "confirmed");
      }
      
      // Otherwise, add them as a new participant
      const { data, error } = await supabase.from("event_participants").insert({
        event_id: eventId,
        user_id: userData.user.id,
        status: "confirmed"
      });
      
      if (error) {
        console.error("Error joining event:", error);
        toast.error("Erro ao participar do evento");
      }
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected error joining event:", error);
      toast.error("Erro inesperado ao participar do evento");
      return { data: null, error };
    }
  },
  
  async updateParticipantStatus(eventId: string, userId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from("event_participants")
        .update({ status })
        .eq("event_id", eventId)
        .eq("user_id", userId);
      
      if (error) {
        console.error("Error updating participant status:", error);
        toast.error("Erro ao atualizar status de participação");
      }
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected error updating participant status:", error);
      toast.error("Erro inesperado ao atualizar status de participação");
      return { data: null, error };
    }
  },

  // Add updateParticipationStatus as an alias to updateParticipantStatus for backward compatibility
  async updateParticipationStatus(eventId: string, status: string) {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    return this.updateParticipantStatus(eventId, userData.user.id, status);
  }
};
