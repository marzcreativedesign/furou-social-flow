
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeData, FilterType } from "@/hooks/home/useHomeData";
import MainLayout from "@/components/MainLayout";
import EventsList from "@/components/home/EventsList";
import EventTypeFilters from "@/components/home/EventTypeFilters";
import SearchInput from "@/components/home/SearchInput";
import PendingActions from "@/components/home/PendingActions";
import PendingInvites from "@/components/home/PendingInvites";
import { EventSkeletonList } from "@/components/home/EventSkeleton";
import { Event } from "@/types/event";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const {
    loading,
    filteredEvents,
    publicEvents,
    pendingActions,
    pendingInvites,
    handlePendingActionComplete,
    handleInviteStatusUpdate
  } = useHomeData(searchQuery, activeFilter);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
  };

  // Transform events from useHomeData to match EventsList component props
  const formatEventsForList = (events: Event[]) => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      image_url: event.image_url,
      location: event.location || '',
      status: 'upcoming' as const, // Default to upcoming
      creator_id: event.creator_id,
      participants_count: (event as any).attendees || 0,
      is_group_event: (event as any).type === 'group', // Use type assertion for custom property
      is_public: event.is_public
    }));
  };

  return (
    <MainLayout title="Início">
      <div className="p-4 max-w-6xl mx-auto">
        <div className="mb-6">
          <SearchInput onSearch={handleSearch} />
        </div>
        
        {pendingActions.length > 0 && (
          <PendingActions 
            actions={pendingActions} 
            onActionComplete={handlePendingActionComplete} 
          />
        )}
        
        {pendingInvites && pendingInvites.length > 0 && (
          <PendingInvites 
            events={pendingInvites as any}
            loading={loading}
            onStatusUpdate={handleInviteStatusUpdate}
          />
        )}
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 dark:text-[#EDEDED]">Seus Eventos</h2>
          <EventTypeFilters 
            activeFilter={activeFilter} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {loading ? (
          <EventSkeletonList count={6} />
        ) : (
          <EventsList 
            title="Seus Eventos"
            events={formatEventsForList(filteredEvents)}
            emptyMessage="Você não tem eventos neste momento."
            onCreateEvent={() => navigate('/criar-evento')}
          />
        )}

        {activeFilter === 'all' && (
          <>
            <div className="mb-6 mt-10">
              <h2 className="text-xl font-bold dark:text-[#EDEDED]">Eventos Públicos</h2>
              <p className="text-muted-foreground mt-1 dark:text-[#B3B3B3]">
                Eventos abertos para todos participarem.
              </p>
            </div>

            {loading ? (
              <EventSkeletonList count={3} />
            ) : (
              <EventsList 
                title="Eventos Públicos"
                events={formatEventsForList(publicEvents)}
                emptyMessage="Nenhum evento público disponível."
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
