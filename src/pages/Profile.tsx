
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, LogOut, ChevronRight, CalendarDays, Users } from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import MainLayout from "../components/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Extended user data for testing
const MOCK_USER = {
  id: "1",
  name: "Carlos Oliveira",
  email: "carlos@email.com",
  avatar: "https://i.pravatar.cc/300?u=1",
  phone: "(11) 98765-4321",
  bio: "Entusiasta de música e eventos culturais. Sempre buscando conhecer pessoas novas!",
  events: {
    created: 5,
    attended: 12,
    missed: 2,
  },
  groups: 3,
};

// Extended mock events for testing
const MOCK_USER_EVENTS = [
  {
    id: "1",
    title: "Happy Hour no Bar do Zé",
    date: "Hoje, 19:00",
    location: "Bar do Zé",
    attendees: 8,
  },
  {
    id: "4",
    title: "Festival de Música",
    date: "Próximo Sábado, 16:00",
    location: "Parque Ibirapuera",
    attendees: 50,
  },
  {
    id: "6", 
    title: "Aniversário da Mariana",
    date: "Domingo, 15:00",
    location: "Casa da Mariana",
    attendees: 20,
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(MOCK_USER);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio || "",
  });

  const handleEditProfile = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio || "",
    });
    setEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
    }));
    
    setEditProfileOpen(false);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta",
    });
    
    navigate("/login");
  };

  return (
    <MainLayout title="Meu Perfil">
      <div className="px-4 py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-background dark:border-[#1E1E1E]">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          
          {user.bio && (
            <p className="mt-2 text-sm max-w-md text-muted-foreground dark:text-[#B3B3B3]">
              {user.bio}
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
            <p className="text-lg font-bold text-primary dark:text-primary">{user.events.created}</p>
            <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Eventos criados</p>
          </div>
          <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-green-500 dark:text-[#4CAF50]">{user.events.attended}</p>
            <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">Participações</p>
          </div>
          <div className="bg-white dark:bg-card rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-rose-500 dark:text-[#FF4C4C]">{user.events.missed}</p>
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
          
          {MOCK_USER_EVENTS.map(event => (
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
          ))}
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
              <span className="text-sm text-muted-foreground dark:text-[#B3B3B3] mr-2">{user.groups}</span>
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
        </div>
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
                  <Camera size={14} />
                </button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name" className="dark:text-[#EDEDED]">Nome</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
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
                onChange={handleInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone" className="dark:text-[#EDEDED]">Telefone</Label>
              <Input 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
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
    </MainLayout>
  );
};

export default Profile;
