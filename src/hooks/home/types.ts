
import { Event, Notification } from "@/types/event";

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
