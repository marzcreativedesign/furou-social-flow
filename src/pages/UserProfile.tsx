import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MainLayout from "../components/MainLayout";
import UserHeader from "@/components/user-profile/UserHeader";
import UserStats from "@/components/user-profile/UserStats";
import UserEvents from "@/components/user-profile/UserEvents";

// Extended mock user data for testing
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
  },
  "4": {
    id: "4",
    name: "Mariana Costa",
    bio: "Amo viajar, explorar novos lugares e fazer novas amizades!",
    email: "mariana@email.com",
    avatar: "https://i.pravatar.cc/300?u=4",
    phone: "(11) 98888-7777",
    stats: {
      eventsCreated: 8,
      eventsAttended: 20,
      eventsMissed: 1,
    },
  },
  "5": {
    id: "5",
    name: "Rafael Mendes",
    bio: "Organizador de festas e eventos culturais. DJ nas horas vagas.",
    email: "rafael@email.com",
    avatar: "https://i.pravatar.cc/300?u=5",
    phone: "(11) 97777-6666",
    stats: {
      eventsCreated: 15,
      eventsAttended: 25,
      eventsMissed: 0,
    },
  }
};

// Extended mock events for testing
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
  ],
  "4": [
    {
      id: "5",
      title: "Aula de Dança",
      date: "Quinta-feira, 19:30",
      location: "Estúdio Dance",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      attendees: 20,
    },
    {
      id: "6",
      title: "Exposição de Arte",
      date: "Sábado, 14:00",
      location: "MASP",
      imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      attendees: 35,
    }
  ],
  "5": [
    {
      id: "7",
      title: "Festa de Aniversário",
      date: "Sexta-feira, 22:00",
      location: "Club XYZ",
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      attendees: 100,
    },
    {
      id: "8",
      title: "Show de Rock",
      date: "Sábado, 21:00",
      location: "Bar da Esquina",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      attendees: 45,
    },
    {
      id: "9",
      title: "Festival de Jazz",
      date: "Domingo, 17:00",
      location: "Parque Villa-Lobos",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      attendees: 80,
    }
  ]
};

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = MOCK_USERS[id as keyof typeof MOCK_USERS];
  const userEvents = MOCK_USER_EVENTS[id as keyof typeof MOCK_USER_EVENTS] || [];
  
  const handleBack = () => {
    navigate(-1);
  };

  // If user not found
  if (!user) {
    return (
      <MainLayout showBack onBack={handleBack} title="Perfil">
        <div className="h-[80vh] flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-2 dark:text-[#EDEDED]">Usuário não encontrado</h1>
          <p className="text-muted-foreground mb-4 dark:text-[#B3B3B3]">
            O usuário que você está procurando não existe.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="dark:bg-primary dark:hover:bg-accent"
          >
            Voltar para a Home
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showBack onBack={handleBack} title="Perfil">
      <div className="px-4 py-6">
        <UserHeader 
          user={{
            name: user.name,
            bio: user.bio,
            avatar: user.avatar
          }}
        />
        
        <UserStats stats={user.stats} />
        
        <Separator className="my-6 dark:bg-[#2C2C2C]" />
        
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 dark:text-[#EDEDED]">Eventos Participados</h3>
          <UserEvents events={userEvents} />
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
