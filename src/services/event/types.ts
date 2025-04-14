
export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location?: string;
  is_public?: boolean;
  image_url?: string;
  address?: string;
  estimated_budget?: number | null;
  event_participants?: any[];
}
