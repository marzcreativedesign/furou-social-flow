
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventParticipant } from "@/types/event";
import { isBefore, isToday, startOfDay } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export const useAgendaEvents = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            event_participants(*)
          `)
          .or(`creator_id.eq.${user.id},event_participants.user_id.eq.${user.id}`)
          .order('date', { ascending: true });

        if (error) {
          console.error("Erro ao buscar eventos:", error);
          return;
        }

        const eventsWithParticipants = data?.map(event => {
          const eventParticipants = event.event_participants?.map(participant => ({
            ...participant,
            id: String(participant.id),
            status: participant.status || "confirmed"
          })) as EventParticipant[];
          return {
            ...event,
            event_participants: eventParticipants
          } as Event;
        }) || [];

        setAllEvents(eventsWithParticipants);
        console.log("[AgendaEvents] Eventos carregados:", eventsWithParticipants);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  // Melhoria na checagem de data: considera corretamento timezones/dia
  const getEventsForDate = (date: Date | undefined) => {
    if (!date || !allEvents.length) return [];
    // Força checagem pelo mesmo dia, mês, ano (ignorando horas/minutos)
    const result = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      // Comparação baseada apenas no 'yyyy-mm-dd'
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
    console.log("[AgendaEvents] Eventos para data", date, ":", result);
    return result;
  };

  const getEventDates = () => {
    return allEvents.map(event => new Date(event.date));
  };

  const dateHasEvent = (day: Date) => {
    return getEventDates().some(eventDate => 
      eventDate.getDate() === day.getDate() && 
      eventDate.getMonth() === day.getMonth() && 
      eventDate.getFullYear() === day.getFullYear()
    );
  };

  // Agora considera events como finalizados APENAS se estão antes de hoje
  const isPastDate = (date: Date) => {
    // Retorna true se a data for anterior ao dia de hoje (ignora horas/minutos)
    const dayToCheck = startOfDay(date);
    const today = startOfDay(new Date());
    return isBefore(dayToCheck, today);
  };

  const getEventTypeBadge = (event: Event) => {
    // Um evento só é "finalizado" se a data já passou (não considera hoje como passado)
    const eventDate = new Date(event.date);
    const isPastEvent = isPastDate(eventDate);
    if (isPastEvent) {
      return 'bg-gray-500';
    }
    if (event.is_public) {
      return 'bg-blue-500';
    } else {
      return 'bg-green-500';
    }
  };

  return {
    allEvents,
    loading,
    getEventsForDate,
    getEventDates,
    dateHasEvent,
    isPastDate,
    getEventTypeBadge
  };
};
