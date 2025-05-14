import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { toast } from '@/hooks/use-toast';
import { getEventsCacheKey, getCachedEvents, cacheEvents, isEventCacheStale } from '@/utils/eventCache';
import { ExploreEventsData } from '@/types/explore';

export const useExploreEvents = (initialTab: 'all' | 'nearby' = 'all') => {
  const [activeTab, setActiveTab] = useState<'all' | 'nearby'>(initialTab);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  // Memoize the cache key to prevent unnecessary recalculations
  const cacheKey = useMemo(() => getEventsCacheKey('explore', { 
    tab: activeTab, 
    page: currentPage, 
    search: searchQuery,
    location,
    category,
    date: date?.toISOString()
  }), [activeTab, currentPage, searchQuery, location, category, date]);

  // Optimize fetch function as a memoized callback
  const fetchEvents = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Optimize cache check
      const cachedData = getCachedEvents<ExploreEventsData>(cacheKey);
      if (cachedData && !isEventCacheStale(cacheKey)) {
        setEvents(cachedData.events);
        setTotalPages(cachedData.metadata.totalPages);
        setCurrentPage(cachedData.metadata.currentPage);
        setLoading(false);
        return;
      }

      // Build query with proper type annotations for better performance
      let query = supabase
        .from('events')
        .select(`
          *,
          event_participants(*),
          profiles:creator_id(*)
        `, { count: 'exact' });

      // Apply filters efficiently
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query.gte('date', startOfDay.toISOString())
                    .lte('date', endOfDay.toISOString());
      }

      // Apply pagination
      const pageSize = 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to).order('date', { ascending: true });

      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Process results
      const totalCount = count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / pageSize);
      
      // Optimize event processing with a single-pass transformation
      const formattedEvents = data?.map((event: any) => ({
        ...event,
        creator: {
          id: event.profiles?.id,
          name: event.profiles?.full_name || 'Usuário',
          avatar: event.profiles?.avatar_url
        }
      })) || [];

      // Update state
      setEvents(formattedEvents);
      setTotalPages(calculatedTotalPages);
      setCurrentPage(page);
      
      // Cache results with metadata
      const cacheData: ExploreEventsData = {
        events: formattedEvents,
        metadata: {
          totalPages: calculatedTotalPages,
          currentPage: page
        }
      };
      
      cacheEvents(cacheKey, cacheData, 5); // Cache for 5 minutes
      
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setError(err);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [cacheKey, searchQuery, location, date, fetchEvents]);

  // Fetch events when dependencies change
  useEffect(() => {
    fetchEvents(1);
  }, [activeTab, searchQuery, location, category, date, fetchEvents]);

  // Memoize handlers to prevent unnecessary recreations
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchEvents(page);
  }, [fetchEvents]);

  const handleTabChange = useCallback((tab: 'all' | 'nearby') => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleLocationChange = useCallback((loc: string | null) => {
    setLocation(loc);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((cat: string | null) => {
    setCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleDateChange = useCallback((newDate: Date | null) => {
    setDate(newDate);
    setCurrentPage(1);
  }, []);

  return {
    events,
    loading,
    error,
    currentPage,
    totalPages,
    activeTab,
    searchQuery,
    location,
    category,
    date,
    handlePageChange,
    handleTabChange,
    handleSearch,
    handleLocationChange,
    handleCategoryChange,
    handleDateChange,
    refreshEvents: useCallback(() => fetchEvents(currentPage), [fetchEvents, currentPage])
  };
};
