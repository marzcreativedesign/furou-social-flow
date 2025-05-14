
import { Event } from "@/types/event";

export interface ExploreEventsData {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  activeTab?: string;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  location?: string | null;
  date?: string | null;
  handleTabChange?: (tab: string) => void;
  handleSearch: (query: string) => void;
  handleLocationChange?: (location: string | null) => void;
  handleDateChange?: (date: string | null) => void;
  handlePageChange: (page: number) => void;
  metadata?: {
    totalPages: number;
    currentPage: number;
  };
}

export interface ExploreEventsResponse {
  data?: Event[];
  error: any;
  metadata?: {
    totalPages: number;
    currentPage: number;
  };
}
