
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
    group_id: string; 
    groups?: { 
      name: string 
    } 
  }>;
  created_at?: string | null;
  updated_at?: string | null;
  visibility?: 'public' | 'private' | null;
}

export type Event = EventData;
