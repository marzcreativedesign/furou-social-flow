
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { NotificationsService } from "@/services/notifications.service";
import { toast } from "sonner";
import { ApiResponse } from "@/services/event/cache/event-cache.service";

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  image_url: string | null;
  is_public: boolean;
  creator_id: string;
  event_participants?: {
    id: string;
    user_id: string;
    status: string;
  }[];
  group_events?: {
    id: string;
    group_id: string;
    groups?: { 
      id: string;
      name: string 
    };
  }[];
  confirmed?: boolean;
  type?: "public" | "private" | "group";
  groupName?: string | null;
  attendees?: number;
  profiles?: any; // Add this to handle the profiles relation
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  related_id: string | null;
  eventName?: string;
  date?: string;
  imageUrl?: string;
}

type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';

export const useHomeData = (searchQuery: string, activeFilter: FilterType) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [pendingActions, setPendingActions] = useState<Notification[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user) return;
        
        // Fetch all events the user is related to
        const response = await EventsService.getEvents();
        
        if (response && typeof response === 'object' && 'error' in response && response.error) {
          console.error("Error fetching events:", response.error);
          toast.error("Error loading events");
        } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          // Process main events
          const formattedEvents: Event[] = response.data
            .filter(event => event.event_participants?.some(
              p => p.user_id === user.id && p.status !== 'invited' && p.status !== 'pending'
            ) || event.creator_id === user.id)
            .map(event => {
              const groupInfo = event.group_events && event.group_events[0]?.groups 
                ? event.group_events[0].groups 
                : null;
              
              return {
                ...event,
                confirmed: event.event_participants && event.event_participants.some(
                  p => p.user_id === user.id && p.status === 'confirmed'
                ),
                type: event.is_public ? "public" : (groupInfo ? "group" : "private"),
                groupName: groupInfo?.name || null,
                attendees: event.event_participants?.length || 0,
                date: new Date(event.date).toLocaleString('pt-BR', {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: 'numeric'
                })
              };
            });
          
          setEvents(formattedEvents);
          
          // Process pending invites
          const pendingInvitesData = response.data
            .filter(event => event.event_participants?.some(
              p => p.user_id === user.id && (p.status === 'invited' || p.status === 'pending')
            ))
            .map(event => ({
              id: event.id,
              title: event.title,
              date: event.date,
              location: event.location,
              image_url: event.image_url,
              is_public: event.is_public,
              creator_id: event.creator_id,
              status: event.event_participants?.find(p => p.user_id === user.id)?.status as 'invited' | 'pending'
            }));
          
          setPendingInvites(pendingInvitesData);
        }

        // Fetch public events
        const publicEventsResponse = await EventsService.getPublicEvents();
        
        if (publicEventsResponse && typeof publicEventsResponse === 'object' && 'error' in publicEventsResponse && publicEventsResponse.error) {
          console.error("Error fetching public events:", publicEventsResponse.error);
        } else if (publicEventsResponse && typeof publicEventsResponse === 'object' && 'data' in publicEventsResponse && Array.isArray(publicEventsResponse.data)) {
          const formattedPublicEvents: Event[] = publicEventsResponse.data
            .filter(event => !user || event.creator_id !== user.id)
            .map(event => ({
              ...event,
              confirmed: event.event_participants ? event.event_participants.some(
                p => p.user_id === user?.id && p.status === 'confirmed'
              ) : false,
              type: "public",
              attendees: event.event_participants?.length || 0,
              date: new Date(event.date).toLocaleString('pt-BR', {
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
              })
            }));
          
          setPublicEvents(formattedPublicEvents);
        }

        // Fetch notifications
        const notificationsResponse = await NotificationsService.getUserNotifications();
        
        if (notificationsResponse && typeof notificationsResponse === 'object' && 'error' in notificationsResponse && notificationsResponse.error) {
          console.error("Error fetching notifications:", notificationsResponse.error);
        } else if (notificationsResponse && typeof notificationsResponse === 'object' && 'data' in notificationsResponse && Array.isArray(notificationsResponse.data)) {
          setPendingActions(notificationsResponse.data);
        }
      } catch (error) {
        console.error("Error loading homepage data:", error);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredEvents = events.filter(event => {
    if (
      (activeFilter === 'public' && !event.is_public) || 
      (activeFilter === 'private' && (event.is_public || event.type === 'group')) || 
      (activeFilter === 'group' && event.type !== 'group') || 
      (activeFilter === 'confirmed' && !event.confirmed) || 
      (activeFilter === 'missed' && event.confirmed !== false)
    ) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) || 
        (event.groupName && event.groupName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handlePendingActionComplete = async (id: string) => {
    try {
      await NotificationsService.markAsRead(id);
      setPendingActions(prevActions => prevActions.filter(action => action.id !== id));
    } catch (error) {
      console.error("Error completing action:", error);
      toast.error("Error completing action");
    }
  };

  const handleInviteStatusUpdate = async (eventId: string, status: 'confirmed' | 'declined') => {
    setPendingInvites(prev => prev.filter(event => event.id !== eventId));
    
    if (status === 'confirmed') {
      // Refetch all events to update the confirmed list
      const response = await EventsService.getEvents();
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        const formattedEvents = response.data.map(event => {
          const groupInfo = event.group_events && event.group_events[0]?.groups 
            ? event.group_events[0].groups 
            : null;
        
          return {
            ...event,
            confirmed: event.event_participants && event.event_participants.some(
              p => p.user_id === user?.id && p.status === 'confirmed'
            ),
            type: event.is_public ? "public" : (groupInfo ? "group" : "private"),
            groupName: groupInfo?.name || null,
            attendees: event.event_participants?.length || 0
          };
        });
        
        setEvents(formattedEvents);
      }
    }
  };

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
