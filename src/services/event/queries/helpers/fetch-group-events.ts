
import { supabase } from "@/integrations/supabase/client";

export async function fetchGroupEvents(eventId: string) {
  // Since group events functionality is removed, return empty array
  // This ensures backward compatibility with existing code
  return [];
}
