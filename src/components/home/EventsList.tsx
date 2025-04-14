import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  image_url: string | null;
  attendees?: number;
  confirmed?: boolean;
  type?: "public" | "private" | "group";
  groupName?: string | null;
}

interface EventsListProps {
  title: string;
  events: Event[];
  showViewAll?: boolean;
  emptyMessage?: string;
  onCreateEvent?: () => void;
  viewAllLink?: string;
}

// Using memo to prevent unnecessary re-renders when parent components update
const EventsList = memo(({ 
  title, 
  events, 
  showViewAll = false,
  emptyMessage = "Nenhum evento disponível",
  onCreateEvent,
  viewAllLink
}: EventsListProps) => {
  const navigate = useNavigate();

  const renderParticipants = (participants: any[], type: string) => {
    const maxVisible = 5;
    const overflow = participants.length - maxVisible;
    const visibleParticipants = participants.slice(0, maxVisible);
    
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {visibleParticipants.map(participant => (
          <div
            key={participant.id}
            className="w-8 h-8 rounded-full overflow-hidden border-2"
            style={{
              borderColor: type === 'confirmed' ? '#4CAF50' : 
                         type === 'pending' ? '#FFA000' : '#FF4C4C'
            }}
          >
            <img 
              src={participant.imageUrl} 
              alt={participant.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {overflow > 0 && (
          <span className="text-sm font-medium text-muted-foreground">
            +{overflow} {type === 'confirmed' ? 'confirmados' : 
                        type === 'pending' ? 'pendentes' : 'furaram'}
          </span>
        )}
      </div>
    );
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/evento/${eventId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-[#EDEDED]">{title}</h2>
        {showViewAll && viewAllLink && (
          <Button variant="ghost" size="sm" onClick={() => navigate(viewAllLink)} className="dark:text-[#FFA756] dark:hover:bg-[#262626]">
            Ver todos
          </Button>
        )}
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div 
              key={event.id} 
              onClick={() => handleEventClick(event.id)} 
              className="cursor-pointer"
              style={{ minHeight: "200px" }} // Prevent layout shift by reserving space
            >
              <EventCard 
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location || "Local não definido"}
                imageUrl={event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3"}
                attendees={event.attendees || 0}
                confirmed={event.confirmed}
                type={event.type}
                groupName={event.groupName}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/20 dark:bg-[#262626]/50 rounded-xl">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground dark:text-[#B3B3B3] mb-2" />
          <p className="text-muted-foreground dark:text-[#B3B3B3] mb-4">
            {emptyMessage}
          </p>
          {onCreateEvent && (
            <Button onClick={onCreateEvent} className="dark:bg-primary dark:hover:bg-accent">
              Criar Evento
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

EventsList.displayName = "EventsList";

export default EventsList;
