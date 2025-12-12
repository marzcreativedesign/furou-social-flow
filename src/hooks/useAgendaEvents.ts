import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { isBefore, isToday, startOfDay } from "date-fns";
import { mockEvents, getEventsForDate as getMockEventsForDate } from "@/data/mockData";

export const useAgendaEvents = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data - simulate small delay
    const timer = setTimeout(() => {
      setAllEvents(mockEvents);
      setLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return getMockEventsForDate(date);
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
    const dayToCheck = startOfDay(date);
    const today = startOfDay(new Date());
    return isBefore(dayToCheck, today);
  };

  const getEventTypeBadge = (event: Event) => {
    const eventDate = new Date(event.date);
    const isPastEvent = isPastDate(eventDate);
    
    if (isPastEvent) {
      return 'bg-gray-500';
    }
    
    if (isToday(eventDate)) {
      return 'bg-green-500';
    }
    
    return event.is_public ? 'bg-blue-500' : 'bg-purple-500';
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
