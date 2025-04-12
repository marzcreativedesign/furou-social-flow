
import { useState } from "react";
import { X, Check, User, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Mock data for different notification types
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Lembrete de evento",
    content: "Não esqueça do Happy Hour hoje às 19h",
    time: "10 minutos atrás",
    read: false,
    type: "event_reminder"
  },
  {
    id: "2",
    title: "Nova confirmação",
    content: "João Silva confirmou presença no seu evento",
    time: "30 minutos atrás",
    read: true,
    type: "rsvp_confirmation"
  },
  {
    id: "3",
    title: "Novo comentário",
    content: "Ana deixou um comentário no evento 'Aniversário da Marina'",
    time: "2 horas atrás",
    read: true,
    type: "comment"
  },
  {
    id: "5",
    title: "Evento cancelado",
    content: "O evento 'Reunião de Time' foi cancelado pelo organizador",
    time: "1 dia atrás",
    read: true,
    type: "event_canceled"
  }
];

const MOCK_INVITES = [
  {
    id: "4",
    name: "Colegas do Trabalho",
    type: "group",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80",
    inviter: "Carlos Oliveira",
    time: "5 horas atrás",
  },
  {
    id: "6",
    name: "Aniversário da Marina",
    type: "event",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    inviter: "Marina Santos",
    time: "1 dia atrás",
    date: "Sábado, 20:00"
  }
];

const NEARBY_EVENTS = [
  {
    id: "7",
    name: "Festival de Jazz",
    location: "Parque Ibirapuera",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
    distance: "800m",
    time: "Hoje, 19:00"
  },
  {
    id: "8",
    name: "Exposição de Arte Moderna",
    location: "MASP",
    image: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    distance: "1.2km",
    time: "Amanhã, 10:00"
  }
];

