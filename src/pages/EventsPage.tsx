
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Filter, MapPin, Search } from "lucide-react";
import MainLayout from "../components/MainLayout";
import EventCard from "../components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { EventsService } from "@/services/events.service";
import { useToast } from "@/components/ui/use-toast";

type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';
type Event = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  imageUrl?: string;
  image_url?: string | null;
  attendees: number;
  confirmed?: boolean;
  type: "public" | "private" | "group";
  groupName?: string | null;
};

const EventsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data: userEvents, error } = await EventsService.getUserEvents();
        
        if (error) {
          console.error("Error fetching events:", error);
          toast({
            title: "Erro ao carregar eventos",
            description: "Não foi possível carregar seus eventos",
            variant: "destructive",
          });
          return;
        }
        
        if (userEvents) {
          const formattedEvents: Event[] = userEvents.map((event: any) => {
            const groupInfo = event.group_events?.[0]?.groups || null;
            
            return {
              id: event.id,
              title: event.title,
              date: new Date(event.date).toLocaleString('pt-BR', {
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
              }),
              location: event.location,
              imageUrl: event.image_url,
              attendees: event.event_participants?.length || 0,
              confirmed: event.event_participants && event.event_participants.some((p: any) => p.status === 'confirmed'),
              type: event.is_public ? "public" : (groupInfo ? "group" : "private"),
              groupName: groupInfo?.name || null
            };
          });
          
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os eventos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast]);
  
  // Filter events based on the active filter and search/location queries
  const filteredEvents = events.filter(event => {
    // Filter by event type
    if (
      (activeFilter === 'public' && event.type !== 'public') || 
      (activeFilter === 'private' && event.type !== 'private') || 
      (activeFilter === 'group' && event.type !== 'group') || 
      (activeFilter === 'confirmed' && !event.confirmed) || 
      (activeFilter === 'missed' && event.confirmed !== false)
    ) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(query);
      const matchesLocation = event.location?.toLowerCase().includes(query) || false;
      const matchesGroup = event.groupName?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesLocation && !matchesGroup) {
        return false;
      }
    }

    // Filter by location
    if (locationQuery && !event.location?.toLowerCase().includes(locationQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value);
  };

  const handleEventClick = (id: string) => {
    navigate(`/evento/${id}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <MainLayout
      title="Eventos" 
      showBack 
      onBack={handleBackToHome} 
      showSearch 
      onSearch={handleSearchChange}
      rightContent={
        <>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Filter size={20} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filtrar por localização</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <div className="relative mb-4">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input placeholder="Digite uma localização..." value={locationQuery} onChange={handleLocationChange} className="pl-10" />
                </div>
                <h3 className="font-medium mb-2">Explorar por localização</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocationQuery("São Paulo")}>
                    <MapPin size={16} className="mr-2" />
                    São Paulo
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocationQuery("Rio de Janeiro")}>
                    <MapPin size={16} className="mr-2" />
                    Rio de Janeiro
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocationQuery("Belo Horizonte")}>
                    <MapPin size={16} className="mr-2" />
                    Belo Horizonte
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocationQuery("Porto Alegre")}>
                    <MapPin size={16} className="mr-2" />
                    Porto Alegre
                  </Button>
                </div>
              </div>
              <DrawerFooter>
                <Button onClick={() => setLocationQuery("")} variant="outline">Limpar filtros</Button>
                <DrawerClose asChild>
                  <Button>Aplicar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      }
    >
      <div className="px-4 py-4">
        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          <Button variant={activeFilter === 'all' ? 'default' : 'outline'} size="sm" className="rounded-full whitespace-nowrap" onClick={() => setActiveFilter('all')}>
            Todos
          </Button>
          <Button variant={activeFilter === 'public' ? 'default' : 'outline'} size="sm" className="rounded-full whitespace-nowrap" onClick={() => setActiveFilter('public')}>
            Eventos Públicos
          </Button>
          <Button variant={activeFilter === 'private' ? 'default' : 'outline'} size="sm" className="rounded-full whitespace-nowrap" onClick={() => setActiveFilter('private')}>
            Eventos Privados
          </Button>
          <Button variant={activeFilter === 'group' ? 'default' : 'outline'} size="sm" className="rounded-full whitespace-nowrap" onClick={() => setActiveFilter('group')}>
            Grupos
          </Button>
          <Button variant={activeFilter === 'confirmed' ? 'default' : 'outline'} size="sm" className="rounded-full whitespace-nowrap" onClick={() => setActiveFilter('confirmed')}>
            Confirmados
          </Button>
          <Button variant={activeFilter === 'missed' ? 'default' : 'outline'} size="sm" className="rounded-full whitespace-nowrap" onClick={() => setActiveFilter('missed')}>
            Furei
          </Button>
        </div>
        
        {/* Location filter info */}
        {locationQuery && (
          <div className="bg-muted/30 p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <MapPin size={18} className="text-primary mr-2" />
              <span>Eventos em: <strong>{locationQuery}</strong></span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocationQuery("")}>
              Limpar
            </Button>
          </div>
        )}
        
        {/* Events grid */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
                <EventCard 
                  id={event.id} 
                  title={event.title} 
                  date={event.date} 
                  location={event.location || ''} 
                  imageUrl={event.imageUrl || event.image_url || ''} 
                  attendees={event.attendees} 
                  confirmed={event.confirmed} 
                  type={event.type} 
                  groupName={event.groupName} 
                  size="large" 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || locationQuery ? "Não encontramos eventos com esses filtros." : "Não há eventos disponíveis no momento."}
            </p>
            <Button onClick={() => navigate('/criar')}>Criar um evento</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EventsPage;
