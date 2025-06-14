
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";

const HomePage = () => {
  const { user } = useAuth();
  const { events, publicEvents, loading } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const allEvents = [...(events || []), ...(publicEvents || [])];
  
  const filteredEvents = allEvents.filter(event => {
    if (activeFilter === 'public' && !event.is_public) return false;
    if (activeFilter === 'private' && event.is_public) return false;
    if (activeFilter === 'confirmed') {
      const userParticipation = event.event_participants?.find(p => p.user_id === user?.id);
      if (!userParticipation || userParticipation.status !== 'confirmed') return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return event.title.toLowerCase().includes(query) || 
             (event.location && event.location.toLowerCase().includes(query));
    }
    
    return true;
  });

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Furou Social Flow</h1>
          <p className="text-lg text-center mb-8 max-w-md">
            Organize eventos, convide amigos e nunca mais "fure" um compromisso!
          </p>
          <Link to="/auth">
            <Button size="lg">Entrar / Cadastrar</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Início">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link to="/criar">
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <EventFilters 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {loading ? (
          <div className="grid gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 mt-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum evento encontrado</p>
                <Link to="/criar" className="mt-4 inline-block">
                  <Button>Criar primeiro evento</Button>
                </Link>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showParticipationButton
                />
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
