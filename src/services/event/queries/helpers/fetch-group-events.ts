
import { supabase } from "@/integrations/supabase/client";

export async function fetchGroupEvents(eventId: string) {
  const { data: groupEvents } = await supabase
    .from("group_events")
    .select(`
      id, 
      group_id,
      event_id,
      groups(id, name)
    `)
    .eq("event_id", eventId);
  
  return groupEvents;
}
