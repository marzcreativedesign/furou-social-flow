
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockProfile, getUserGroups, getEventsByCreator, getUserParticipatingEvents } from "@/data/mockData";

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email: string;
}

interface UserStats {
  eventsCreated: number;
  eventsAttended: number;
  eventsMissed: number;
  groups: number;
}

export const useProfile = () => {
  const { user } = useAuth();
  
  const profile = useMemo<UserProfile | null>(() => {
    if (!user) return null;
    return {
      id: mockProfile.id,
      full_name: mockProfile.full_name,
      avatar_url: mockProfile.avatar_url,
      bio: mockProfile.bio,
      email: user?.email || "usuario@furou.app"
    };
  }, [user]);

  const userStats = useMemo<UserStats>(() => {
    if (!user) return { eventsCreated: 0, eventsAttended: 0, eventsMissed: 0, groups: 0 };
    
    const createdEvents = getEventsByCreator(user.id);
    const participatingEvents = getUserParticipatingEvents(user.id);
    const userGroups = getUserGroups(user.id);
    
    // Count confirmed and declined events
    let attended = 0;
    let missed = 0;
    
    participatingEvents.forEach(event => {
      const participation = event.event_participants?.find(p => p.user_id === user.id);
      if (participation?.status === 'confirmed') attended++;
      if (participation?.status === 'declined') missed++;
    });

    return {
      eventsCreated: createdEvents.length,
      eventsAttended: attended,
      eventsMissed: missed,
      groups: userGroups.length
    };
  }, [user]);

  const [isLoading] = useState(false);

  const setProfile = () => {
    // Mock - does nothing
  };

  return {
    profile,
    userStats,
    isLoading,
    setProfile,
  };
};
