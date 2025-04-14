import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CostCalculator from "@/components/CostCalculator";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { NotificationsService } from "@/services/notifications.service";
import { toast } from "sonner";
import PendingActions from "@/components/home/PendingActions";
import EventTypeFilters from "@/components/home/EventTypeFilters";
import EventsList from "@/components/home/EventsList";
import SearchInput from "@/components/home/SearchInput";

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
  group_events?: { groups?: { name: string } }[];
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
  const [events, setEvents] = useState<any[]>([]);
  const [publicEvents, setPublicEvents] = useState<any[]>([]);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
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

  const handlePendingActionComplete = (id: string) => {
    setPendingActions(prevActions => prevActions.filter(action => action.id !== id));
  };

  return (
    <MainLayout title="Furou?!" showSearch onSearch={setSearchQuery} showDock>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-3 dark:text-[#EDEDED]">Olá, {userName} 👋</h1>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        <PendingActions 
          actions={pendingActions} 
          onActionComplete={handlePendingActionComplete} 
        />

        <EventTypeFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        <div className="mb-8">
          <EventsList 
            title="Seus Eventos"
            events={filteredEvents}
            showViewAll
            viewAllLink="/eventos"
            emptyMessage={searchQuery ? `Nenhum evento encontrado para "${searchQuery}"` : "Você não tem eventos ativos no momento"}
            onCreateEvent={() => navigate("/criar")}
          />
        </div>

        {!searchQuery && (
          <EventsList 
            title="Eventos Públicos"
            events={publicEvents}
            showViewAll
            viewAllLink="/eventos?filter=public"
          />
        )}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          {/* Keep existing trigger content */}
            <Button variant="ghost" className="mr-2 px-0 dark:text-[#EDEDED] hover:bg-accent dark:hover:bg-[#262626]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-settings mr-2 h-4 w-4"
              >
                <path d="M12.22 2.02h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73-.73H2.02a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 0 2l-.08.15a2 2 0 0 0-.73 2.73v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73.73h.18a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.73-1l-.25-.43a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73v-.18a2 2 0 0 0-2-2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1-1.73l-.43-.25a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73Z" />
                <path d="M12 8v8" />
              </svg>
              Calculadora
            </Button>
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
    </MainLayout>
  );
};

export default HomePage;
