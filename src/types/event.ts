
export interface EventParticipant {
  id: string;
  user_id: string;
  status: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  address?: string;
  is_public: boolean;
  image_url: string | null;
  creator_id: string;
  comments: any[];
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  event_participants: EventParticipant[];
  estimated_budget?: number | null;
  group_events?: Array<{ 
    group_id: string; 
    groups?: { 
      name: string 
    } 
  }>;
  created_at?: string;
  updated_at?: string;
  visibility?: 'public' | 'private';
}

export type Event = EventData;
