
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockProfile } from "@/data/mockData";

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
  
  const [profile] = useState<UserProfile | null>({
    id: mockProfile.id,
    full_name: mockProfile.full_name,
    avatar_url: mockProfile.avatar_url,
    bio: mockProfile.bio,
    email: user?.email || "usuario@furou.app"
  });

  const [userStats] = useState<UserStats>({
    eventsCreated: 3,
    eventsAttended: 8,
    eventsMissed: 2,
    groups: 0
  });

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
