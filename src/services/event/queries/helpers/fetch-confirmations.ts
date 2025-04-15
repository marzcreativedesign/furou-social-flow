
import { supabase } from "@/integrations/supabase/client";
import type { EventParticipant } from "@/types/event";

export async function fetchEventConfirmations(eventId: string): Promise<EventParticipant[]> {
  const { data: confirmations } = await supabase
    .from("event_confirmations")
    .select(`
      id,
      user_id,
      status,
      event_id,
      created_at,
      updated_at
    `)
    .eq("event_id", eventId);
    
  if (!confirmations) return [];
  
  const participants: EventParticipant[] = [];
  
  for (const conf of confirmations) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", conf.user_id)
      .maybeSingle();
    
    participants.push({
      id: conf.id,
      user_id: conf.user_id || "",
      status: conf.status || "",
      event_id: conf.event_id,
      created_at: conf.created_at,
      updated_at: conf.updated_at,
      profiles: profileData || null
    });
  }
  
  return participants;
}
