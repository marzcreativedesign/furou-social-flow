
import { EventParticipant } from "@/types/event";

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location?: string | null;
  is_public?: boolean | null;
  image_url?: string | null;
  address?: string | null;
  estimated_budget?: number | null;
  event_participants?: EventParticipant[];
}
