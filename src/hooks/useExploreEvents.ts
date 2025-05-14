
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { toast } from '@/hooks/use-toast';
import { getEventsCacheKey, getCachedEvents, cacheEvents, isEventCacheStale } from '@/utils/eventCache';
import { ExploreEventsData } from '@/types/explore';

export const useExploreEvents = (
  initialSearchQuery = '',
  initialLocation = '',
  initialDate = ''
): ExploreEventsData => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [location, setLocation] = useState<string | null>(initialLocation);
  const [date, setDate] = useState<string | null>(initialDate);
  const [activeTab, setActiveTab] = useState<string>("events");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Create a cache key based on filters
  const cacheKey = useMemo(() => {
    return getEventsCacheKey("explore", { searchQuery, location, date });
  }, [searchQuery, location, date]);

  // Transform date string to range for filtering
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
        // Next 7 days
        endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'fds':
        // Next weekend (closest Saturday and Sunday)
        const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
        startDate.setDate(today.getDate() + daysUntilSaturday);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1); // Sunday
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'mes':
        // Current month
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
  
  // Define fetchEvents function
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we have valid cached data
      const cachedData = getCachedEvents<Event[]>(cacheKey);
      if (cachedData && !isEventCacheStale(cacheKey)) {
        setEvents(cachedData);
        setLoading(false);
        return;
      }
      
      let query = supabase.from('events').select('*');
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`);
      }
      
      // Apply location filter if provided
      if (location && location !== 'todos') {
        query = query.eq('location', location);
      }
      
      // Apply date filter if provided
      if (date) {
        const { start, end } = getDateRange(date);
        if (start && end) {
          query = query.gte('date', start).lte('date', end);
        }
      }
      
      // Sort by date
      query = query.order('date', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Cache the results
      cacheEvents(cacheKey, data as Event[]);
      
      setEvents(data as Event[]);
      setTotalPages(Math.ceil((data?.length || 0) / 10)); // Assuming 10 items per page
      
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching events:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [cacheKey, searchQuery, location, date, getDateRange]);

  // Fetch events when dependencies change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  // Handle location change
  const handleLocationChange = useCallback((loc: string | null) => {
    setLocation(loc);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  // Handle date change
  const handleDateChange = useCallback((newDate: string | null) => {
    setDate(newDate);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Handle page change
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
