
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    eventsCreated: 0,
    eventsAttended: 0,
    eventsMissed: 0,
    groups: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          setProfile({
            id: profileData.id,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            bio: profileData.bio,
            email: user.email || ''
          });
        }

        // Fetch events created count
        const { data: eventsCreated } = await supabase
          .from('events')
          .select('id')
          .eq('creator_id', user.id);

        // Fetch event confirmations
        const { data: confirmations } = await supabase
          .from('event_confirmations')
          .select('status')
          .eq('user_id', user.id);

        // Fetch groups
        const { data: groups } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id);

        setUserStats({
          eventsCreated: eventsCreated?.length || 0,
          eventsAttended: confirmations?.filter(c => c.status === 'confirmed').length || 0,
          eventsMissed: confirmations?.filter(c => c.status === 'declined').length || 0,
          groups: groups?.length || 0
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  return {
    profile,
    userStats,
    isLoading,
    setProfile,
  };
};
