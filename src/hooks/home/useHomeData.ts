
import { FilterType } from "./types";
import { useHomeEvents } from "./useHomeEvents";
import { useHomePending } from "./useHomePending";

export const useHomeData = (searchQuery: string, activeFilter: FilterType) => {
  const { loading, filteredEvents, publicEvents } = useHomeEvents(searchQuery, activeFilter);
  const { 
    pendingActions, 
    pendingInvites, 
    handlePendingActionComplete, 
    handleInviteStatusUpdate 
  } = useHomePending();

  return {
    loading,
    filteredEvents,
    publicEvents,
    pendingActions,
    pendingInvites,
    handlePendingActionComplete,
    handleInviteStatusUpdate
  };
};

export type { FilterType } from "./types";
