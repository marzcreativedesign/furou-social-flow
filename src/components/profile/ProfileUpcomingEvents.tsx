
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
}

interface ProfileUpcomingEventsProps {
  events: Event[];
  loading: boolean;
}

export const ProfileUpcomingEvents: React.FC<ProfileUpcomingEventsProps> = ({ events, loading }) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Próximos Eventos</h3>
        {[1, 2, 3].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!events || events.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Próximos Eventos</h3>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <CalendarIcon className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum evento futuro</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Próximos Eventos</h3>
      <div className="space-y-3">
        {events.map(event => (
          <Card 
            key={event.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate(`/evento/${event.id}`)}
          >
            <CardContent className="p-3">
              <div>
                <h4 className="font-medium text-sm">{event.title}</h4>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {format(parseISO(event.date), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                  {event.location && <span className="ml-2">• {event.location}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
