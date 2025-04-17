
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventQueriesService } from '@/services/event/queries';
import { Event, EventServiceResponse } from "@/types/event";

export const useExploreEvents = (pageSize: number = 9) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    data: eventsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['publicEvents', currentPage, pageSize],
    queryFn: async () => {
      const response = await EventQueriesService.getPublicEvents(currentPage, pageSize) as EventServiceResponse;
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao buscar eventos públicos');
      }
      
      return { 
        events: (response.data || []).map(event => ({
          ...event,
          date: new Date(event.date).toLocaleString('pt-BR', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric'
          }),
          attendees: event.event_participants?.length || 0
        })),
        metadata: {
          totalPages: response.metadata?.totalPages || 1,
          currentPage: response.metadata?.currentPage || 1
        }
      };
    },
    placeholderData: (previousData) => previousData
  });

  const events = eventsData?.events || [];
  const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };

  const filteredEvents = events.filter(event => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) ||
        (event.profiles && event.profiles.full_name && event.profiles.full_name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return {
    events: filteredEvents,
    isLoading,
    error,
    metadata,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage
  };
};
