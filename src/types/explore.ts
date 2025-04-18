
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
  };
  error?: any;
}
