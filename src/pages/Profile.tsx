
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import MainLayout from "@/components/MainLayout";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileEditorDialog } from "@/components/profile/ProfileEditorDialog";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { profile, userStats, isLoading, setProfile } = useProfile();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Sessão encerrada",
        description: "Você saiu do sistema com sucesso."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão.",
        variant: "destructive"
      });
    }
  };

  const handleProfileUpdate = async (formData: { full_name: string; bio: string; avatar_url: string | null }) => {
    if (!profile || !user) return;
    
    try {
      // Create a new profile object with updated values
      const updatedProfile = {
        ...profile,
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      };
      
      // Update the profile in state
      setProfile(updatedProfile);
      
      toast({
        title: "Perfil atualizado",
        description: "As informações do seu perfil foram atualizadas."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Perfil" showDock>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Perfil" showDock>
      <div className="p-4">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-3">
            <AvatarImage 
              src={profile?.avatar_url || ""} 
              alt={profile?.full_name || "User"} 
            />
            <AvatarFallback className="text-2xl">
              {profile?.full_name?.split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2) || '?'}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold mb-1">{profile?.full_name || "Usuário"}</h1>
          <p className="text-muted-foreground">{profile?.email}</p>

          <div className="w-full max-w-sm mt-4">
            {profile && (
              <ProfileEditorDialog 
                profile={profile} 
                onProfileUpdated={handleProfileUpdate} 
              />
            )}
          </div>
        </div>
        
        <ProfileStats stats={userStats} />
        
        <ProfileActions 
          onSignOut={handleSignOut} 
          groupsCount={userStats.groups} 
        />
      </div>
    </MainLayout>
  );
};

export default Profile;
