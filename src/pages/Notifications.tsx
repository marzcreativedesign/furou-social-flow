
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, X, User, Users, Calendar } from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Mock data for notifications
const MOCK_NOTIFICATIONS = {
  events: [
    {
      id: "1",
      type: "event_invitation",
      title: "Happy Hour no Bar do Zé",
      message: "Carlos te convidou para um evento",
      time: "Hoje, 19:00",
      image: "https://i.pravatar.cc/150?u=1",
      eventId: "1",
      status: "pending"
    },
    {
      id: "2",
      type: "event_reminder",
      title: "Aniversário da Marina",
      message: "Evento acontecerá amanhã",
      time: "Amanhã, 20:00",
      image: "https://i.pravatar.cc/150?u=2",
      eventId: "2",
      status: "pending"
    },
    {
      id: "3",
      type: "event_update",
      title: "Festival de Música",
      message: "Local do evento foi alterado",
      time: "Sábado, 16:00",
      image: "https://i.pravatar.cc/150?u=3",
      eventId: "4",
      status: "seen"
    },
  ],
  groups: [
    {
      id: "1",
      type: "group_invitation",
      title: "Amigos da Faculdade",
      message: "Ana te convidou para este grupo",
      image: "https://i.pravatar.cc/150?u=4",
      groupId: "1",
      status: "pending"
    },
    {
      id: "2",
      type: "group_new_member",
      title: "Colegas de Trabalho",
      message: "Pedro entrou no grupo",
      image: "https://i.pravatar.cc/150?u=5",
      groupId: "2",
      status: "seen"
    },
  ],
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const handleAcceptInvitation = (type: "events" | "groups", id: string) => {
    setNotifications(prev => {
      const category = [...prev[type]];
      const index = category.findIndex(item => item.id === id);
      
      if (index !== -1) {
        category[index] = { ...category[index], status: "accepted" };
      }
      
      return { ...prev, [type]: category };
    });
    
    toast({
      title: "Convite aceito",
      description: type === "events" ? "Você aceitou o convite para o evento" : "Você aceitou o convite para o grupo"
    });
  };
  
  const handleRejectInvitation = (type: "events" | "groups", id: string) => {
    setNotifications(prev => {
      return {
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      };
    });
    
    toast({
      title: "Convite recusado",
      description: type === "events" ? "Você recusou o convite para o evento" : "Você recusou o convite para o grupo"
    });
  };
  
  const renderNotificationItem = (item: any, type: "events" | "groups") => {
    const isPending = item.status === "pending";
    let icon;
    
    switch (item.type) {
      case "event_invitation":
      case "event_reminder":
      case "event_update":
        icon = <Calendar size={18} className="text-accent" />;
        break;
      case "group_invitation":
      case "group_new_member":
        icon = <Users size={18} className="text-accent" />;
        break;
      default:
        icon = <Bell size={18} className="text-accent" />;
    }
    
    return (
      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm mb-3">
        <div className="flex items-center">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={item.image} alt={item.title} />
              <AvatarFallback>
                {item.title.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -right-1 -bottom-1 bg-background p-1 rounded-full">
              {icon}
            </div>
          </div>
          
          <div className="ml-3 flex-1">
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.message}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
          </div>
        </div>
        
        {isPending && (
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => handleRejectInvitation(type, item.id)}
              className="p-2 rounded-full bg-muted hover:bg-rose-100"
            >
              <X size={18} className="text-rose-500" />
            </button>
            <button
              onClick={() => handleAcceptInvitation(type, item.id)}
              className="p-2 rounded-full bg-muted hover:bg-emerald-100"
            >
              <Check size={18} className="text-emerald-500" />
            </button>
          </div>
        )}
        
        {!isPending && (
          <div className="text-right mt-2">
            <Link 
              to={`/${type === "events" ? "evento" : "grupo"}/${type === "events" ? item.eventId : item.groupId}`}
              className="text-sm text-primary font-medium"
            >
              Ver detalhes
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pb-20">
      <Header title="Notificações" />
      
      <div className="px-4 py-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {notifications.events.map(item => renderNotificationItem(item, "events"))}
              {notifications.groups.map(item => renderNotificationItem(item, "groups"))}
              
              {notifications.events.length === 0 && notifications.groups.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">Sem notificações</h3>
                  <p className="text-sm text-muted-foreground">
                    Você não tem notificações no momento
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-4">
            <div className="space-y-4">
              {notifications.events.map(item => renderNotificationItem(item, "events"))}
              
              {notifications.events.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">Sem notificações</h3>
                  <p className="text-sm text-muted-foreground">
                    Você não tem notificações de eventos
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="groups" className="mt-4">
            <div className="space-y-4">
              {notifications.groups.map(item => renderNotificationItem(item, "groups"))}
              
              {notifications.groups.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">Sem notificações</h3>
                  <p className="text-sm text-muted-foreground">
                    Você não tem notificações de grupos
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Notifications;
