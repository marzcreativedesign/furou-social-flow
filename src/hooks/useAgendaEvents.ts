import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventParticipant } from "@/types/event";
import { isBefore, isToday, startOfDay } from "date-fns";

export const useAgendaEvents = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

        // Ensure data is properly typed with the correct status field
        const eventsWithParticipants = data?.map(event => {
          const eventParticipants = event.event_participants?.map(participant => ({
            ...participant,
            id: String(participant.id), // Convert to string as expected by type
            status: participant.status || "confirmed" // Use status from DB or default to confirmed
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
  }, []);

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

  // Check if a date has events
  const dateHasEvent = (day: Date) => {
    return getEventDates().some(eventDate => 
      eventDate.getDate() === day.getDate() && 
      eventDate.getMonth() === day.getMonth() && 
      eventDate.getFullYear() === day.getFullYear()
    );
  };

  // Function to check if a date is in the past
  const isPastDate = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(new Date())) && !isToday(date);
  };

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
