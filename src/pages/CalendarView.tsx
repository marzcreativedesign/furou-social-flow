
import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isBefore, isToday, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EventsService } from "@/services/events.service";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string | null;
  type: string;
  group_events?: {
    id: string;
    group_id: string;
    groups?: { 
      id: string;
      name: string 
    };
  }[];
}

const CalendarView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to format date to string in Brazilian Portuguese
  const formatDatePtBR = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await EventsService.getUserEvents();
        
        if (error) {
          console.error("Error fetching events:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus eventos",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          const formattedEvents = data.map(event => {
            const eventDate = new Date(event.date);
            const timeString = eventDate.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const groupInfo = event.group_events?.[0]?.groups || null;
            
            return {
              id: event.id,
              title: event.title,
              date: eventDate,
              time: timeString,
              location: event.location,
              group_events: event.group_events,
              type: event.is_public ? "public" : (groupInfo ? "group" : "private")
            };
          });
          
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os eventos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [user, toast]);

  // Get events for a specific date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get dates that have events
  const getEventDates = () => {
    return events.map(event => event.date);
  };

  // Update selected date events when date changes
  React.useEffect(() => {
    setSelectedDateEvents(getEventsForDate(date));
  }, [date, events]);

  // Get badge color based on event type
  const getEventTypeBadge = (type: string) => {
    switch(type) {
      case 'public':
        return 'bg-blue-500';
      case 'private':
        return 'bg-green-500';
      case 'group':
        return 'bg-purple-500';
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

  // Function to style past dates
  const modifiersStyles = {
    pastDate: {
      color: "rgb(176, 176, 176)", // #B0B0B0
      opacity: 0.6,
    },
    hasEvent: { 
      fontWeight: 'bold', 
      textDecoration: 'underline', 
      color: 'var(--accent)' 
    }
  };

  // Function to check if a date is in the past
  const isPastDate = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(new Date())) && !isToday(date);
  };

  return (
    <MainLayout title="Agenda">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Sua Agenda</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md pointer-events-auto"
                    modifiers={{
                      hasEvent: (day) => dateHasEvent(day),
                      pastDate: (day) => isPastDate(day)
                    }}
                    modifiersStyles={modifiersStyles}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Selected date events list */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {date ? formatDatePtBR(date) : 'Selecione uma data'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer ${
                          isPastDate(event.date) ? 'opacity-60' : ''
                        }`}
                        onClick={() => navigate(`/evento/${event.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{event.time}</span>
                              <span className="mx-2">•</span>
                              <span>{event.location || 'Local não definido'}</span>
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
                      onClick={() => navigate('/criar')}
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

export default CalendarView;
