
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import PendingActions from "@/components/home/PendingActions";
import EventTypeFilters from "@/components/home/EventTypeFilters";
import EventsList from "@/components/home/EventsList";
import SearchInput from "@/components/home/SearchInput";
import { useHomeData } from "@/hooks/useHomeData";

type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';

// Interface to match the props expected by EventsList
interface Event {
  id: string;
  title: string;
  date: string;
  image_url?: string;
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  creator_id: string;
  participants_count: number;
  is_group_event: boolean;
  is_public: boolean;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                   user?.user_metadata?.name?.split(' ')[0] || 
                   "Usuário";

  const {
    loading,
    filteredEvents: homeEvents,
    publicEvents: homePublicEvents,
    pendingActions,
    handlePendingActionComplete
  } = useHomeData(searchQuery, activeFilter);

  // Convert the events from useHomeData to match the required Event interface
  const convertEvent = (event: any): Event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    image_url: event.image_url,
    location: event.location,
    status: event.confirmed ? 'upcoming' : 'cancelled',
    creator_id: event.creator_id,
    participants_count: event.attendees || 0,
    is_group_event: event.type === 'group',
    is_public: event.is_public
  });

  const filteredEvents: Event[] = homeEvents.map(convertEvent);
  const publicEvents: Event[] = homePublicEvents.map(convertEvent);

  return (
    <MainLayout title="Furou?!" showSearch onSearch={setSearchQuery} showDock>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-3 dark:text-[#EDEDED]">Olá, {firstName} 👋</h1>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        <PendingActions 
          actions={pendingActions} 
          onActionComplete={handlePendingActionComplete} 
        />

        <EventTypeFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        <div className="mb-8">
          <EventsList 
            title="Seus Eventos"
            events={filteredEvents}
            loading={loading}
            showViewAll
            viewAllLink="/eventos"
            emptyMessage={searchQuery ? `Nenhum evento encontrado para "${searchQuery}"` : "Você não tem eventos ativos no momento"}
            onCreateEvent={() => navigate("/criar")}
          />
        </div>

        {!searchQuery && (
          <EventsList 
            title="Eventos Públicos"
            events={publicEvents}
            loading={loading}
            showViewAll
            viewAllLink="/eventos?filter=public"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
