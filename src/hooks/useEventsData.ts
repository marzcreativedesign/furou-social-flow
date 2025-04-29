import { useState, useEffect } from "react";
import { EventsService } from "@/services/events.service";
import type { Event, EventServiceResponse } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { getCache, setCache, generateCacheKey } from "@/utils/clientCache";
import { isCacheStale } from "@/utils/eventCache";
import { useDebounce } from "@/utils/debounce";

interface EventsResponse {
  events: Event[];
  metadata: {
    totalPages: number;
    currentPage: number;
  };
}

export const useEventsData = (initialPage = 1, pageSize = 6) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed'>('all');
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedLocation = useDebounce(locationQuery, 500);

  // Generate cache key based on filters
  const cacheKey = generateCacheKey('events', { 
    page: currentPage, 
    pageSize, 
    filter: activeFilter,
    search: debouncedSearch,
    location: debouncedLocation
  });
  
  const isStale = isCacheStale(cacheKey);

  // Fetch events with react-query
  const { 
    data: eventsData, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['events', currentPage, pageSize, activeFilter, debouncedSearch, debouncedLocation],
    queryFn: async () => {
      console.time('fetchEvents');
      
      const cachedData = getCache<EventsResponse>(cacheKey);
      if (cachedData) {
        console.log('Usando dados em cache para eventos');
        console.timeEnd('fetchEvents');
        return cachedData;
      }

      console.log('Buscando dados do servidor para eventos');
      const response = await EventsService.getEvents(currentPage, pageSize) as EventServiceResponse;
      if (response.error) throw response.error;
      
      const result = { 
        events: response.data || [], 
        metadata: {
          totalPages: response.metadata?.totalPages || 1,
          currentPage: response.metadata?.currentPage || 1
        }
      };
      
      setCache(cacheKey, result, { 
        expireTimeInMinutes: 5,
        staleWhileRevalidate: true
      });
      
      console.timeEnd('fetchEvents');
      return result;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  // Prefetch next page if available
  useEffect(() => {
    const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };
    
    if (metadata.currentPage < metadata.totalPages) {
      const nextPage = currentPage + 1;
      const nextPageCacheKey = generateCacheKey('events', { 
        page: nextPage, 
        pageSize, 
        filter: activeFilter,
        search: debouncedSearch,
        location: debouncedLocation
      });
      
      if (!getCache<EventsResponse>(nextPageCacheKey)) {
        const prefetchTimer = setTimeout(() => {
          console.log(`Pré-carregando página ${nextPage}`);
          EventsService.getEvents(nextPage, pageSize)
            .then((response) => {
              if (response && !response.error && response.data) {
                const responseMetadata = 'metadata' in response ? response.metadata : undefined;
                
                setCache(nextPageCacheKey, { 
                  events: response.data, 
                  metadata: {
                    totalPages: responseMetadata?.totalPages || 1,
                    currentPage: nextPage
                  }
                }, { 
                  expireTimeInMinutes: 5,
                  staleWhileRevalidate: true
                });
              }
            })
            .catch(err => {
              console.error("Erro durante prefetch:", err);
            });
        }, 2000);
        
        return () => clearTimeout(prefetchTimer);
      }
    }
  }, [currentPage, eventsData?.metadata, pageSize, activeFilter, debouncedSearch, debouncedLocation]);

  // Check for stale cache and refetch if needed
  useEffect(() => {
    if (isStale && !isLoading) {
      console.log('Dados em cache expirados, atualizando em segundo plano');
      refetch();
    }
  }, [isStale, isLoading, refetch]);

  // Apply filters to events
  const events = eventsData?.events || [];
  const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };

  const filteredEvents = events.filter((event: Event) => {
    if (
      (activeFilter === 'public' && !event.is_public) || 
      (activeFilter === 'private' && event.is_public) || 
      (activeFilter === 'group' && !event.group_events?.length) || 
      (activeFilter === 'confirmed' && !event.event_participants?.some(p => p.status === 'confirmed')) || 
      (activeFilter === 'missed' && event.event_participants?.some(p => p.status === 'confirmed') !== false)
    ) {
      return false;
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(query);
      const matchesLocation = event.location?.toLowerCase().includes(query) || false;
      const matchesGroup = event.group_events?.[0]?.groups?.name?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesLocation && !matchesGroup) {
        return false;
      }
    }

    if (debouncedLocation && !event.location?.toLowerCase().includes(debouncedLocation.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    filteredEvents,
    isLoading,
    searchQuery,
    setSearchQuery,
    locationQuery,
    setLocationQuery,
    activeFilter,
    setActiveFilter,
    currentPage,
    metadata,
    handlePageChange
  };
};
