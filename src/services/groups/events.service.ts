
import { supabase } from '@/integrations/supabase/client';

export const GroupEventsService = {
  getGroupEvents: async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, title, date, location, image_url,
          group_events!inner(group_id)
        `)
        .eq('group_events.group_id', groupId)
        .limit(10);
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching group events:", error);
      return { data: null, error };
    }
  },

  addEventToGroup: async (groupId: string, eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_events')
        .insert({
          group_id: groupId,
          event_id: eventId
        });
        
      return { data, error };
    } catch (error) {
      console.error("Error adding event to group:", error);
      return { data: null, error };
    }
  }
};
