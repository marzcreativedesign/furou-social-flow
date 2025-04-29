
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import MainLayout from "@/components/MainLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { EventsService } from "@/services/events.service";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";
import type { Event } from "@/types/event";

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: async () => {
      const { data, error } = await EventsService.getEvents();
      if (error) throw error;
      return data || [];
    },
  });

  const getEventsForDate = (date: Date): Event[] => {
    if (!eventsData) return [];
    return eventsData.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const eventsForSelectedDate = getEventsForDate(date);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/evento/${eventId}`);
  };

  const renderEvents = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <div key={i} className="mb-3">
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ));
    }
    
    if (eventsForSelectedDate.length === 0) {
      return (
        <div className="text-center p-8">
          <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Nenhum evento nesta data</p>
          <Button 
            onClick={() => navigate('/criar')} 
            variant="outline" 
            className="mt-4"
          >
            Criar Evento
          </Button>
        </div>
      );
    }
    
    return eventsForSelectedDate.map(event => (
      <div 
        key={event.id} 
        className="bg-card border rounded-lg p-4 mb-3 cursor-pointer hover:border-primary transition-colors"
        onClick={() => handleEventClick(event.id)}
      >
        <h3 className="font-medium">{event.title}</h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(event.date), "HH:mm", { locale: ptBR })}
        </p>
        {event.location && (
          <p className="text-sm text-muted-foreground mt-1">
            {event.location}
          </p>
        )}
      </div>
    ));
  };

  return (
    <MainLayout title="Agenda" showBack onBack={handleBack}>
      <div className="p-4">
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            locale={ptBR}
          />
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">
            Eventos em {format(date, "dd 'de' MMMM", { locale: ptBR })}
          </h2>
          
          <div className="space-y-2">
            {renderEvents()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarView;
