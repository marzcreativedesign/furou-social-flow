
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
import { useToast } from "@/hooks/use-toast";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ErrorBoundary from "@/components/ErrorBoundary";

const Profile = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if no user
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }
        
        if (!profileData) {
          console.log('No profile found, creating one');
          // If no profile exists, create an empty one
          setProfile({
            id: user.id,
            full_name: user.user_metadata?.full_name || "Usuário",
            avatar_url: null,
            bio: null,
            email: user.email
          });
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
          throw eventsError;
        }
        
        setUpcomingEvents(eventsData || []);
        
      } catch (error: any) {
        console.error('Error fetching user profile:', error.message);
        setError(error.message);
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
  }, [user, toast, navigate]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
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
  
  if (error) {
    return (
      <MainLayout title="Erro">
        <div className="p-4 flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-bold mb-2">Ocorreu um erro</h2>
          <p className="text-muted-foreground mb-4">Não foi possível carregar seus dados de perfil</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <ErrorBoundary>
      <MainLayout title="Seu Perfil">
        <div className="p-4 mb-16">
          <ProfileHeader 
            name={profile?.full_name || "Usuário"}
            bio={profile?.bio || ""}
            avatarUrl={profile?.avatar_url}
          />
          
          <ProfileStats 
            eventsCount={upcomingEvents.length} 
            reliability={profile?.reliability_score || 0}
          />
          
          <ProfileActions onSignOut={handleSignOut} />
          
          <ProfileInterests 
            interests={profile?.interests || []}
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
