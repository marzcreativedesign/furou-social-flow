
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { toast } from "sonner";
import { Event } from "@/types/event";
import { FilterType, UseHomeEventsReturn } from "./types";

export const useHomeEvents = (
  searchQuery: string,
  activeFilter: FilterType
): UseHomeEventsReturn => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        // Fetch all events the user is related to
        const { data: userEvents, error: eventsError } = await EventsService.getEvents();
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          toast.error("Error loading events");
        } else if (userEvents) {
          // Process main events
          const formattedEvents = userEvents
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
                type: event.is_public ? "public" as const : (groupInfo ? "group" as const : "private" as const),
                groupName: groupInfo?.name || null,
                attendees: event.event_participants?.length || 0
              };
            });
          
          setEvents(formattedEvents);
        }

        // Fetch public events
        const { data: publicEventsData, error: publicEventsError } = await EventsService.getPublicEvents();
        
        if (publicEventsError) {
          console.error("Error fetching public events:", publicEventsError);
        } else if (publicEventsData) {
          const formattedPublicEvents = publicEventsData
            .filter(event => !user || event.creator_id !== user.id)
            .map(event => ({
              ...event,
              confirmed: event.event_participants ? event.event_participants.some(
                p => p.user_id === user?.id && p.status === 'confirmed'
              ) : false,
              type: "public" as const,
              attendees: event.event_participants?.length || 0
            }));
          
          setPublicEvents(formattedPublicEvents);
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

  return { loading, filteredEvents, publicEvents };
};
