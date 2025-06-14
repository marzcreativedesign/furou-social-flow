import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import EventCard from "@/components/EventCard";
import EventFilters, { EventFilters as EventFiltersType } from "@/components/EventFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";

const HomePage = () => {
  const { user } = useAuth();
  const { events, publicEvents, loading } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EventFiltersType>({
    type: 'all',
    date: 'all',
  });

  const allEvents = [...(events || []), ...(publicEvents || [])];

  const filteredEvents = allEvents.filter(event => {
    // Type-based filtering
    if (filters.type === 'public' && !event.is_public) return false;
    if (filters.type === 'private' && event.is_public) return false;
    if (filters.type === 'confirmed') {
      const userParticipation = event.event_participants?.find(p => p.user_id === user?.id);
      if (!userParticipation || userParticipation.status !== 'confirmed') return false;
    }
    if (filters.type === 'missed') {
      // You may want to implement this as needed
      return false;
    }
    // Date-based filtering could go here -- implement as needed

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!event.title.toLowerCase().includes(query) &&
          !(event.location && event.location.toLowerCase().includes(query))) {
        return false;
      }
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
          onFilterChange={setFilters}
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
              filteredEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  imageUrl={event.image_url || ""}
                  attendees={event.event_participants ? event.event_participants.length : 0}
                  confirmed={event.event_participants?.some((p: any) =>
                    p.user_id === user?.id && p.status === "confirmed"
                  )}
                  type={event.is_public ? "public" : "private"}
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
