
import { supabase } from "@/integrations/supabase/client";

/**
 * Busca comentários de eventos pelo ID do evento
 */
export async function fetchEventComments(eventId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id(full_name, avatar_url)
      `)
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar comentários:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erro inesperado ao buscar comentários:", error);
    return [];
  }
}
