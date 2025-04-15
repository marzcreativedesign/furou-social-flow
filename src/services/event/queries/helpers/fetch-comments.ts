
import { supabase } from "@/integrations/supabase/client";

export async function fetchEventComments(eventId: string) {
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("event_id", eventId);
  
  return comments;
}
