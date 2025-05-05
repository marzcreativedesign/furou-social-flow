
import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isBefore, isToday, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Event, EventParticipant } from "@/types/event";

const AgendaPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Buscar eventos do banco de dados
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            event_participants(*)
          `)
          .order('date', { ascending: true });

        if (error) {
          console.error("Erro ao buscar eventos:", error);
          return;
        }

        // Mapear os dados para garantir que event_participants tenha o campo status
        const eventsWithParticipantsStatus = data?.map(event => {
          // Adicionar o campo status para cada participante
          const eventParticipants = event.event_participants?.map(participant => ({
            ...participant,
            id: String(participant.id), // Converter para string conforme esperado pelo tipo
            status: "confirmed" // Adicionando status padrão para todos os participantes
          })) as EventParticipant[];
          
          return {
            ...event,
            event_participants: eventParticipants
          } as Event;
        }) || [];

        setAllEvents(eventsWithParticipantsStatus);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Function to format date to string in Brazilian Portuguese
  const formatDatePtBR = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date || !allEvents.length) return [];
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  // Get dates that have events
  const getEventDates = () => {
    return allEvents.map(event => new Date(event.date));
  };

  // Update selected date events when date changes
  useEffect(() => {
    if (date) {
      setSelectedDateEvents(getEventsForDate(date));
    }
  }, [date, allEvents]);

  // Get badge color based on event type
  const getEventTypeBadge = (event: Event) => {
    const isPastEvent = new Date(event.date) < new Date();
    
    if (isPastEvent) {
      return 'bg-gray-500';
    }
    
    if (event.is_public) {
      return 'bg-blue-500';
    } else {
      return 'bg-green-500';
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

  const navigateToEventDetail = (eventId: string) => {
    navigate(`/eventos/${eventId}`);
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
                  <div className="text-center py-4">
                    <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Carregando eventos...</p>
                  </div>
                ) : selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => {
                      const isPastEvent = new Date(event.date) < new Date();
                      const eventDate = parseISO(event.date);
                      const confirmedCount = event.event_participants?.filter(p => p.status === 'confirmed').length || 0;
                      
                      return (
                        <div 
                          key={event.id}
                          className={`p-4 border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer ${
                            isPastEvent ? 'opacity-80' : ''
                          }`}
                          onClick={() => navigateToEventDetail(event.id)}
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
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Não há eventos agendados para esta data.
                    </p>
                    <Button 
                      onClick={() => navigate('/criar')}
                      className="mt-4 text-sm text-primary hover:underline"
                    >
                      + Adicionar novo evento
                    </Button>
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
