
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/MainLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { ProfileUpcomingEvents } from "@/components/profile/ProfileUpcomingEvents";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        setProfile(profileData);
        
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
          
        if (eventsError) throw eventsError;
        
        setUpcomingEvents(eventsData || []);
        
      } catch (error: any) {
        console.error('Error fetching user profile:', error.message);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };
  
  if (loading) return <ProfileSkeleton />;
  
  if (!user || !profile) {
    navigate('/login');
    return null;
  }
  
  return (
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
        
        <ProfileInterests 
          interests={profile.interests || []}
        />
        
        <ProfileUpcomingEvents 
          events={upcomingEvents}
          loading={false}
        />
      </div>
    </MainLayout>
  );
};

export default Profile;
