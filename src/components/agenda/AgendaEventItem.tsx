
import React from "react";
import { Clock, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event } from "@/types/event";

interface AgendaEventItemProps {
  event: Event;
  onClick: () => void;
  getEventTypeBadge: (event: Event) => string;
}

const AgendaEventItem = ({ 
  event, 
  onClick,
  getEventTypeBadge
}: AgendaEventItemProps) => {
  const isPastEvent = new Date(event.date) < new Date();
  const eventDate = parseISO(event.date);
  const confirmedCount = event.event_participants?.filter(p => p.status === 'confirmed').length || 0;
  
  return (
    <div 
      className={`p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer ${
        isPastEvent ? 'opacity-80' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{event.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>{format(eventDate, 'HH:mm', { locale: ptBR })}</span>
            <span className="mx-2">•</span>
            <span>{event.location || 'Local não definido'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPastEvent ? (
            <Badge className="bg-gray-500 text-white flex items-center gap-1">
              <Flag className="h-3 w-3" />
              <span>Finalizado</span>
            </Badge>
          ) : (
            <Badge className={`${getEventTypeBadge(event)} text-white`}>
              {event.is_public ? 'Público' : 'Privado'}
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {confirmedCount} {confirmedCount === 1 ? 'participante confirmado' : 'participantes confirmados'}
      </div>
    </div>
  );
};

export default AgendaEventItem;
