
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Users, PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../components/MainLayout';
import EventCard from '../components/EventCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventQueriesService } from '@/services/event/queries';
import { useToast } from "@/components/ui/use-toast";
import { Event } from "@/types/event";

const ExplorePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("events");

  const { 
    data: events = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['publicEvents'],
    queryFn: async () => {
      const { data, error } = await EventQueriesService.getPublicEvents();
      
      if (error) {
        throw new Error(error.message || 'Erro ao buscar eventos públicos');
      }
      
      return data.map(event => ({
        ...event,
        date: new Date(event.date).toLocaleString('pt-BR', {
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }),
        attendees: event.event_participants?.length || 0
      }));
    }
  });

  // Handle error display separately
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível carregar eventos públicos",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredEvents = events.filter(event => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) ||
        (event.profiles && event.profiles.full_name && event.profiles.full_name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleEventClick = (id: string) => {
    navigate(`/evento/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <MainLayout title="Explorar" showDock>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Descubra novos eventos</h1>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Buscar eventos, locais, pessoas..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="events" className="flex-1">
                <Calendar className="mr-2" size={16} />
                Eventos
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">
                <Users className="mr-2" size={16} />
                Grupos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {activeTab === "events" ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Eventos Públicos</h2>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-1" />
                Filtrar
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-xl">
                <Search className="mx-auto h-12 w-12 text-red-500 mb-3" />
                <h3 className="text-lg font-medium mb-1">Erro ao carregar eventos</h3>
                <p className="text-sm text-red-700 mb-4">
                  {error instanceof Error ? error.message : "Não foi possível carregar os eventos públicos"}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Tentar Novamente
                </Button>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map(event => (
                  <div 
                    key={event.id} 
                    onClick={() => handleEventClick(event.id)} 
                    className="cursor-pointer"
                  >
                    <EventCard 
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      location={event.location || ""}
                      imageUrl={event.image_url || ""}
                      attendees={event.attendees || 0}
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
                  {searchQuery 
                    ? `Não encontramos resultados para "${searchQuery}"` 
                    : "Não há eventos públicos disponíveis"}
                </p>
                <Button onClick={() => navigate('/criar')}>Criar um evento</Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">Recursos de grupos em breve</h3>
            <p className="text-muted-foreground mb-4">
              Estamos trabalhando para trazer a descoberta de grupos em breve!
            </p>
            <Button 
              variant="outline"
              onClick={() => setActiveTab("events")}
              className="mr-2"
            >
              Ver eventos
            </Button>
            <Button onClick={() => navigate('/grupos')}>
              <PlusCircle size={16} className="mr-1" />
              Criar grupo
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExplorePage;
