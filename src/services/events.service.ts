
import { supabase } from "@/integrations/supabase/client";

interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location?: string;
  is_public?: boolean;
  image_url?: string;
  event_participants?: any[];
}

export const EventsService = {
  async createEvent(eventData: CreateEventData) {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Insert the event with the authenticated user as creator
    return supabase.from("events").insert({
      ...eventData,
      creator_id: userData.user.id
    }).select();
  },
  
  async getEvents() {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Get events where the user is either the creator or a participant
    return supabase
      .from("events")
      .select(`
        *,
        profiles:creator_id(*),
        event_participants(*)
      `)
      .or(`creator_id.eq.${userData.user.id},event_participants.user_id.eq.${userData.user.id}`);
  },
  
  // Add getUserEvents as an alias to getEvents for backward compatibility
  async getUserEvents() {
    return this.getEvents();
  },
  
  async getPublicEvents() {
    // Get all public events
    return supabase
      .from("events")
      .select(`
        *,
        profiles:creator_id(*),
        event_participants(*)
      `)
      .eq("is_public", true)
      .order("date", { ascending: true });
  },
  
  async getEventById(id: string) {
    return supabase
      .from("events")
      .select(`
        *,
        profiles:creator_id(*),
        event_participants(*),
        comments(*)
      `)
      .eq("id", id)
      .single();
  },
  
  async joinEvent(eventId: string) {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    return supabase.from("event_participants").insert({
      event_id: eventId,
      user_id: userData.user.id,
      status: "confirmed"
    });
  },
  
  async updateParticipantStatus(eventId: string, userId: string, status: string) {
    return supabase
      .from("event_participants")
      .update({ status })
      .eq("event_id", eventId)
      .eq("user_id", userId);
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
