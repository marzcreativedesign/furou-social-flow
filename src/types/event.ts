
export interface EventParticipant {
  id: string;
  user_id: string;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
  event_id?: string | null;
  profiles?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null | any; // Making this more flexible to handle error cases
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string | null;
  address?: string | null;
  is_public: boolean | null;
  image_url: string | null;
  creator_id: string;
  comments: any[];
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  event_participants: EventParticipant[];
  estimated_budget?: number | null;
  group_events?: Array<{ 
    id?: string; // Making id optional to match API data structure
    group_id: string; 
    groups?: { 
      id?: string; // Making id optional to match API data structure
      name: string 
    } 
  }>;
  created_at?: string | null;
  updated_at?: string | null;
  visibility?: 'public' | 'private' | null;
  attendees?: number; // Added attendees property for ExplorePage
}

// Define Event as EventData to ensure compatibility
export type Event = EventData;

// Add a new interface for pagination metadata
export interface PaginationMetadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Define the service response type with metadata
export interface EventServiceResponse {
  data: Event[];
  metadata?: PaginationMetadata;
  error: any;
}
