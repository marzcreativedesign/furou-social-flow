
import { useState, useMemo, useCallback } from 'react';
import { Event } from '@/types/event';
import { mockEvents } from '@/data/mockData';

export const useExploreEvents = (initialTab: 'all' | 'nearby' = 'all') => {
  const [activeTab, setActiveTab] = useState<'all' | 'nearby'>(initialTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const pageSize = 10;

  // Filter and paginate mock events
  const { events, totalPages } = useMemo(() => {
    let filtered = mockEvents as unknown as Event[];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (location) {
      filtered = filtered.filter(event => 
        event.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply date filter
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfDay && eventDate <= endOfDay;
      });
    }

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / pageSize);
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize;
    const paginatedEvents = filtered.slice(from, to);

    return { events: paginatedEvents, totalPages };
  }, [searchQuery, location, date, currentPage]);

  // Memoize handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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

  const refreshEvents = useCallback(() => {
    // Mock refresh - does nothing since data is static
  }, []);

  return {
    events,
    loading: false,
    error: null,
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
    refreshEvents
  };
};
