
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event } from "@/types/event";
import AgendaEventItem from "./AgendaEventItem";

interface AgendaEventsListProps {
  date: Date | undefined;
  events: Event[];
  loading: boolean;
  onEventClick: (eventId: string) => void;
  onAddEventClick: () => void;
  getEventTypeBadge: (event: Event) => string;
}

const AgendaEventsList = ({
  date,
  events,
  loading,
  onEventClick,
  onAddEventClick,
  getEventTypeBadge
}: AgendaEventsListProps) => {
  // Function to format date to string in Brazilian Portuguese
  const formatDatePtBR = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {date ? formatDatePtBR(date) : 'Selecione uma data'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando eventos...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <AgendaEventItem 
                key={event.id} 
                event={event} 
                onClick={() => onEventClick(event.id)} 
                getEventTypeBadge={getEventTypeBadge}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Não há eventos agendados para esta data.
            </p>
            <Button 
              onClick={onAddEventClick}
              className="mt-4 text-sm text-primary hover:underline"
            >
              + Adicionar novo evento
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgendaEventsList;
