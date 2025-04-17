
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import MainLayout from "../components/MainLayout";
import EventTypeFilters from "../components/home/EventTypeFilters";
import { EventsService } from "@/services/events.service";
import EventLocationFilter from "@/components/events/EventLocationFilter";
import EventsGrid from "@/components/events/EventsGrid";
import type { Event } from "@/types/event";
import { useQuery } from "@tanstack/react-query";

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;  // Número de itens por página

  const { data, isLoading } = useQuery({
    queryKey: ['events', currentPage, pageSize],
    queryFn: async () => {
      const { data, metadata, error } = await EventsService.getEvents(currentPage, pageSize);
      if (error) throw error;
      return { events: data, metadata };
    },
    keepPreviousData: true // Mantém os dados antigos enquanto carrega novos
  });

  const events = data?.events || [];
  const metadata = data?.metadata || { totalPages: 1, currentPage: 1 };

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
  });

  const handleBackToHome = () => navigate('/');
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocationQuery(e.target.value);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll para o topo ao mudar de página
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
