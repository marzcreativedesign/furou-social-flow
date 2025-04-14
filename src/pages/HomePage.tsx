
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, CalendarDays, Settings, Bell, X, Check } from "lucide-react";
import Header from "../components/Header";
import MainLayout from "../components/MainLayout";
import EventCard from "../components/EventCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CostCalculator from "@/components/CostCalculator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { NotificationsService } from "@/services/notifications.service";
import { toast } from "sonner";

type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  image_url: string | null;
  is_public: boolean;
  creator_id: string;
  event_participants?: any[];
  confirmed?: boolean;
  type?: "public" | "private" | "group";
  groupName?: string | null;
  attendees?: number;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  related_id: string | null;
  eventName?: string;
  date?: string;
  imageUrl?: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [pendingActions, setPendingActions] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Usuário"; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: userEvents, error: eventsError } = await EventsService.getUserEvents();
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          toast.error("Erro ao carregar eventos");
        } else if (userEvents) {
          const formattedEvents: Event[] = userEvents.map(event => {
            // Find any group associated with this event
            const groupInfo = event.group_events?.[0]?.groups || null;
            
            return {
              ...event,
              confirmed: event.event_participants && event.event_participants.length > 0,
              type: event.is_public ? "public" : (groupInfo ? "group" : "private"),
              groupName: groupInfo?.name || null,
              attendees: event.event_participants?.length || 0,
              date: new Date(event.date).toLocaleString('pt-BR', {
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
              })
            };
          });
          setEvents(formattedEvents);
        }

        const { data: publicEventsData, error: publicEventsError } = await EventsService.getPublicEvents();
        
        if (publicEventsError) {
          console.error("Error fetching public events:", publicEventsError);
        } else if (publicEventsData) {
          const formattedPublicEvents: Event[] = publicEventsData
            .filter(event => event.creator_id !== user?.id)
            .map(event => ({
              ...event,
              confirmed: false,
              type: "public",
              attendees: event.event_participants?.length || 0,
              date: new Date(event.date).toLocaleString('pt-BR', {
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
              })
            }));
          setPublicEvents(formattedPublicEvents);
        }

        const { data: notifications, error: notificationsError } = await NotificationsService.getUserNotifications();
        
        if (notificationsError) {
          console.error("Error fetching notifications:", notificationsError);
        } else if (notifications) {
          const unreadNotifications = notifications
            .filter(notification => !notification.is_read)
            .slice(0, 5)
            .map(notification => ({
              ...notification,
              eventName: notification.title,
              imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3"
            }));
          setPendingActions(unreadNotifications);
        }
      } catch (error) {
        console.error("Error loading homepage data:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredEvents = events.filter(event => {
    if (
      (activeFilter === 'public' && !event.is_public) || 
      (activeFilter === 'private' && (event.is_public || event.type === 'group')) || 
      (activeFilter === 'group' && event.type !== 'group') || 
      (activeFilter === 'confirmed' && !event.confirmed) || 
      (activeFilter === 'missed' && event.confirmed !== false)
    ) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) || 
        (event.groupName && event.groupName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAcceptAction = async (id: string) => {
    try {
      await NotificationsService.markAsRead(id);
      setPendingActions(prevActions => prevActions.filter(action => action.id !== id));
      toast.success("Ação aceita com sucesso");
    } catch (error) {
      console.error("Error accepting action:", error);
      toast.error("Erro ao aceitar ação");
    }
  };

  const handleRejectAction = async (id: string) => {
    try {
      await NotificationsService.markAsRead(id);
      setPendingActions(prevActions => prevActions.filter(action => action.id !== id));
      toast.success("Ação rejeitada");
    } catch (error) {
      console.error("Error rejecting action:", error);
      toast.error("Erro ao rejeitar ação");
    }
  };

  if (loading) {
    return (
      <MainLayout title="Furou?!" showSearch onSearch={handleSearchChange} showDock>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Furou?!" 
      showSearch 
      onSearch={handleSearchChange} 
      showDock 
      rightContent={<>
        <Sheet>
          <SheetTrigger asChild>
            {/* Keep existing trigger content */}
          </SheetTrigger>
          <SheetContent className="dark:bg-card dark:border-[#2C2C2C]">
            <h2 className="text-xl font-bold mb-4 dark:text-[#EDEDED]">Calculadora de Rateio</h2>
            <p className="text-muted-foreground mb-4 dark:text-[#B3B3B3]">
              Divida facilmente o valor de um evento entre os participantes
            </p>
            <CostCalculator isDrawer />
            
            <Button className="w-full mt-4 dark:bg-primary dark:hover:bg-accent" onClick={() => navigate("/calculadora")}>
              Abrir calculadora completa
            </Button>
          </SheetContent>
        </Sheet>
      </>}
    >
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-3 dark:text-[#EDEDED]">Olá, {userName} 👋</h1>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-[#B3B3B3]" size={18} />
            <input 
              type="text" 
              placeholder="Buscar eventos..." 
              className="w-full px-10 py-3 rounded-xl border border-input bg-background hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3] dark:focus:border-primary dark:focus:ring-primary/20" 
              value={searchQuery} 
              onChange={e => handleSearchChange(e.target.value)} 
            />
          </div>
        </div>

        {pendingActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 dark:text-[#EDEDED]">Ações Pendentes</h2>
            <div className="space-y-3">
              {pendingActions.map(action => (
                <div key={action.id} className="bg-accent/10 dark:bg-[#FF6B00]/20 p-4 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={action.imageUrl} alt={action.eventName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-[#EDEDED]">{action.title}</h3>
                      <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">{action.content}</p>
                      <span className="text-xs text-muted-foreground dark:text-[#B3B3B3]">
                        {new Date(action.created_at).toLocaleString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full w-9 h-9 p-0 dark:border-[#2C2C2C] dark:bg-[#262626] dark:hover:bg-[#2C2C2C] dark:text-[#EDEDED]" 
                      onClick={() => handleRejectAction(action.id)}
                    >
                      <X size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      className="rounded-full w-9 h-9 p-0 dark:bg-primary dark:hover:bg-accent" 
                      onClick={() => handleAcceptAction(action.id)}
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            className={`rounded-full whitespace-nowrap ${activeFilter !== 'all' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
            onClick={() => setActiveFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={activeFilter === 'public' ? 'default' : 'outline'} 
            size="sm" 
            className={`rounded-full whitespace-nowrap ${activeFilter !== 'public' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
            onClick={() => setActiveFilter('public')}
          >
            Eventos Públicos
          </Button>
          <Button 
            variant={activeFilter === 'private' ? 'default' : 'outline'} 
            size="sm" 
            className={`rounded-full whitespace-nowrap ${activeFilter !== 'private' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
            onClick={() => setActiveFilter('private')}
          >
            Eventos Privados
          </Button>
          <Button 
            variant={activeFilter === 'group' ? 'default' : 'outline'} 
            size="sm" 
            className={`rounded-full whitespace-nowrap ${activeFilter !== 'group' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
            onClick={() => setActiveFilter('group')}
          >
            Grupos
          </Button>
          <Button 
            variant={activeFilter === 'confirmed' ? 'default' : 'outline'} 
            size="sm" 
            className={`rounded-full whitespace-nowrap ${activeFilter !== 'confirmed' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
            onClick={() => setActiveFilter('confirmed')}
          >
            Confirmados
          </Button>
          <Button 
            variant={activeFilter === 'missed' ? 'default' : 'outline'} 
            size="sm" 
            className={`rounded-full whitespace-nowrap ${activeFilter !== 'missed' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
            onClick={() => setActiveFilter('missed')}
          >
            Furei
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-[#EDEDED]">Seus Eventos</h2>
            <Button variant="ghost" size="sm" asChild className="dark:text-[#FFA756] dark:hover:bg-[#262626]">
              <Link to="/eventos">Ver todos</Link>
            </Button>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <div key={event.id} onClick={() => navigate(`/evento/${event.id}`)} className="cursor-pointer">
                  <EventCard 
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    location={event.location || "Local não definido"}
                    imageUrl={event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3"}
                    attendees={event.attendees || 0}
                    confirmed={event.confirmed}
                    type={event.type as "public" | "private" | "group"}
                    groupName={event.groupName}
                  />
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 bg-muted/20 dark:bg-[#262626]/50 rounded-xl">
              <Search className="mx-auto h-12 w-12 text-muted-foreground dark:text-[#B3B3B3] mb-2" />
              <p className="text-muted-foreground dark:text-[#B3B3B3]">
                Nenhum evento encontrado para "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 dark:bg-[#262626]/50 rounded-xl">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground dark:text-[#B3B3B3] mb-2" />
              <h3 className="text-lg font-medium mb-1 dark:text-[#EDEDED]">Nenhum evento</h3>
              <p className="text-sm text-muted-foreground dark:text-[#B3B3B3] mb-4">
                Você não tem eventos ativos no momento
              </p>
              <Button onClick={() => navigate("/criar")} className="dark:bg-primary dark:hover:bg-accent">
                Criar Evento
              </Button>
            </div>
          )}
        </div>

        {!searchQuery && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-[#EDEDED]">Eventos Públicos</h2>
              <Button variant="ghost" size="sm" asChild className="dark:text-[#FFA756] dark:hover:bg-[#262626]">
                <Link to="/eventos?filter=public">Ver todos</Link>
              </Button>
            </div>
            
            {publicEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicEvents.map(event => (
                  <div key={event.id} onClick={() => navigate(`/evento/${event.id}`)} className="cursor-pointer">
                    <EventCard 
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      location={event.location || "Local não definido"}
                      imageUrl={event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3"}
                      attendees={event.attendees || 0}
                      type="public"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 dark:bg-[#262626]/50 rounded-xl">
                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground dark:text-[#B3B3B3] mb-2" />
                <p className="text-muted-foreground dark:text-[#B3B3B3]">
                  Nenhum evento público disponível
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
