
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./utils";
import { getCurrentUser } from "./utils";

export const EventQueriesService = {
  async getEvents() {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(*)
        `)
        .or(`creator_id.eq.${user.id},is_public.eq.true`)
        .order("date", { ascending: true });
      
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
  
  async getUserCreatedEvents() {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:creator_id(*),
          event_participants(*)
        `)
        .eq("creator_id", user.id)
        .order("date", { ascending: true });
      
      if (error) {
        return handleError(error, "Erro ao buscar eventos do usuário");
      }
      
      return { data, error };
    } catch (error) {
      return handleError(error, "Erro inesperado ao buscar eventos do usuário");
    }
  }
};

