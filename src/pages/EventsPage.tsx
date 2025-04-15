
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await EventsService.getUserEvents();
      return data || [];
    }
  });

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
        />
      </div>
    </MainLayout>
  );
};

export default EventsPage;
