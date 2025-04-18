
import { Event } from "@/types/event";

// Define our own Notification type since it doesn't exist in @/types/event
export interface Notification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  related_id: string | null;
  type: string;
  is_read?: boolean;
}

export interface UseHomeEventsReturn {
  loading: boolean;
  filteredEvents: Event[];
  publicEvents: Event[];
}

export interface UseHomePendingReturn {
  pendingActions: Notification[];
  pendingInvites: Event[];
  handlePendingActionComplete: (id: string) => void;
  handleInviteStatusUpdate: (eventId: string, status: 'confirmed' | 'declined') => void;
}

export type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';
