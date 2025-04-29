
import { supabase } from "@/integrations/supabase/client";
import type { EventParticipant } from "@/types/event";

/**
 * Busca confirmações de eventos pelo ID do evento
 */
export async function fetchEventConfirmations(eventId: string): Promise<EventParticipant[]> {
  try {
    const { data, error } = await supabase
      .from("event_participants")
      .select(`
        id,
        user_id,
        event_id,
        created_at,
        profiles:user_id(full_name, avatar_url)
      `)
      .eq("event_id", eventId);

    if (error) {
      console.error("Erro ao buscar confirmações:", error);
      return [];
    }

    // Adicionar o status "confirmed" manualmente já que a coluna parece não existir
    const participantsWithStatus = data.map(participant => ({
      ...participant,
      status: "confirmed" // Adiciona o status manualmente
    }));

    return participantsWithStatus as EventParticipant[];
  } catch (error) {
    console.error("Erro inesperado ao buscar confirmações:", error);
    return [];
  }
}
