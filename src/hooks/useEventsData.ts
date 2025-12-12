
import { useState, useMemo } from "react";
import type { Event } from "@/types/event";
import { mockEvents } from "@/data/mockData";
import { useDebounce } from "@/utils/debounce";

interface EventsResponse {
  events: Event[];
  metadata: {
    totalPages: number;
    currentPage: number;
  };
}

export const useEventsData = (initialPage = 1, pageSize = 6) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private' | 'confirmed' | 'missed'>('all');
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedLocation = useDebounce(locationQuery, 500);

  // Use mock data
  const allEvents = mockEvents as unknown as Event[];

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event: Event) => {
      if (
        (activeFilter === 'public' && !event.is_public) || 
        (activeFilter === 'private' && event.is_public) || 
        (activeFilter === 'confirmed' && !event.event_participants?.some(p => p.status === 'confirmed')) || 
        (activeFilter === 'missed' && event.event_participants?.some(p => p.status === 'confirmed') !== false)
      ) {
        return false;
      }

      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesLocation = event.location?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesLocation) {
          return false;
        }
      }

      if (debouncedLocation && !event.location?.toLowerCase().includes(debouncedLocation.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [allEvents, activeFilter, debouncedSearch, debouncedLocation]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const metadata = {
    totalPages,
    currentPage
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    filteredEvents: paginatedEvents,
    isLoading: false,
    searchQuery,
    setSearchQuery,
    locationQuery,
    setLocationQuery,
    activeFilter,
    setActiveFilter,
    currentPage,
    metadata,
    handlePageChange
  };
};
