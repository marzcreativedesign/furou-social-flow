
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, CalendarDays, Settings, Bell, X, Check } from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import MainLayout from "../components/MainLayout";
import EventCard from "../components/EventCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CostCalculator from "@/components/CostCalculator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock events
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Happy Hour no Bar do Zé",
    date: "Hoje, 19:00",
    location: "Bar do Zé",
    imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 8,
    confirmed: true,
    type: "public",
    groupName: null
  },
  {
    id: "2",
    title: "Aniversário da Marina",
    date: "Amanhã, 20:00",
    location: "Alameda Santos, 1000",
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 15,
    confirmed: false,
    type: "private",
    groupName: null
  },
  {
    id: "3",
    title: "Churrasco de Domingo",
    date: "Domingo, 12:00",
    location: "Av. Paulista, 1000",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 12,
    confirmed: true,
    type: "group",
    groupName: "Amigos da Faculdade"
  },
];

const PENDING_ACTIONS = [
  {
    id: "1",
    title: "Confirmação de presença",
    eventName: "Happy Hour no Bar do Zé",
    date: "Hoje, 19:00",
    imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    type: "confirmation"
  },
  {
    id: "2",
    title: "Convite para grupo",
    eventName: "Amigos do Colégio",
    date: "Novo grupo",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80",
    type: "group_invite"
  },
];

const UPCOMING_EVENTS = [
  {
    id: "4",
    title: "Festival de Música",
    date: "Próx. Sábado, 16:00",
    location: "Parque Ibirapuera",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 50,
    confirmed: true,
    type: "public",
    groupName: null
  },
  {
    id: "5",
    title: "Exposição de Arte",
    date: "Próx. Sábado, 10:00",
    location: "MASP",
    imageUrl: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 30,
    confirmed: false,
    type: "public",
    groupName: null
  }
];

type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [pendingActions, setPendingActions] = useState(PENDING_ACTIONS);
  const userName = "Carlos"; // This would come from user authentication
  
  const filteredEvents = MOCK_EVENTS.filter(event => {
    // Filter by event type
    if (
      activeFilter === 'public' && event.type !== 'public' ||
      activeFilter === 'private' && event.type !== 'private' ||
      activeFilter === 'group' && event.type !== 'group' ||
      activeFilter === 'confirmed' && !event.confirmed ||
      activeFilter === 'missed' && event.confirmed !== false
    ) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        event.location.toLowerCase().includes(query) ||
        (event.groupName && event.groupName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAcceptAction = (id: string) => {
    setPendingActions(prevActions => prevActions.filter(action => action.id !== id));
  };
  
  const handleRejectAction = (id: string) => {
    setPendingActions(prevActions => prevActions.filter(action => action.id !== id));
  };
  
  return (
    <MainLayout
      title="Furou?!"
      showSearch
      onSearch={handleSearchChange}
      showDock
      rightContent={
        <>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <CalendarDays size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <h2 className="text-xl font-bold mb-4">Calculadora de Rateio</h2>
              <p className="text-muted-foreground mb-4">
                Divida facilmente o valor de um evento entre os participantes
              </p>
              <CostCalculator isDrawer />
              
              <Button 
                className="w-full mt-4"
                onClick={() => navigate("/calculadora")}
              >
                Abrir calculadora completa
              </Button>
            </SheetContent>
          </Sheet>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/criar")}
          >
            <Plus size={20} />
          </Button>
        </>
      }
    >
      <div className="p-4">
        {/* Welcome message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-3">Olá, {userName} 👋</h1>
          
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="w-full px-10 py-3 rounded-xl border border-input bg-background hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Pending Actions Section */}
        {pendingActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Ações Pendentes</h2>
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="bg-accent/10 p-4 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={action.imageUrl} alt={action.eventName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.eventName}</p>
                      <span className="text-xs text-muted-foreground">{action.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full w-9 h-9 p-0" 
                      onClick={() => handleRejectAction(action.id)}
                    >
                      <X size={16} />
                    </Button>
                    <Button 
                      size="sm"
                      className="rounded-full w-9 h-9 p-0" 
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

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={activeFilter === 'public' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveFilter('public')}
          >
            Eventos Públicos
          </Button>
          <Button 
            variant={activeFilter === 'private' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveFilter('private')}
          >
            Eventos Privados
          </Button>
          <Button 
            variant={activeFilter === 'group' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveFilter('group')}
          >
            Grupos
          </Button>
          <Button 
            variant={activeFilter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveFilter('confirmed')}
          >
            Confirmados
          </Button>
          <Button 
            variant={activeFilter === 'missed' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveFilter('missed')}
          >
            Furei
          </Button>
        </div>

        {/* Seus Eventos Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Seus Eventos</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/eventos">Ver todos</Link>
            </Button>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/evento/${event.id}`)} 
                  className="cursor-pointer"
                >
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
                  />
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 bg-muted/20 rounded-xl">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Nenhum evento encontrado para "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-xl">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">Nenhum evento</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Você não tem eventos ativos no momento
              </p>
              <Button onClick={() => navigate("/criar")}>Criar Evento</Button>
            </div>
          )}
        </div>

        {/* Eventos Proximamente Section */}
        {!searchQuery && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Eventos Públicos</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/eventos?filter=public">Ver todos</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {UPCOMING_EVENTS.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/evento/${event.id}`)}
                  className="cursor-pointer"
                >
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
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
