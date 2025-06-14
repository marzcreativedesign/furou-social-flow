
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/MainLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { ProfileUpcomingEvents } from "@/components/profile/ProfileUpcomingEvents";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { useToast } from "@/hooks/use-toast";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ErrorBoundary from "@/components/ErrorBoundary";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (!profileData) {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || "Usuário",
              email: user.email
            })
            .select()
            .single();
            
          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          setProfile(profileData);
        }
        
        // Fetch upcoming events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            event_participants!inner(status, user_id)
          `)
          .eq('event_participants.user_id', user.id)
          .eq('event_participants.status', 'confirmed')
          .gt('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3);
          
        if (eventsError) {
          console.error('Events fetch error:', eventsError);
        } else {
          setUpcomingEvents(eventsData || []);
        }
        
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o perfil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate, toast]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };

  const handleProfileUpdated = (updatedProfile: any) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };
  
  if (loading) return <ProfileSkeleton />;
  
  if (!user || !profile) {
    navigate('/auth');
    return null;
  }
  
  return (
    <ErrorBoundary>
      <MainLayout title="Seu Perfil">
        <div className="p-4 mb-16">
          <ProfileHeader 
            name={profile.full_name || "Usuário"}
            bio={profile.bio || ""}
            avatarUrl={profile.avatar_url}
          />
          
          <ProfileStats 
            eventsCount={upcomingEvents.length} 
            reliability={profile.reliability_score || 0}
          />
          
          <ProfileActions onSignOut={handleSignOut} />
          
          <div className="mb-6">
            <ProfileEditor 
              profile={profile}
              onProfileUpdated={handleProfileUpdated}
            />
          </div>
          
          <ProfileInterests 
            interests={profile.interests || []}
          />
          
          <ProfileUpcomingEvents 
            events={upcomingEvents}
            loading={false}
          />
        </div>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default Profile;
