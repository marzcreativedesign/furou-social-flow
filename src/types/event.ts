
import { Database } from "@/integrations/supabase/types";

export type Event = Database["public"]["Tables"]["events"]["Row"] & {
  event_participants?: Array<{
    id: string;
    user_id: string;
    event_id: string;
    status: string;
    created_at?: string;
  }>;
};

export type EventWithDetails = Event & {
  creator?: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
  };
};

export interface EventServiceResponse {
  data?: Event[];
  error: any;
  metadata?: {
    totalPages: number;
    currentPage: number;
    count?: number;
  };
}

export interface EventDetailResponse {
  data?: EventWithDetails;
  error: any;
}

export interface EventFilters {
  search?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  isPublic?: boolean;
}

export type EventVisibility = 'public' | 'private' | 'restricted';

export interface CreateEventRequest {
  title: string;
  description?: string;
  location?: string;
  event_date: string;
  is_public: boolean;
  image_url?: string;
}

export interface EventParticipant {
  id: string;
  user_id: string;
  event_id: string;
  status: 'confirmed' | 'pending' | 'declined';
  created_at?: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}
