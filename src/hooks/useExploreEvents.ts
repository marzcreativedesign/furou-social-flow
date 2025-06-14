
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { toast } from '@/hooks/use-toast';

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

  // Simple local cache using Map
  const simpleCache = useMemo(() => new Map<string, Event[]>(), []);

  const cacheKey = useMemo(() => {
    return `explore_${searchQuery}_${location}_${date}`;
  }, [searchQuery, location, date]);

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
      start: startDate.toISOString(), 
      end: endDate ? endDate.toISOString() : null 
    };
  }, []);
  
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (simpleCache.has(cacheKey)) {
      setEvents(simpleCache.get(cacheKey) || []);
      setLoading(false);
      return;
    }
    try {
      let query = supabase.from('events').select('*');
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`);
      }
      if (location && location !== 'todos') {
        query = query.eq('location', location);
      }
      if (date) {
        const { start, end } = getDateRange(date);
        if (start && end) {
          query = query.gte('date', start).lte('date', end);
        }
      }
      query = query.order('date', { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      simpleCache.set(cacheKey, data as Event[]);
      setEvents(data as Event[]);
      setTotalPages(Math.ceil((data?.length || 0) / 10));
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [cacheKey, searchQuery, location, date, getDateRange, simpleCache]);

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
