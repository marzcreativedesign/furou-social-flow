
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, LogOut, ChevronRight, CalendarDays, Users } from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MOCK_USER = {
  id: "1",
  name: "Carlos Oliveira",
  email: "carlos@email.com",
  avatar: "https://i.pravatar.cc/300?u=1",
  phone: "(11) 98765-4321",
  events: {
    created: 5,
    attended: 12,
    missed: 2,
  },
  groups: 3,
};

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
];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(MOCK_USER);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleEditProfile = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    }));
    
    setEditProfileOpen(false);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="pb-20">
      <Header title="Meu Perfil" />
      
      <div className="px-4 py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleEditProfile}
          >
            <Edit size={16} className="mr-2" />
            Editar perfil
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-primary">{user.events.created}</p>
            <p className="text-xs text-muted-foreground">Eventos criados</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-green-500">{user.events.attended}</p>
            <p className="text-xs text-muted-foreground">Participações</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-rose-500">{user.events.missed}</p>
            <p className="text-xs text-muted-foreground">Furadas</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Seus eventos</h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/eventos")}>
              Ver todos
            </Button>
          </div>
          
          {MOCK_USER_EVENTS.map(event => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl p-4 mb-3 shadow-sm"
              onClick={() => navigate(`/evento/${event.id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-3">
          <button 
            className="flex items-center justify-between w-full bg-white p-4 rounded-xl shadow-sm"
            onClick={() => navigate("/grupos")}
          >
            <div className="flex items-center">
              <Users className="text-accent mr-3" size={20} />
              <span>Meus Grupos</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">{user.groups}</span>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </button>
          
          <button 
            className="flex items-center justify-between w-full bg-white p-4 rounded-xl shadow-sm"
            onClick={() => navigate("/eventos")}
          >
            <div className="flex items-center">
              <CalendarDays className="text-accent mr-3" size={20} />
              <span>Meus Eventos</span>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-rose-500 mt-6"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>
      
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
                  <Camera size={14} />
                </button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProfile}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
