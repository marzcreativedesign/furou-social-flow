
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, CalendarIcon, Filter } from "lucide-react";
import MainLayout from "../components/MainLayout";
import EventCard from "../components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventsService } from "@/services/events.service";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  imageUrl?: string;
  image_url?: string | null;
  attendees: number;
  type: "public" | "private" | "group";
  event_participants?: {
    id: string;
    user_id: string;
    status: string;
  }[];
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

const ExplorePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSearchByLocation, setIsSearchByLocation] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPublicEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await EventsService.getPublicEvents();
        
        if (error) {
          console.error("Error fetching public events:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os eventos públicos",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          const formattedEvents: Event[] = data.map(event => ({
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
            event_participants: event.event_participants,
            profiles: event.profiles,
            type: "public"
          }));
          
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error loading public events:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os eventos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicEvents();
  }, [toast]);
  
  const filteredEvents = events.filter(event => {
    if (!searchQuery && !zipCode) return true;
    
    if (isSearchByLocation && zipCode) {
      // Simple implementation - in a real app, we would use a CEP API
      return event.location?.includes(zipCode) || false;
    }
    
    if (!isSearchByLocation && searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const handleEventClick = (id: string) => {
    navigate(`/evento/${id}`);
  };

  const toggleSearchMode = () => {
    setIsSearchByLocation(!isSearchByLocation);
    setSearchQuery('');
    setZipCode('');
  };
  
  return (
    <MainLayout
      title="Explorar"
      showSearch
      onSearch={(query) => setSearchQuery(query)}
    >
      <div className="p-4 max-w-7xl mx-auto">
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-lg mb-3">Encontre eventos próximos</h2>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant={!isSearchByLocation ? "default" : "outline"} 
              onClick={() => setIsSearchByLocation(false)}
              size="sm"
            >
              <Search className="h-4 w-4 mr-1" />
              Nome ou Local
            </Button>
            <Button 
              variant={isSearchByLocation ? "default" : "outline"} 
              onClick={() => setIsSearchByLocation(true)}
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Por CEP
            </Button>
          </div>
          
          {isSearchByLocation ? (
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Digite o CEP para encontrar eventos próximos"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="pl-10"
                maxLength={9}
              />
              <p className="text-xs text-muted-foreground mt-1">Ex: 01310-200</p>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Busque por nome de evento ou localização"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>

        <h2 className="font-bold text-xl mb-4">Eventos públicos</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
                <EventCard 
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location || ""}
                  imageUrl={event.imageUrl || event.image_url || ""}
                  attendees={event.attendees}
                  type="public"
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
              {searchQuery || zipCode ? 
                "Não encontramos eventos com esses termos de busca." : 
                "Não há eventos públicos disponíveis no momento."}
            </p>
            <Button onClick={() => navigate('/criar')}>Criar um evento</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExplorePage;
