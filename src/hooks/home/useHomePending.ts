
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { NotificationsService } from "@/services/notifications.service";
import { toast } from "@/hooks/use-toast";
import { Event } from "@/types/event";
import { UseHomePendingReturn } from "./types";

export const useHomePending = (): UseHomePendingReturn => {
  const { user } = useAuth();
  const [pendingActions, setPendingActions] = useState([]);
  const [pendingInvites, setPendingInvites] = useState<Event[]>([]);

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        if (!user) return;

        // Fetch notifications for pending actions
        const { data: notifications, error: notificationsError } = 
          await NotificationsService.getUserNotifications();
        
        if (notificationsError) {
          console.error("Error fetching notifications:", notificationsError);
        } else if (notifications) {
          setPendingActions(notifications);
        }

        // Process pending invites from events data
        const { data: eventsData } = await EventsService.getEvents();
        if (eventsData) {
          const pendingInvitesData = eventsData
            .filter(event => event.event_participants?.some(
              p => p.user_id === user.id && (p.status === 'invited' || p.status === 'pending')
            ))
            .map(event => ({
              ...event,
              id: event.id,
              title: event.title,
              date: event.date,
              location: event.location,
              image_url: event.image_url,
              status: event.event_participants?.find(p => p.user_id === user.id)?.status
            }));
          
          setPendingInvites(pendingInvitesData as Event[]);
        }
      } catch (error) {
        console.error("Error fetching pending data:", error);
      }
    };

    if (user) {
      fetchPendingData();
    }
  }, [user]);

  const handlePendingActionComplete = async (id: string) => {
    try {
      await NotificationsService.markAsRead(id);
      setPendingActions(prevActions => prevActions.filter(action => action.id !== id));
    } catch (error) {
      console.error("Error completing action:", error);
      toast({
        title: "Error",
        description: "Error completing action",
        variant: "destructive",
      });
    }
  };

  const handleInviteStatusUpdate = async (eventId: string, status: 'confirmed' | 'declined') => {
    setPendingInvites(prev => prev.filter(event => event.id !== eventId));
  };

  return {
    pendingActions,
    pendingInvites,
    handlePendingActionComplete,
    handleInviteStatusUpdate
  };
};
