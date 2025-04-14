
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CostCalculator from "@/components/CostCalculator";
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
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Usuário";

  const {
    loading,
    filteredEvents,
    publicEvents,
    pendingActions,
    handlePendingActionComplete
  } = useHomeData(searchQuery, activeFilter);

  return (
    <MainLayout title="Furou?!" showSearch onSearch={setSearchQuery} showDock>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-3 dark:text-[#EDEDED]">Olá, {userName} 👋</h1>
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

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="mr-2 px-0 dark:text-[#EDEDED] hover:bg-accent dark:hover:bg-[#262626]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-settings mr-2 h-4 w-4"
            >
              <path d="M12.22 2.02h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73-.73H2.02a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 0 2l-.08.15a2 2 0 0 0-.73 2.73v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73.73h.18a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.73-1l-.25-.43a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73v-.18a2 2 0 0 0-2-2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1-1.73l-.43-.25a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73Z" />
              <path d="M12 8v8" />
            </svg>
            Calculadora
          </Button>
        </SheetTrigger>
        <SheetContent className="dark:bg-card dark:border-[#2C2C2C]">
          <h2 className="text-xl font-bold mb-4 dark:text-[#EDEDED]">Calculadora de Rateio</h2>
          <p className="text-muted-foreground mb-4 dark:text-[#B3B3B3]">
            Divida facilmente o valor de um evento entre os participantes
          </p>
          <CostCalculator isDrawer />
          
          <Button className="w-full mt-4 dark:bg-primary dark:hover:bg-accent" onClick={() => navigate("/calculadora")}>
            Abrir calculadora completa
          </Button>
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
};

export default HomePage;
