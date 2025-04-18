
import { Event } from "./event";

export interface ExploreEventsData {
  events: Event[];
  metadata: {
    totalPages: number;
    currentPage: number;
  };
}

export interface ExploreEventsResponse {
  data: Event[];
  metadata?: {
    totalPages: number;
    currentPage: number;
    totalCount?: number;
    pageSize?: number;
  };
  error?: any;
}
