
import { supabase } from '@/integrations/supabase/client';
import { EventCacheService } from '../cache/event-cache.service';

export const GetEventsPaginatedService = {
  getPublicEvents: async (page = 1, pageSize = 6) => { // Reduced from 9 to 6 items per page
    try {
      // Check if we have a cached version first
      const cacheKey = `public_events_${page}_${pageSize}`;
      const cachedData = EventCacheService.getCache(cacheKey);
      
      if (cachedData) {
        console.log('Using cached public events data');
        return cachedData;
      }
      
      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;
      
      // Query only needed fields to reduce data transfer
      const { data: events, error, count } = await supabase
        .from('events')
        .select(`
          id, 
          title,
          date,
          location,
          image_url,
          is_public,
          creator_id,
          profiles:creator_id (full_name),
          event_participants (status)
        `, { count: 'exact' })
        .eq('is_public', true)
        .order('date', { ascending: true })
        .range(offset, offset + pageSize - 1);
      
      if (error) throw error;
      
      // Calculate pagination metadata
      const totalPages = Math.ceil((count || 0) / pageSize);
      
      const response = {
        data: events,
        metadata: {
          totalPages,
          currentPage: page,
          totalCount: count
        },
        error: null
      };
      
      // Cache the response for future use
      EventCacheService.setCache(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error("Error fetching public events:", error);
      return { data: null, error };
    }
  },
  
  getEvents: async (page = 1, pageSize = 6) => { // Reduced from 9 to 6 items per page
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      // Check if we have a cached version
      const cacheKey = `user_events_${user.user.id}_${page}_${pageSize}`;
      const cachedData = EventCacheService.getCache(cacheKey);
      
      if (cachedData) {
        console.log('Using cached user events data');
        return cachedData;
      }
      
      const offset = (page - 1) * pageSize;
      
      // Query for events the user is participating in or has created
      const { data: events, error, count } = await supabase
        .from('events')
        .select(`
          id, 
          title,
          date,
          location,
          image_url,
          is_public,
          creator_id,
          event_participants!inner (user_id, status),
          group_events (id, group_id, groups:group_id (name))
        `, { count: 'exact' })
        .or(`creator_id.eq.${user.user.id},event_participants.user_id.eq.${user.user.id}`)
        .order('date', { ascending: true })
        .range(offset, offset + pageSize - 1);
      
      if (error) throw error;
      
      // Calculate pagination metadata
      const totalPages = Math.ceil((count || 0) / pageSize);
      
      const response = {
        data: events,
        metadata: {
          totalPages,
          currentPage: page,
          totalCount: count
        },
        error: null
      };
      
      // Cache the response for future use
      EventCacheService.setCache(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error("Error fetching user events:", error);
      return { data: null, error };
    }
  }
};

export default GetEventsPaginatedService;
