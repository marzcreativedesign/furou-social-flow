
import { useState, useEffect } from 'react';
import { EventsService } from '@/services/events.service';
import { useToast } from '@/hooks/use-toast';

export const useEventDetail = (eventId: string | undefined) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editEventData, setEditEventData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data, error } = await EventsService.getEventById(eventId);
        
        if (error) {
          console.error('Error fetching event:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar o evento",
            variant: "destructive"
          });
          return;
        }

        setEvent(data);
        setEditEventData(data);
      } catch (error) {
        console.error('Error in fetchEvent:', error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao carregar evento",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, toast]);

  return {
    event,
    loading,
    editEventData,
    setEditEventData
  };
};
