
import { useState, useEffect } from 'react';
import { EventsService } from '@/services/events.service';
import { useToast } from '@/hooks/use-toast';
import { cache } from '@/utils/cache';

export const useEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [publicEvents, setPublicEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Try cache first
      const cachedEvents = cache.get<any[]>('user_events');
      const cachedPublicEvents = cache.get<any[]>('public_events');

      if (cachedEvents && cachedPublicEvents) {
        setEvents(Array.isArray(cachedEvents) ? cachedEvents : []);
        setPublicEvents(Array.isArray(cachedPublicEvents) ? cachedPublicEvents : []);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const [userEventsResult, publicEventsResult] = await Promise.all([
        EventsService.getEvents(),
        EventsService.getPublicEvents()
      ]);

      if (userEventsResult.error) {
        console.error('Error fetching user events:', userEventsResult.error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus eventos",
          variant: "destructive"
        });
      } else {
        setEvents(userEventsResult.data && Array.isArray(userEventsResult.data) ? userEventsResult.data : []);
        cache.set('user_events', userEventsResult.data && Array.isArray(userEventsResult.data) ? userEventsResult.data : []);
      }

      if (publicEventsResult.error) {
        console.error('Error fetching public events:', publicEventsResult.error);
      } else {
        setPublicEvents(publicEventsResult.data && Array.isArray(publicEventsResult.data) ? publicEventsResult.data : []);
        cache.set('public_events', publicEventsResult.data && Array.isArray(publicEventsResult.data) ? publicEventsResult.data : []);
      }

    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar eventos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    publicEvents,
    loading,
    refetch: fetchEvents
  };
};
