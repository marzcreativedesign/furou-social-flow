
import { useState, useMemo } from "react";
import { Event, EventParticipant } from "@/types/event";
import { isBefore, isToday, startOfDay } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { mockEvents } from "@/data/mockData";

export const useAgendaEvents = () => {
  const { user } = useAuth();
  const [loading] = useState(false);

  // Use mock data and filter for user's events
  const allEvents = useMemo(() => {
    if (!user) return [];
    
    return mockEvents.filter(event => 
      event.creator_id === user.id || 
      event.event_participants?.some(p => p.user_id === user.id)
    ) as unknown as Event[];
  }, [user]);

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
