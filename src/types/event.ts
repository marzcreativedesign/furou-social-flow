
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  address?: string;
  is_public: boolean;
  image_url: string;
  estimated_budget?: number | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
  event_date?: string;
  visibility?: "public" | "private";
  profiles?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
  event_participants?: EventParticipant[];
  comments?: any[];
  attendees?: number;
}

export interface EventData extends Event {
  address?: string;
}

export interface EventParticipant {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  created_at?: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface EventComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  event_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface EventGalleryImage {
  id: string;
  url: string;
  created_at: string;
  user_id: string;
  event_id: string;
}

export interface PaginationMetadata {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  count?: number;
}

export interface EventServiceResponse {
  data?: Event[];
  error?: any;
  metadata?: PaginationMetadata;
}
