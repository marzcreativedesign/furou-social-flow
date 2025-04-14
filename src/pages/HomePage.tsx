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

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                   user?.user_metadata?.name?.split(' ')[0] || 
                   "Usuário";

  const {
    loading,
    filteredEvents,
    publicEvents,
    pendingActions,
    handlePendingActionComplete
  } = useHomeData(searchQuery, activeFilter);

  useEffect(() => {
    if (!loading) {
      setIsContentLoaded(true);
    }
  }, [loading]);

  return (
    <MainLayout title="Furou?!" showSearch onSearch={setSearchQuery} showDock>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-3 dark:text-[#EDEDED]">Olá, {firstName} 👋</h1>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className={`transition-opacity duration-300 ${isContentLoaded ? 'opacity-100' : 'opacity-0'}`}>
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
              showViewAll
              viewAllLink="/eventos?filter=public"
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
