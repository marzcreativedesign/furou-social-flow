
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeData } from "@/hooks/useHomeData";
import MainLayout from "@/components/MainLayout";
import EventsList from "@/components/home/EventsList";
import EventTypeFilters from "@/components/home/EventTypeFilters";
import SearchInput from "@/components/home/SearchInput";
import PendingActions from "@/components/home/PendingActions";
import PendingInvites from "@/components/home/PendingInvites";
import { EventSkeletonList } from "@/components/home/EventSkeleton";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed'>('all');
  
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
            events={pendingInvites}
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
            events={filteredEvents} 
            emptyStateMessage="Você não tem eventos neste momento."
            emptyStateAction={() => navigate('/criar-evento')}
            emptyStateActionText="Criar Evento"
            className="mb-10"
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
                events={publicEvents}
                emptyStateMessage="Nenhum evento público disponível."
                className="mb-6"
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
