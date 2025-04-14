
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, LogOut } from "lucide-react";
import MainLayout from "../components/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileEditorDialog } from "@/components/profile/ProfileEditorDialog";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { profile, userStats, isLoading, setProfile } = useProfile();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSaveProfile = async (formData: { full_name: string; bio: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        bio: formData.bio,
      } : null);
      
      setEditProfileOpen(false);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o logout",
        variant: "destructive",
      });
    }
  };

  const handleSeedTestData = async () => {
    if (user?.email === 'teste@furou.com') {
      try {
        setIsSeeding(true);
        const seedTestData = await import('../utils/seedTestData');
        const result = await seedTestData.seedTestUserData();
        
        if (result?.success) {
          toast({
            title: "Dados criados com sucesso",
            description: "Eventos, grupos e notificações foram criados para o usuário de teste.",
          });
        } else {
          toast({
            title: "Erro ao criar dados",
            description: "Ocorreu um erro ao criar os dados de teste.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error seeding test data:", error);
        toast({
          title: "Erro ao criar dados",
          description: "Ocorreu um erro ao criar os dados de teste.",
          variant: "destructive",
        });
      } finally {
        setIsSeeding(false);
      }
    } else {
      toast({
        title: "Acesso negado",
        description: "Esta funcionalidade é apenas para o usuário de teste.",
        variant: "destructive",
      });
    }
  };

  if (!profile || !user) {
    return (
      <MainLayout title="Meu Perfil">
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Meu Perfil">
      <div className="px-4 py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-background dark:border-[#1E1E1E]">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
              <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                {profile.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-xl font-bold">{profile.full_name || user.email}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          
          {profile.bio && (
            <p className="mt-2 text-sm max-w-md text-muted-foreground dark:text-[#B3B3B3]">
              {profile.bio}
            </p>
          )}
          
          <Button 
            variant="outline" 
            className="mt-4 dark:border-muted dark:text-foreground dark:hover:bg-muted"
            onClick={() => setEditProfileOpen(true)}
          >
            <Edit size={16} className="mr-2" />
            Editar perfil
          </Button>
        </div>
        
        <ProfileStats stats={userStats} />
        <ProfileActions groupsCount={userStats.groups} />
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-rose-500 dark:text-[#FF4C4C] mt-6 dark:border-[#2C2C2C] dark:hover:bg-[#262626]"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Sair da conta
        </Button>
        
        {user?.email === 'teste@furou.com' && (
          <Button 
            variant="outline" 
            className="w-full justify-start text-blue-500 mt-2 dark:border-[#2C2C2C] dark:hover:bg-[#262626]"
            onClick={handleSeedTestData}
            disabled={isSeeding}
          >
            {isSeeding ? "Criando dados..." : "Criar dados de teste"}
          </Button>
        )}
      </div>

      <ProfileEditorDialog 
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </MainLayout>
  );
};

export default Profile;
