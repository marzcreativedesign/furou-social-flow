
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Filter, MapPin, Search, Hash } from "lucide-react";
import MainLayout from "../components/MainLayout";
import EventCard from "../components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock events
const MOCK_EVENTS = [{
  id: "event-123456",
  title: "Happy Hour no Bar do Zé",
  date: "Hoje, 19:00",
  location: "Bar do Zé",
  imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  attendees: 8,
  confirmed: true,
  type: "public",
  groupName: null
}, {
  id: "event-234567",
  title: "Aniversário da Marina",
  date: "Amanhã, 20:00",
  location: "Alameda Santos, 1000",
  imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  attendees: 15,
  confirmed: false,
  type: "private",
  groupName: null
}, {
  id: "event-345678",
  title: "Churrasco de Domingo",
  date: "Domingo, 12:00",
  location: "Av. Paulista, 1000",
  imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  attendees: 12,
  confirmed: true,
  type: "group",
  groupName: "Amigos da Faculdade"
}, {
  id: "event-456789",
  title: "Festival de Música",
  date: "Próx. Sábado, 16:00",
  location: "Parque Ibirapuera",
  imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  attendees: 50,
  confirmed: true,
  type: "public",
  groupName: null
}, {
  id: "event-567890",
  title: "Exposição de Arte",
  date: "Próx. Sábado, 10:00",
  location: "MASP",
  imageUrl: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  attendees: 30,
  confirmed: false,
  type: "public",
  groupName: null
}];

type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';
type SearchType = 'name' | 'id';

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventIdQuery, setEventIdQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('name');

  // Filter events based on the active filter and search query
  const filteredEvents = MOCK_EVENTS.filter(event => {
    // Filter by event type
    if (activeFilter === 'public' && event.type !== 'public' || 
        activeFilter === 'private' && event.type !== 'private' || 
        activeFilter === 'group' && event.type !== 'group' || 
        activeFilter === 'confirmed' && !event.confirmed || 
        activeFilter === 'missed' && event.confirmed !== false) {
      return false;
    }

    // Filter by search query (name or content)
    if (searchType === 'name' && searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(query);
      const matchesLocation = event.location.toLowerCase().includes(query);
      const matchesGroup = event.groupName?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesLocation && !matchesGroup) {
        return false;
      }
    }

    // Filter by event ID
    if (searchType === 'id' && eventIdQuery) {
      return event.id.toLowerCase().includes(eventIdQuery.toLowerCase());
    }

    // Filter by location
    if (locationQuery && !event.location.toLowerCase().includes(locationQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleSearchChange = (query: string) => {
    if (searchType === 'name') {
      setSearchQuery(query);
      setEventIdQuery('');
    } else {
      setEventIdQuery(query);
      setSearchQuery('');
    }
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
        {/* Search type selector */}
        <Tabs defaultValue="name" className="w-full mb-4" onValueChange={(value) => setSearchType(value as SearchType)}>
          <TabsList className="w-full">
            <TabsTrigger value="name" className="flex-1">Buscar por Nome</TabsTrigger>
            <TabsTrigger value="id" className="flex-1">Buscar por ID</TabsTrigger>
          </TabsList>

          <TabsContent value="name" className="mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Buscar eventos por nome..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </TabsContent>

          <TabsContent value="id" className="mt-2">
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Digite o ID do evento..."
                value={eventIdQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </TabsContent>
        </Tabs>

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
        {locationQuery && <div className="bg-muted/30 p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <MapPin size={18} className="text-primary mr-2" />
              <span>Eventos em: <strong>{locationQuery}</strong></span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocationQuery("")}>
              Limpar
            </Button>
          </div>}
        
        {/* Events grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
                <EventCard 
                  id={event.id} 
                  title={event.title} 
                  date={event.date} 
                  location={event.location} 
                  imageUrl={event.imageUrl} 
                  attendees={event.attendees} 
                  confirmed={event.confirmed} 
                  type={event.type as "public" | "private" | "group"} 
                  groupName={event.groupName} 
                  size="large" 
                />
                <div className="mt-1 text-xs flex justify-between text-muted-foreground">
                  <span>ID: {event.id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || eventIdQuery || locationQuery ? "Não encontramos eventos com esses filtros." : "Não há eventos disponíveis no momento."}
            </p>
            <Button className="bg-cta-gradient hover:opacity-90" onClick={() => navigate('/criar')}>
              Criar um evento
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EventsPage;
