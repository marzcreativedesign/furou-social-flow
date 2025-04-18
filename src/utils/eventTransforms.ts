
import { Event } from "@/types/event";
import { ExploreEventsData } from "@/types/explore";

export const formatEventDate = (date: string): string => {
  return new Date(date).toLocaleString('pt-BR', {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric'
  });
};

export const transformEventData = (event: Event): Event => {
  return {
    ...event,
    date: formatEventDate(event.date),
    attendees: event.event_participants?.length || 0
  };
};

export const createEventResponse = (
  events: Event[], 
  currentPage: number,
  totalPages: number = 1
): ExploreEventsData => {
  return {
    events: events.map(transformEventData),
    metadata: {
      totalPages,
      currentPage
    }
  };
};
