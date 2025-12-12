import { useState, useEffect } from 'react';
import { mockEvents, getPublicEvents, getUpcomingEvents } from '@/data/mockData';

export const useEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [publicEvents, setPublicEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    
    // Simulate a small delay for realistic loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setEvents(getUpcomingEvents());
    setPublicEvents(getPublicEvents());
    setLoading(false);
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
