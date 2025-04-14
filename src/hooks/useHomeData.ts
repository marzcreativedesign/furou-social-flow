
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { NotificationsService } from "@/services/notifications.service";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: userEvents, error: eventsError } = await EventsService.getUserEvents();
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          toast.error("Error loading events");
        } else if (userEvents) {
          const formattedEvents: Event[] = userEvents.map(event => {
            const groupInfo = event.group_events?.[0]?.groups || null;
            
            return {
              ...event,
              confirmed: event.event_participants && event.event_participants.some(p => p.status === 'confirmed'),
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
        }

        const { data: publicEventsData, error: publicEventsError } = await EventsService.getPublicEvents();
        
        if (publicEventsError) {
          console.error("Error fetching public events:", publicEventsError);
        } else if (publicEventsData) {
          const formattedPublicEvents: Event[] = publicEventsData
            .filter(event => event.creator_id !== user?.id)
            .map(event => ({
              ...event,
              confirmed: false,
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

  return {
    loading,
    filteredEvents,
    publicEvents,
    pendingActions,
    handlePendingActionComplete
  };
};
