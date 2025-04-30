
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { toast } from '@/components/ui/use-toast';
import { getEventsCacheKey, getCachedEvents, cacheEvents, isCacheStale } from '@/utils/eventCache';
import { ExploreEventsData, ExploreEventsResponse } from '@/types/explore';

export const useExploreEvents = (initialTab: 'all' | 'nearby' = 'all') => {
  const [activeTab, setActiveTab] = useState<'all' | 'nearby'>(initialTab);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const fetchEvents = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const cacheKey = getEventsCacheKey('explore', { 
        tab: activeTab, 
        page, 
        search: searchQuery,
        location,
        category,
        date: date?.toISOString()
      });

      // Verifica se há dados em cache e se não estão expirados
      const cachedData = getCachedEvents<ExploreEventsData>(cacheKey);
      if (cachedData && !isCacheStale(cacheKey)) {
        setEvents(cachedData.events);
        setTotalPages(cachedData.metadata.totalPages);
        setCurrentPage(cachedData.metadata.currentPage);
        setLoading(false);
        return;
      }

      // Construir a query
      let query = supabase
        .from('events')
        .select(`
          *,
          event_participants(*),
          profiles:creator_id(*)
        `, { count: 'exact' });

      // Adicionar filtros
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

      // Paginação
      const pageSize = 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to).order('date', { ascending: true });

      // Executar a query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Processar resultados
      const totalCount = count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / pageSize);
      
      // Formatar os eventos
      const formattedEvents = (data || []).map((event: any) => ({
        ...event,
        creator: {
          id: event.profiles?.id,
          name: event.profiles?.full_name || 'Usuário',
          avatar: event.profiles?.avatar_url
        }
      }));

      // Atualizar o estado
      setEvents(formattedEvents);
      setTotalPages(calculatedTotalPages);
      setCurrentPage(page);
      
      // Armazenar em cache
      const cacheData: ExploreEventsData = {
        events: formattedEvents,
        metadata: {
          totalPages: calculatedTotalPages,
          currentPage: page
        }
      };
      
      cacheEvents(cacheKey, cacheData, 5); // Cache por 5 minutos
      
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setError(err);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1);
  }, [activeTab, searchQuery, location, category, date]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEvents(page);
  };

  const handleTabChange = (tab: 'all' | 'nearby') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleLocationChange = (loc: string | null) => {
    setLocation(loc);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string | null) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    setCurrentPage(1);
  };

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
    refreshEvents: () => fetchEvents(currentPage)
  };
};
