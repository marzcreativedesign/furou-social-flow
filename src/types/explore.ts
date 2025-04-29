
import { Event } from "@/types/event";

export interface ExploreEventsData {
  events: Event[];
  metadata: {
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