const PENDING_ACTIONS = [
  {
    id: "9",
    eventName: "Churrasco de Domingo",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    type: "payment",
    amount: "R$ 45,00",
    requester: "Pedro Almeida",
    time: "2 dias atrás"
  },
  {
    id: "10",
    eventName: "Happy Hour no Bar do Zé",
    image: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    type: "confirmation",
    time: "Hoje, 19:00",
    requester: "Grupo Amigos da Faculdade"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [invites, setInvites] = useState(MOCK_INVITES);
  const [nearbyEvents, setNearbyEvents] = useState(NEARBY_EVENTS);
  const [pendingActions, setPendingActions] = useState(PENDING_ACTIONS);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDismissAll = () => {
    setNotifications([]);
    toast({
      title: "Notificações removidas",
      description: "Todas as notificações foram removidas",
    });
  };
  
  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso",
    });
  };

  const handleAccept = (id: string, type: string) => {
    if (type === 'invite') {
      setInvites(invites.filter(invite => invite.id !== id));
      toast({
        title: "Convite aceito",
        description: "Você aceitou o convite com sucesso",
      });
    } else if (type === 'action') {
      setPendingActions(pendingActions.filter(action => action.id !== id));
      toast({
        title: "Ação concluída",
        description: "Você completou a ação com sucesso",
      });
    }
  };

  const handleReject = (id: string, type: string) => {
    if (type === 'invite') {
      setInvites(invites.filter(invite => invite.id !== id));
      toast({
        title: "Convite recusado",
        description: "Você recusou o convite",
      });
    } else if (type === 'action') {
      setPendingActions(pendingActions.filter(action => action.id !== id));
      toast({
        title: "Ação recusada",
        description: "Você recusou a ação",
      });
    }
  };

  const handleNavigateToEvent = (id: string) => {
    navigate(`/evento/${id}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };
  
  return (
    <MainLayout
      title="Notificações"
      showBack
      onBack={handleBackToHome}
      rightContent={
        notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleDismissAll}>
            Limpar tudo
          </Button>
        )
      }
    >
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
          <TabsTrigger value="nearby">Próximos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="p-1 sm:p-4">
          <div className="space-y-6">
            {/* Pending Actions Section */}
            {pendingActions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Ações Pendentes</h2>
                <div className="space-y-3">
                  {pendingActions.map((action) => (
                    <div key={action.id} className="bg-accent/10 p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={action.image} alt={action.eventName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">{action.type === 'payment' ? 'Pagamento pendente' : 'Confirmação de presença'}</h3>
                          <p className="text-sm">{action.eventName}</p>
                          {action.type === 'payment' && <p className="text-sm font-semibold">{action.amount}</p>}
                          <span className="text-xs text-muted-foreground">{action.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="rounded-full w-9 h-9 p-0" 
                          onClick={() => handleReject(action.id, 'action')}
                        >
                          <X size={16} />
                        </Button>
                        <Button 
                          size="sm"
                          className="rounded-full w-9 h-9 p-0" 
                          onClick={() => handleAccept(action.id, 'action')}
                        >
                          <Check size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            {/* Invites Section */}
            {invites.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Convites</h2>
                <div className="space-y-3">
                  {invites.map((invite) => (
                    <div key={invite.id} className="bg-accent/10 p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={invite.image} alt={invite.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">{invite.name}</h3>
                          <p className="text-sm">{invite.type === 'group' ? 'Convite para grupo' : 'Convite para evento'}</p>
                          <p className="text-xs text-muted-foreground">Por {invite.inviter}</p>
                          {invite.date && <p className="text-xs">{invite.date}</p>}
                          <span className="text-xs text-muted-foreground">{invite.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="rounded-full w-9 h-9 p-0" 
                          onClick={() => handleReject(invite.id, 'invite')}
                        >
                          <X size={16} />
                        </Button>
                        <Button 
                          size="sm"
                          className="rounded-full w-9 h-9 p-0" 
                          onClick={() => handleAccept(invite.id, 'invite')}
                        >
                          <Check size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            {/* Notifications List */}
            {notifications.length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">Notificações</h2>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg relative ${
                        notification.read ? "bg-muted/30" : "bg-muted"
                      }`}
                    >
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => handleDismiss(notification.id)}
                        aria-label="Fechar notificação"
                      >
                        <X size={16} />
                      </Button>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.content}
                      </p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {notification.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Nearby Events Section */}
            {nearbyEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Eventos Próximos</h2>
                <div className="space-y-3">
                  {nearbyEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-accent/10 p-4 rounded-lg cursor-pointer"
                      onClick={() => handleNavigateToEvent(event.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>{event.time}</span>
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {event.distance} de distância
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state if needed */}
            {notifications.length === 0 && invites.length === 0 && pendingActions.length === 0 && nearbyEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[70vh]">
                <span className="text-4xl mb-4">🔔</span>
                <h2 className="text-xl font-medium mb-2">Nenhuma notificação</h2>
                <p className="text-muted-foreground text-center">
                  Você não tem notificações no momento
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="invites" className="p-1 sm:p-4">
          {invites.length > 0 ? (
            <div className="space-y-3">
              {invites.map((invite) => (
                <div key={invite.id} className="bg-accent/10 p-4 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={invite.image} alt={invite.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium">{invite.name}</h3>
                      <p className="text-sm">{invite.type === 'group' ? 'Convite para grupo' : 'Convite para evento'}</p>
                      <p className="text-xs text-muted-foreground">Por {invite.inviter}</p>
                      {invite.date && <p className="text-xs">{invite.date}</p>}
                      <span className="text-xs text-muted-foreground">{invite.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full w-9 h-9 p-0" 
                      onClick={() => handleReject(invite.id, 'invite')}
                    >
                      <X size={16} />
                    </Button>
                    <Button 
                      size="sm"
                      className="rounded-full w-9 h-9 p-0" 
                      onClick={() => handleAccept(invite.id, 'invite')}
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Nenhum convite</h2>
              <p className="text-muted-foreground text-center">
                Você não tem convites pendentes no momento
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="actions" className="p-1 sm:p-4">
          {pendingActions.length > 0 ? (
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="bg-accent/10 p-4 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={action.image} alt={action.eventName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.type === 'payment' ? 'Pagamento pendente' : 'Confirmação de presença'}</h3>
                      <p className="text-sm">{action.eventName}</p>
                      {action.type === 'payment' && <p className="text-sm font-semibold">{action.amount}</p>}
                      <span className="text-xs text-muted-foreground">{action.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full w-9 h-9 p-0" 
                      onClick={() => handleReject(action.id, 'action')}
                    >
                      <X size={16} />
                    </Button>
                    <Button 
                      size="sm"
                      className="rounded-full w-9 h-9 p-0" 
                      onClick={() => handleAccept(action.id, 'action')}
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Nenhuma ação pendente</h2>
              <p className="text-muted-foreground text-center">
                Você não tem ações pendentes no momento
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="nearby" className="p-1 sm:p-4">
          {nearbyEvents.length > 0 ? (
            <div className="space-y-3">
              {nearbyEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-accent/10 p-4 rounded-lg cursor-pointer"
                  onClick={() => handleNavigateToEvent(event.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium">{event.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>{event.time}</span>
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {event.distance} de distância
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Nenhum evento próximo</h2>
              <p className="text-muted-foreground text-center">
                Não há eventos próximos de você no momento
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Notifications;
