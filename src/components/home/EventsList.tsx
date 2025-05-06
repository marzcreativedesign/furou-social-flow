
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import EventCard from "../EventCard";
import { EventSkeletonList } from "./EventSkeleton";

interface Event {
  id: string;
  title: string;
  date: string;
  image_url?: string;
  location?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  creator_id?: string;
  participants_count?: number;
  is_public?: boolean;
}

interface EventsListProps {
  title: string;
  events?: Event[];
  loading?: boolean;
  showViewAll?: boolean;
  viewAllLink?: string;
  emptyMessage?: string;
  onCreateEvent?: () => void;
}

const EventsList = ({
  title,
  events = [],
  loading = false,
  showViewAll = false,
  viewAllLink = "/eventos",
  emptyMessage = "Nenhum evento encontrado",
  onCreateEvent
}: EventsListProps) => {
  const isEmpty = events.length === 0 && !loading;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-[#EDEDED]">{title}</h2>
        {showViewAll && events.length > 0 && (
          <Link to={viewAllLink} className="text-primary hover:underline text-sm">
            Ver todos
          </Link>
        )}
      </div>

      {loading ? (
        <EventSkeletonList count={3} />
      ) : isEmpty ? (
        <div className="bg-muted/40 dark:bg-gray-800/40 rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">{emptyMessage}</p>
          {onCreateEvent && (
            <Button onClick={onCreateEvent} className="gap-1">
              <PlusCircle size={16} />
              <span>Criar Evento</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => {
            const isPastEvent = new Date(event.date) < new Date();
            
            return (
              <EventCard 
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location || ''}
                imageUrl={event.image_url || ''}
                attendees={event.participants_count || 0}
                type={event.is_public ? "public" : "private"}
                confirmed={event.status === 'upcoming' || event.status === 'ongoing'}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsList;
