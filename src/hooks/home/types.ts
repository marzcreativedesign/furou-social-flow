
import { Event } from "@/types/event";

export type FilterType = 'all' | 'public' | 'private' | 'confirmed' | 'missed';

export interface UseHomeEventsReturn {
  loading: boolean;
  filteredEvents: Event[];
  publicEvents: Event[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  related_id: string | null;
  type: string;
  is_read: boolean;
}

export interface UseHomePendingReturn {
  pendingActions: any[];
  pendingInvites: Event[];
  handlePendingActionComplete: (id: string) => void;
  handleInviteStatusUpdate: (eventId: string, status: 'confirmed' | 'declined') => void;
}
