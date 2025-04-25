
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from './types';

export const GroupEventsService = {
  getGroupEvents: async (groupId: string): Promise<ApiResponse<any[]>> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, title, date, location, image_url,
          group_events!inner(group_id)
        `)
        .eq('group_events.group_id', groupId)
        .limit(10);
        
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching group events:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  },

  addEventToGroup: async (groupId: string, eventId: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('group_events')
        .insert({
          group_id: groupId,
          event_id: eventId
        });
        
      if (error) {
        return { data: null, error: { message: error.message } };
      }
      
      return { data: null, error: null };
    } catch (error) {
      console.error("Error adding event to group:", error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: null, error: { message } };
    }
  }
};
