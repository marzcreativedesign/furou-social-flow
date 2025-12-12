import { useState, useEffect, useMemo, useCallback } from 'react';
import { Event } from '@/types/event';
import { mockEvents, getPublicEvents } from '@/data/mockData';

export const useExploreEvents = (
  initialSearchQuery = '',
  initialLocation = '',
  initialDate = ''
) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [location, setLocation] = useState<string | null>(initialLocation);
  const [date, setDate] = useState<string | null>(initialDate);
  const [activeTab, setActiveTab] = useState<string>("events");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const getDateRange = useCallback((dateString: string) => {
    if (!dateString) return { start: null, end: null };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    let endDate: Date | null = null;
    switch (dateString) {
      case 'hoje':
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'amanha':
        startDate.setDate(today.getDate() + 1);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'semana':
        endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'fds':
        const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
        startDate.setDate(today.getDate() + daysUntilSaturday);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'mes':
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      default:
        return { start: null, end: null };
    }
    return { 
      start: startDate, 
      end: endDate 
    };
  }, []);
  
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredEvents = getPublicEvents();
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      }
      
      // Apply location filter
      if (location && location !== 'todos') {
        filteredEvents = filteredEvents.filter(event =>
          event.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      // Apply date filter
      if (date) {
        const { start, end } = getDateRange(date);
        if (start && end) {
          filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= start && eventDate <= end;
          });
        }
      }
      
      // Sort by date
      filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setEvents(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / 10));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, location, date, getDateRange]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);
  
  const handleLocationChange = useCallback((loc: string | null) => {
    setLocation(loc);
    setCurrentPage(1);
  }, []);
  
  const handleDateChange = useCallback((newDate: string | null) => {
    setDate(newDate);
    setCurrentPage(1);
  }, []);
  
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  return { 
    events, 
    loading, 
    error, 
    refetch: fetchEvents,
    activeTab,
    currentPage,
    totalPages,
    searchQuery,
    location,
    date,
    handleTabChange,
    handleSearch,
    handleLocationChange,
    handleDateChange,
    handlePageChange,
    metadata: {
      currentPage,
      totalPages
    }
  };
};
