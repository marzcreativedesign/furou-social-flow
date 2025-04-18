
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventQueriesService } from '@/services/event/queries';
import { Event } from "@/types/event";
import { ExploreEventsData, ExploreEventsResponse } from "@/types/explore";
import { getEventsCacheKey, getCachedEvents, cacheEvents } from "@/utils/eventCache";
import { createEventResponse } from "@/utils/eventTransforms";

export const useExploreEvents = (pageSize: number = 9) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const cacheKey = getEventsCacheKey('exploreEvents', { page: currentPage, pageSize });
  
  const { 
    data: eventsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['publicEvents', currentPage, pageSize],
    queryFn: async () => {
      const cachedData = getCachedEvents(cacheKey);
      if (cachedData) {
        console.log('[Cache] Using cached explore events data');
        return cachedData;
      }

      console.log('[API] Fetching explore events from server');
      const response = await EventQueriesService.getPublicEvents(currentPage, pageSize);
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao buscar eventos públicos');
      }
      
      const result = createEventResponse(
        response.data || [],
        response.metadata?.currentPage || 1,
        response.metadata?.totalPages || 1
      );
      
      cacheEvents(cacheKey, result);
      
      return result;
    },
    placeholderData: (previousData) => previousData
  });

  useEffect(() => {
    const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };
    
    if (metadata.currentPage < metadata.totalPages) {
      const nextPage = currentPage + 1;
      const nextPageCacheKey = getEventsCacheKey('exploreEvents', { page: nextPage, pageSize });
      
      if (!getCachedEvents(nextPageCacheKey)) {
        console.log(`[Prefetch] Pre-fetching page ${nextPage}`);
        EventQueriesService.getPublicEvents(nextPage, pageSize).then((apiResponse: any) => {
          if (apiResponse && !apiResponse.error && apiResponse.data) {
            const responseData = apiResponse.data as Event[];
            const responseMetadata = apiResponse.metadata || { totalPages: 1, currentPage: nextPage };
            
            const result = createEventResponse(
              responseData,
              nextPage,
              responseMetadata.totalPages || 1
            );
            cacheEvents(nextPageCacheKey, result);
          }
        });
      }
    }
  }, [currentPage, eventsData, pageSize]);

  const events = eventsData?.events || [];
  const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };

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
