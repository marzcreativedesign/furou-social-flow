import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { getEventById } from '@/data/mockData';

export const useEventDetail = (eventId: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [editEventData, setEditEventData] = useState<Partial<Event>>({});

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      const foundEvent = getEventById(eventId);
      
      if (foundEvent) {
        setEvent(foundEvent);
        setEditEventData(foundEvent);
      }
      
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [eventId]);

  return {
    event,
    loading,
    editEventData,
    setEditEventData
  };
};
