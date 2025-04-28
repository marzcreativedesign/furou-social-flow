import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import MainLayout from "../components/MainLayout";
import EventTypeFilters from "../components/home/EventTypeFilters";
import { EventsService } from "@/services/events.service";
import EventLocationFilter from "@/components/events/EventLocationFilter";
import EventsGrid from "@/components/events/EventsGrid";
import type { Event, EventServiceResponse } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { getCache, setCache, generateCacheKey, isCacheStale } from "@/utils/clientCache";
import { useDebounce } from "@/utils/debounce";

interface EventsResponse {
  events: Event[];
  metadata: {
    totalPages: number;
    currentPage: number;
  };
}

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedLocation = useDebounce(locationQuery, 500);

  const cacheKey = generateCacheKey('events', { 
    page: currentPage, 
    pageSize, 
    filter: activeFilter,
    search: debouncedSearch,
    location: debouncedLocation
  });
  
  const isStale = isCacheStale(cacheKey);

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

  useEffect(() => {
    if (isStale && !isLoading) {
      console.log('Dados em cache expirados, atualizando em segundo plano');
      refetch();
    }
  }, [isStale, isLoading, refetch]);

  const events = eventsData?.events || [];
  const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };

  useEffect(() => {
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
  }, [currentPage, metadata.totalPages, pageSize, activeFilter, debouncedSearch, debouncedLocation]);

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

  const handleBackToHome = () => navigate('/');
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocationQuery(e.target.value);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout
      title="Eventos" 
      showBack 
      onBack={handleBackToHome} 
      showSearch 
      onSearch={setSearchQuery}
      rightContent={
        <EventLocationFilter
          locationQuery={locationQuery}
          onLocationChange={handleLocationChange}
          setLocationQuery={setLocationQuery}
        />
      }
    >
      <div className="px-4 py-4">
        <EventTypeFilters
          activeFilter={activeFilter}
          onFilterChange={(filter) => setActiveFilter(filter)}
        />
        
        {locationQuery && (
          <div className="bg-muted/30 p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <MapPin size={18} className="text-primary mr-2" />
              <span>Eventos em: <strong>{locationQuery}</strong></span>
            </div>
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setLocationQuery("")}
            >
              Limpar
            </button>
          </div>
        )}
        
        <EventsGrid
          events={filteredEvents}
          loading={isLoading}
          searchQuery={searchQuery}
          locationQuery={locationQuery}
          pagination={{
            currentPage: metadata.currentPage,
            totalPages: metadata.totalPages,
            onPageChange: handlePageChange
          }}
        />
      </div>
    </MainLayout>
  );
};

export default EventsPage;
