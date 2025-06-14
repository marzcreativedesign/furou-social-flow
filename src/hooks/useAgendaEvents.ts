
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
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const getEventsForDate = (date: Date | undefined) => {
    if (!date || !allEvents.length) return [];
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
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

  const isPastDate = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(new Date())) && !isToday(date);
  };

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
