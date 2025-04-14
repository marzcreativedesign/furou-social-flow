
import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for events
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Churrasco na Casa do João",
    date: new Date(2025, 3, 20),
    time: "18:00",
    location: "Casa do João",
    type: "social"
  },
  {
    id: "2",
    title: "Reunião de Projeto",
    date: new Date(2025, 3, 15),
    time: "14:00",
    location: "Escritório Central",
    type: "work"
  },
  {
    id: "3",
    title: "Cinema com Amigos",
    date: new Date(2025, 3, 18),
    time: "20:30",
    location: "Shopping Center",
    type: "entertainment"
  },
  {
    id: "4",
    title: "Aniversário da Maria",
    date: new Date(2025, 3, 25),
    time: "19:00",
    location: "Restaurante Italiano",
    type: "celebration"
  }
];

const AgendaPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<typeof MOCK_EVENTS>([]);

  // Function to format date to string in Brazilian Portuguese
  const formatDatePtBR = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return MOCK_EVENTS.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get dates that have events
  const getEventDates = () => {
    return MOCK_EVENTS.map(event => event.date);
  };

  // Update selected date events when date changes
  React.useEffect(() => {
    setSelectedDateEvents(getEventsForDate(date));
  }, [date]);

  // Get badge color based on event type
  const getEventTypeBadge = (type: string) => {
    switch(type) {
      case 'social':
        return 'bg-blue-500';
      case 'work':
        return 'bg-green-500';
      case 'entertainment':
        return 'bg-purple-500';
      case 'celebration':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Determine if a date has events
  const dateHasEvent = (day: Date) => {
    return getEventDates().some(eventDate => 
      eventDate.getDate() === day.getDate() && 
      eventDate.getMonth() === day.getMonth() && 
      eventDate.getFullYear() === day.getFullYear()
    );
  };

  return (
    <MainLayout title="Agenda">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Sua Agenda</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  modifiers={{
                    hasEvent: (day) => dateHasEvent(day)
                  }}
                  modifiersStyles={{
                    hasEvent: { 
                      fontWeight: 'bold', 
                      textDecoration: 'underline', 
                      color: 'var(--accent)' 
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Lista de eventos do dia selecionado */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {date ? formatDatePtBR(date) : 'Selecione uma data'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/evento/${event.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{event.time}</span>
                              <span className="mx-2">•</span>
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <Badge className={`${getEventTypeBadge(event.type)} text-white`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Não há eventos agendados para esta data.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/criar'}
                      className="mt-4 text-sm text-primary hover:underline"
                    >
                      + Adicionar novo evento
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AgendaPage;
