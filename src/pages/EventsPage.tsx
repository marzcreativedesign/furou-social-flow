
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import EventTypeFilters from "../components/home/EventTypeFilters";
import EventLocationFilter from "@/components/events/EventLocationFilter";
import EventsGrid from "@/components/events/EventsGrid";
import EventLocationBanner from "@/components/events/EventLocationBanner";
import { useEventsData } from "@/hooks/useEventsData";

const EventsPage = () => {
  const navigate = useNavigate();
  const { 
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
  } = useEventsData();

  const handleBackToHome = () => navigate('/');
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocationQuery(e.target.value);
  const handleClearLocation = () => setLocationQuery("");

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
        
        <EventLocationBanner 
          locationQuery={locationQuery} 
          onClearLocation={handleClearLocation} 
        />
        
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
