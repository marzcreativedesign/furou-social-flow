
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, MessageCircle, Users, ArrowLeft, Share2 } from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import EventCard from "../components/EventCard";

// Mock user data - in a real app this would come from an API
const MOCK_USERS = {
  "1": {
    id: "1",
    name: "Carlos Oliveira",
    bio: "Entusiasta de música e eventos culturais. Sempre buscando conhecer pessoas novas!",
    email: "carlos@email.com",
    avatar: "https://i.pravatar.cc/300?u=1",
    phone: "(11) 98765-4321",
    stats: {
      eventsCreated: 5,
      eventsAttended: 12,
      eventsMissed: 2,
    },
  },
  "2": {
    id: "2",
    name: "Ana Silva",
    bio: "Adoro festas e encontrar amigos. Amo fotografia e compartilhar momentos!",
    email: "ana@email.com",
    avatar: "https://i.pravatar.cc/300?u=2",
    phone: "(11) 97654-3210",
    stats: {
      eventsCreated: 3,
      eventsAttended: 8,
      eventsMissed: 1,
    },
  },
  "3": {
    id: "3",
    name: "Pedro Santos",
    bio: "Fã de música ao vivo e cerveja artesanal. Sempre em busca de novos bares!",
    email: "pedro@email.com",
    avatar: "https://i.pravatar.cc/300?u=3",
    phone: "(11) 96543-2109",
    stats: {
      eventsCreated: 2,
      eventsAttended: 15,
      eventsMissed: 3,
    },
  }
};

// Mock events that the user has participated in
const MOCK_USER_EVENTS = {
  "1": [
    {
      id: "1",
      title: "Happy Hour no Bar do Zé",
      date: "Hoje, 19:00",
      location: "Bar do Zé",
      imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      attendees: 8,
    },
    {
      id: "4",
      title: "Festival de Música",
      date: "Próximo Sábado, 16:00",
      location: "Parque Ibirapuera",
      imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      attendees: 50,
    }
  ],
  "2": [
    {
      id: "2",
      title: "Aniversário da Marina",
      date: "Amanhã, 20:00",
      location: "Alameda Santos, 1000",
      imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      attendees: 15,
    }
  ],
  "3": [
    {
      id: "3",
      title: "Churrasco de Domingo",
      date: "Domingo, 12:00",
      location: "Av. Paulista, 1000",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      attendees: 12,
    }
  ]
};

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(MOCK_USERS[id as keyof typeof MOCK_USERS]);
  const [userEvents, setUserEvents] = useState(MOCK_USER_EVENTS[id as keyof typeof MOCK_USER_EVENTS] || []);
  
  const handleBack = () => {
    navigate(-1);
  };

  // If user not found
  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">Usuário não encontrado</h1>
        <p className="text-muted-foreground mb-4">O usuário que você está procurando não existe.</p>
        <Button onClick={() => navigate('/')}>Voltar para a Home</Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header showBack onBack={handleBack} title="Perfil" />
      
      <div className="px-4 py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{user.name}</h2>
          
          {user.bio && (
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              {user.bio}
            </p>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => alert('Função de mensagem em breve!')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Mensagem
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert('Função de compartilhar em breve!')}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-primary">{user.stats.eventsCreated}</p>
            <p className="text-xs text-muted-foreground">Eventos criados</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-green-500">{user.stats.eventsAttended}</p>
            <p className="text-xs text-muted-foreground">Participações</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-rose-500">{user.stats.eventsMissed}</p>
            <p className="text-xs text-muted-foreground">Furadas</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">Eventos Participados</h3>
          
          {userEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {userEvents.map(event => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/evento/${event.id}`)}
                >
                  <div className="flex h-24">
                    <div 
                      className="w-24 h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.imageUrl})` }}
                    ></div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium line-clamp-2">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs flex items-center">
                          <Users size={12} className="mr-1" />
                          <span>{event.attendees} confirmados</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-xl">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">Sem histórico de eventos</h3>
              <p className="text-sm text-muted-foreground">
                Este usuário ainda não participou de nenhum evento
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default UserProfile;
