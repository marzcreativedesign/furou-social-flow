import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { NotificationsService } from "@/services/notifications.service";
import { toast } from "sonner";
import { Event } from "@/types/event";

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
        const { data: userEvents, error: eventsError } = await EventsService.getEvents();
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          toast.error("Error loading events");
        } else if (userEvents) {
          // Process main events
          const formattedEvents: Event[] = userEvents
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
              } as Event;
            });
          
          setEvents(formattedEvents);
          
          // Process pending invites
          const pendingInvitesData = userEvents
            .filter(event => event.event_participants?.some(
              p => p.user_id === user.id && (p.status === 'invited' || p.status === 'pending')
            ))
            .map(event => ({
              id: event.id,
              title: event.title,
              date: event.date,
              location: event.location,
              image_url: event.image_url,
              status: event.event_participants?.find(p => p.user_id === user.id)?.status as 'invited' | 'pending'
            }));
          
          setPendingInvites(pendingInvitesData as Event[]);
        }

        // Fetch public events
        const { data: publicEventsData, error: publicEventsError } = await EventsService.getPublicEvents();
        
        if (publicEventsError) {
          console.error("Error fetching public events:", publicEventsError);
        } else if (publicEventsData) {
          const formattedPublicEvents: Event[] = publicEventsData
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
            } as Event));
          
          setPublicEvents(formattedPublicEvents);
        }

        // Fetch notifications
        const { data: notifications, error: notificationsError } = await NotificationsService.getUserNotifications();
        
        if (notificationsError) {
          console.error("Error fetching notifications:", notificationsError);
        } else if (notifications) {
          setPendingActions(notifications);
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
      const { data } = await EventsService.getEvents();
      if (data) {
        const formattedEvents = data.map(event => {
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
