
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import EventTypeFilters from "../components/home/EventTypeFilters";
import EventLocationFilter from "@/components/events/EventLocationFilter";
import EventsGrid from "@/components/events/EventsGrid";
import EventLocationBanner from "@/components/events/EventLocationBanner";
import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";

const EventsPage = () => {
  const navigate = useNavigate();
  const { events, publicEvents, loading } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const handleBackToHome = () => navigate('/');
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocationQuery(e.target.value);
  const handleClearLocation = () => setLocationQuery("");

  // Combine and filter events
  const allEvents = [...(events || []), ...(publicEvents || [])];
  let filteredEvents = allEvents;
  if (activeFilter !== 'all') {
    filteredEvents = filteredEvents.filter(e =>
      activeFilter === 'public'
        ? e.is_public
        : activeFilter === 'private'
          ? !e.is_public
          : true
    );
  }
  if (searchQuery) {
    filteredEvents = filteredEvents.filter(e =>
      e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  if (locationQuery) {
    filteredEvents = filteredEvents.filter(e =>
      e.location && e.location.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }

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
          onFilterChange={setActiveFilter}
        />
        
        <EventLocationBanner 
          locationQuery={locationQuery} 
          onClearLocation={handleClearLocation} 
        />
        
        <EventsGrid
          events={filteredEvents}
          loading={loading}
          searchQuery={searchQuery}
          locationQuery={locationQuery}
          pagination={{
            currentPage,
            totalPages: 1,
            onPageChange: setCurrentPage
          }}
        />
      </div>
    </MainLayout>
  );
};

export default EventsPage;
