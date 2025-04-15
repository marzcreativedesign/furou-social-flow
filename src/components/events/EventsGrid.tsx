
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { useNavigate } from "react-router-dom";
import type { Event } from "@/types/event";

interface EventsGridProps {
  events: Event[];
  loading: boolean;
  searchQuery: string;
  locationQuery: string;
}

const EventsGrid = ({ events, loading, searchQuery, locationQuery }: EventsGridProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery || locationQuery ? "Não encontramos eventos com esses filtros." : "Não há eventos disponíveis no momento."}
        </p>
        <Button onClick={() => navigate('/criar')}>Criar um evento</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(event => (
        <div key={event.id} onClick={() => navigate(`/evento/${event.id}`)} className="cursor-pointer">
          <EventCard 
            id={event.id} 
            title={event.title} 
            date={new Date(event.date).toLocaleString('pt-BR', {
              weekday: 'long',
              hour: 'numeric',
              minute: 'numeric'
            })}
            location={event.location || ''} 
            imageUrl={event.image_url || ''} 
            attendees={event.event_participants?.length || 0}
            confirmed={event.event_participants?.some(p => p.status === 'confirmed')}
            type={event.is_public ? "public" : event.group_events?.length ? "group" : "private"}
            groupName={event.group_events?.[0]?.groups?.name}
            size="large" 
          />
        </div>
      ))}
    </div>
  );
};

export default EventsGrid;
