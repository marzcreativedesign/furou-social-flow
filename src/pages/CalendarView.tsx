import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  List, 
  ArrowLeft, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { EventsService } from "@/services/events.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Event } from "@/hooks/useHomeData"; // Reuse the Event interface

const CalendarView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateSelect = (day: Date | undefined) => {
    if (day) {
      setDate(day);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const response = await EventsService.getEvents();
        
        if (response && 'error' in response && response.error) {
          console.error("Error fetching events:", response.error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus eventos",
            variant: "destructive",
          });
          return;
        }
        
        if (response && 'data' in response && response.data) {
          const formattedEvents: Event[] = response.data.map(event => {
            // Safely access group_events that might be undefined
            const groupInfo = event.group_events && event.group_events[0]?.groups 
              ? event.group_events[0].groups 
              : null;
            
            return {
              ...event,
              confirmed: event.event_participants && event.event_participants.some(p => p.status === 'confirmed'),
              type: event.is_public ? "public" : (groupInfo ? "group" : "private"),
              groupName: groupInfo?.name || null,
              attendees: event.event_participants?.length || 0,
              date: event.date // Keep original date for calendar
            };
          });
          
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar seus eventos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [user, toast]);

  const selectedDateEvents = useMemo(() => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    }).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [date, events]);

  const datesWithEvents = useMemo(() => {
    return events.map(event => new Date(event.date));
  }, [events]);

  const getEventsForMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysWithEvents: {date: Date, events: Event[]}[] = [];
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      
      const eventsOnDay = events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === currentDate.getDate() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      });
      
      if (eventsOnDay.length > 0) {
        daysWithEvents.push({
          date: currentDate,
          events: eventsOnDay.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        });
      }
    }
    
    return daysWithEvents;
  };

  const monthDaysWithEvents = useMemo(() => {
    return getEventsForMonth();
  }, [currentMonth, events]);

  const navigateToEvent = (eventId: string) => {
    navigate(`/evento/${eventId}`);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <MainLayout title="Agenda" showDock>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 opacity-70" />
            <h2 className="text-xl font-semibold">
              {view === "calendar" ? "Calendário" : "Lista de Eventos"}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Calendário
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>
        </div>

        {view === "calendar" ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="border rounded-md p-3"
                modifiers={{ hasEvent: datesWithEvents }}
                modifiersStyles={{
                  hasEvent: { 
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255, 138, 30, 0.1)',
                    color: '#FF8A1E',
                    borderRadius: '4px'
                  }
                }}
              />
            </div>
            
            <div className="md:w-1/2">
              <div className="border rounded-md p-4">
                <h3 className="font-medium text-lg mb-3">
                  {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map(event => (
                      <div 
                        key={event.id}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigateToEvent(event.id)}
                      >
                        <div className={`w-2 h-10 rounded-full ${
                          event.confirmed ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                            {event.location && ` • ${event.location}`}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 opacity-50" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum evento nesta data</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate('/criar')}
                    >
                      Criar evento
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <h3 className="text-lg font-medium">
                {currentMonth.toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})}
              </h3>
              
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : monthDaysWithEvents.length > 0 ? (
              monthDaysWithEvents.map(day => (
                <div key={day.date.toString()} className="border rounded-md">
                  <div className="bg-muted p-3 font-medium">
                    {day.date.toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric'})}
                  </div>
                  <div className="p-2">
                    {day.events.map(event => (
                      <div 
                        key={event.id}
                        className="flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigateToEvent(event.id)}
                      >
                        <div className={`w-2 h-10 rounded-full ${
                          event.confirmed ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                            {event.location && ` • ${event.location}`}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 opacity-50" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-2">Nenhum evento em {currentMonth.toLocaleDateString('pt-BR', {month: 'long'})}</p>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/criar')}
                >
                  Criar evento
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CalendarView;
