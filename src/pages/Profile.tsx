import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, LogOut, ChevronRight, CalendarDays, Users } from "lucide-react";
import MainLayout from "../components/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { AuthService } from "@/services/auth.service";
import { EventsService } from "@/services/events.service";
import { GroupsService } from "@/services/groups.service";
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

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    eventsCreated: 0,
    eventsAttended: 0,
    eventsMissed: 0,
    groups: 0
  });
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    bio: "",
  });

  // Fetch user profile and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch profile data
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

          setFormData({
            full_name: profileData.full_name || '',
            email: user.email || '',
            bio: profileData.bio || '',
          });
        }

        // Fetch events stats
        const { data: events } = await EventsService.getUserEvents();
        const { data: groups } = await GroupsService.getUserGroups();

        setUserStats({
          eventsCreated: events?.filter(e => e.creator_id === user.id).length || 0,
          eventsAttended: events?.filter(e => e.event_participants?.some(p => p.status === 'confirmed')).length || 0,
          eventsMissed: events?.filter(e => e.event_participants?.some(p => p.status === 'declined')).length || 0,
          groups: groups?.length || 0
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [user, toast]);

  const handleEditProfile = () => {
    if (!profile) return;
    
    setFormData({
      full_name: profile.full_name || '',
      email: profile.email,
      bio: profile.bio || '',
    });
    setEditProfileOpen(true);
  };

  const handleSaveProfile = async () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
            onClick={handleEditProfile}
          >
            <Edit size={16} className="mr-2" />
            Editar perfil
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-primary dark:text-primary">{userStats.eventsCreated}</p>
            <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Eventos criados</p>
          </div>
          <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-green-500 dark:text-[#4CAF50]">{userStats.eventsAttended}</p>
            <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Participações</p>
          </div>
          <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-rose-500 dark:text-[#FF4C4C]">{userStats.eventsMissed}</p>
            <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Furadas</p>
          </div>
        </div>
        
        <Separator className="my-6 dark:bg-[#2C2C2C]" />
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Seus eventos</h3>
            <Button variant="ghost" size="sm" className="text-primary dark:text-[#FFA756]" onClick={() => navigate("/eventos")}>
              Ver todos
            </Button>
          </div>
          
          {/* MOCK_USER_EVENTS.map(event => (
            <div 
              key={event.id} 
              className="bg-white dark:bg-card rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-all dark:hover:bg-[#262626]"
              onClick={() => navigate(`/evento/${event.id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">{event.date}</p>
                  <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">{event.location}</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground dark:text-[#B3B3B3]" />
              </div>
            </div>
          )) */}
        </div>
        
        <Separator className="my-6 dark:bg-[#2C2C2C]" />
        
        <div className="space-y-3">
          <button 
            className="flex items-center justify-between w-full bg-white dark:bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all dark:hover:bg-[#262626]"
            onClick={() => navigate("/grupos")}
          >
            <div className="flex items-center">
              <Users className="text-accent dark:text-[#FF9E3D] mr-3" size={20} />
              <span>Meus Grupos</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground dark:text-[#B3B3B3] mr-2">{userStats.groups}</span>
              <ChevronRight size={20} className="text-muted-foreground dark:text-[#B3B3B3]" />
            </div>
          </button>
          
          <button 
            className="flex items-center justify-between w-full bg-white dark:bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all dark:hover:bg-[#262626]"
            onClick={() => navigate("/eventos")}
          >
            <div className="flex items-center">
              <CalendarDays className="text-accent dark:text-[#FF9E3D] mr-3" size={20} />
              <span>Meus Eventos</span>
            </div>
            <ChevronRight size={20} className="text-muted-foreground dark:text-[#B3B3B3]" />
          </button>
          
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
      
        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent className="dark:bg-card dark:border-[#2C2C2C]">
            <DialogHeader>
              <DialogTitle className="dark:text-[#EDEDED]">Editar Perfil</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-background dark:border-[#1E1E1E]">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                    <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                      {profile.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="full_name" className="dark:text-[#EDEDED]">Nome</Label>
                <Input 
                  id="full_name" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="dark:text-[#EDEDED]">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio" className="dark:text-[#EDEDED]">Biografia</Label>
                <textarea 
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3] dark:focus:border-primary dark:focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEditProfileOpen(false)}
                className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveProfile}
                className="dark:bg-primary dark:text-white dark:hover:bg-accent"
              >
                Salvar alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Profile;
