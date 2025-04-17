
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventQueriesService } from '@/services/event/queries';
import { Event, EventServiceResponse } from "@/types/event";
import { getCache, setCache, generateCacheKey } from "@/utils/clientCache";

// Define the shape of our cached data
interface ExploreEventsData {
  events: Event[];
  metadata: {
    totalPages: number;
    currentPage: number;
  };
}

export const useExploreEvents = (pageSize: number = 9) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Generate a unique cache key for this query
  const cacheKey = generateCacheKey('exploreEvents', { page: currentPage, pageSize });
  
  const { 
    data: eventsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['publicEvents', currentPage, pageSize],
    queryFn: async () => {
      // Check cache first
      const cachedData = getCache<ExploreEventsData>(cacheKey);
      if (cachedData) {
        console.log('[Cache] Using cached explore events data');
        return cachedData;
      }

      // If not in cache, fetch from API
      console.log('[API] Fetching explore events from server');
      const response = await EventQueriesService.getPublicEvents(currentPage, pageSize) as EventServiceResponse;
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao buscar eventos públicos');
      }
      
      const result: ExploreEventsData = { 
        events: (response.data || []).map(event => ({
          ...event,
          date: new Date(event.date).toLocaleString('pt-BR', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric'
          }),
          attendees: event.event_participants?.length || 0
        })),
        metadata: {
          totalPages: response.metadata?.totalPages || 1,
          currentPage: response.metadata?.currentPage || 1
        }
      };
      
      // Store in cache
      setCache(cacheKey, result, { expireTimeInMinutes: 5 });
      
      return result;
    },
    placeholderData: (previousData) => previousData
  });

  // Pre-fetch next page
  useEffect(() => {
    const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };
    
    if (metadata.currentPage < metadata.totalPages) {
      const nextPage = currentPage + 1;
      const nextPageCacheKey = generateCacheKey('exploreEvents', { page: nextPage, pageSize });
      
      // Only pre-fetch if not already in cache
      if (!getCache(nextPageCacheKey)) {
        console.log(`[Prefetch] Pre-fetching page ${nextPage}`);
        EventQueriesService.getPublicEvents(nextPage, pageSize).then((response) => {
          // Make sure response is valid and has data before processing
          if (response && !response.error && response.data) {
            // Explicitly check and cast the response to handle the type
            const responseMetadata = response.metadata || { totalPages: 1, currentPage: nextPage };
            
            const result: ExploreEventsData = {
              events: (response.data || []).map(event => ({
                ...event,
                date: new Date(event.date).toLocaleString('pt-BR', {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: 'numeric'
                }),
                attendees: event.event_participants?.length || 0
              })),
              metadata: {
                totalPages: responseMetadata.totalPages || 1,
                currentPage: nextPage
              }
            };
            setCache(nextPageCacheKey, result, { expireTimeInMinutes: 5 });
          }
        });
      }
    }
  }, [currentPage, eventsData, pageSize]);

  // Safely access events and metadata with fallbacks
  const events = (eventsData as ExploreEventsData)?.events || [];
  const metadata = (eventsData as ExploreEventsData)?.metadata || { totalPages: 1, currentPage: 1 };

  const filteredEvents = events.filter(event => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) ||
        (event.profiles && event.profiles.full_name && event.profiles.full_name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return {
    events: filteredEvents,
    isLoading,
    error,
    metadata,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage
  };
};
