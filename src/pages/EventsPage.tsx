import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import MainLayout from "../components/MainLayout";
import EventTypeFilters from "../components/home/EventTypeFilters";
import { EventsService } from "@/services/events.service";
import EventLocationFilter from "@/components/events/EventLocationFilter";
import EventsGrid from "@/components/events/EventsGrid";
import type { Event } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { EventCacheService } from "@/services/event/cache/event-cache.service";

const EventsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;  // Reduced from 9 to 6 items per page for optimized loading
  
  // Clear cache when filters change
  useEffect(() => {
    const cacheKey = `user_events_${currentPage}_${pageSize}`;
    if (activeFilter !== 'all' || searchQuery || locationQuery) {
      EventCacheService.clearCache(cacheKey);
    }
  }, [activeFilter, searchQuery, locationQuery, currentPage, pageSize]);

  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['events', currentPage, pageSize, activeFilter],
    queryFn: async () => {
      const response = await EventsService.getEvents(currentPage, pageSize);
      
      if (response && typeof response === 'object' && 'error' in response && response.error) {
        throw response.error;
      }
      
      return { 
        events: response && typeof response === 'object' && 'data' in response ? response.data || [] : [], 
        metadata: {
          totalPages: response && typeof response === 'object' && 'metadata' in response && response.metadata ? response.metadata.totalPages || 1 : 1,
          currentPage: response && typeof response === 'object' && 'metadata' in response && response.metadata ? response.metadata.currentPage || 1 : 1
        }
      };
    },
    placeholderData: (previousData) => previousData, // Use this instead of keepPreviousData
    staleTime: 60 * 1000, // Data remains fresh for 1 minute
  });
  
  // Display error toast if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar eventos",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os eventos",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const events = eventsData?.events || [];
  const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };

  const filteredEvents = Array.isArray(events) ? events.filter((event: Event) => {
    if (
      (activeFilter === 'public' && !event.is_public) || 
      (activeFilter === 'private' && event.is_public) || 
      (activeFilter === 'group' && !event.group_events?.length) || 
      (activeFilter === 'confirmed' && !event.event_participants?.some(p => p.status === 'confirmed')) || 
      (activeFilter === 'missed' && event.event_participants?.some(p => p.status === 'confirmed') !== false)
    ) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(query);
      const matchesLocation = event.location?.toLowerCase().includes(query) || false;
      const matchesGroup = event.group_events?.[0]?.groups?.name?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesLocation && !matchesGroup) {
        return false;
      }
    }

    if (locationQuery && !event.location?.toLowerCase().includes(locationQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];

  const handleBackToHome = () => navigate('/');
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocationQuery(e.target.value);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when changing pages
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
