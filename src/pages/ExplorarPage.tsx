
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Tag, X } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import EventCard from '../components/EventCard';
import EventIdSearch from '../components/EventIdSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Mock data - would come from API in real app
const MOCK_EVENTS = [
  {
    id: "abc123",
    title: "Festival de Música",
    date: "Próx. Sábado, 16:00",
    location: "Parque Ibirapuera",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 50,
    confirmed: true,
    type: "public" as const,
    groupName: null
  },
  {
    id: "def456",
    title: "Exposição de Arte",
    date: "Próx. Sábado, 10:00",
    location: "MASP",
    imageUrl: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 30,
    confirmed: false,
    type: "public" as const,
    groupName: null
  },
  {
    id: "ghi789",
    title: "Show de Stand-up",
    date: "Sexta-feira, 21:00",
    location: "Comedy Club",
    imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    attendees: 80,
    confirmed: true,
    type: "public" as const,
    groupName: null
  },
  {
    id: "jkl012",
    title: "Food Truck Festival",
    date: "Domingo, 12:00",
    location: "Memorial da América Latina",
    imageUrl: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    attendees: 120,
    confirmed: false,
    type: "public" as const,
    groupName: null
  },
  {
    id: "mno345",
    title: "Feira de Vinil",
    date: "Sábado, 10:00",
    location: "Centro Cultural",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca91d0e92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 45,
    confirmed: true,
    type: "public" as const,
    groupName: null
  }
];

type FilterType = 'all' | 'nearby' | 'popular' | 'today' | 'weekend' | 'upcoming';

const ExplorarPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterEvents(query, activeFilter);
  };
  
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    filterEvents(searchQuery, filter);
  };
  
  const filterEvents = (query: string, filter: FilterType) => {
    let filteredEvents = [...MOCK_EVENTS];
    
    // Aplicar filtro de busca
    if (query) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase()) ||
        event.id.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Aplicar filtro de categoria
    if (filter !== 'all') {
      // Lógica de filtro por categoria (simulada)
      if (filter === 'nearby') {
        filteredEvents = filteredEvents.filter(() => Math.random() > 0.3);
      } else if (filter === 'popular') {
        filteredEvents = filteredEvents.filter(event => event.attendees > 50);
      } else if (filter === 'today') {
        filteredEvents = filteredEvents.filter(event => event.date.includes('Hoje'));
      } else if (filter === 'weekend') {
        filteredEvents = filteredEvents.filter(event => 
          event.date.includes('Sábado') || event.date.includes('Domingo')
        );
      } else if (filter === 'upcoming') {
        filteredEvents = filteredEvents.filter(event => event.date.includes('Próx'));
      }
    }
    
    setEvents(filteredEvents);
  };
  
  const handleEventIdSearch = (eventId: string) => {
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    
    if (event) {
      navigate(`/evento/${eventId}`);
    } else {
      toast({
        title: "Evento não encontrado",
        description: `Não foi possível encontrar um evento com o ID: ${eventId}`,
        variant: "destructive"
      });
    }
  };
  
  const applyFilters = () => {
    setFiltersApplied(true);
    setFilterSheetOpen(false);
    
    toast({
      title: "Filtros aplicados",
      description: "Os resultados foram atualizados conforme seus filtros."
    });
  };
  
  const clearFilters = () => {
    setFiltersApplied(false);
    setEvents(MOCK_EVENTS);
    setFilterSheetOpen(false);
    
    toast({
      description: "Todos os filtros foram limpos."
    });
  };

  return (
    <MainLayout 
      title="Explorar" 
      showSearch 
      onSearch={handleSearchChange}
    >
      <div className="p-4">
        <div className="mb-6 space-y-4">
          <h1 className="text-2xl font-bold dark:text-[#EDEDED]">Explorar Eventos</h1>

          {/* Search by Event ID */}
          <EventIdSearch 
            onSearch={handleEventIdSearch}
            className="mb-2"
          />
          
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" className="flex-1 max-w-full">
              <TabsList className="flex w-full overflow-x-auto scrollbar-none justify-start p-1 h-auto bg-transparent space-x-1">
                <TabsTrigger 
                  value="all" 
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${
                    activeFilter === 'all' 
                      ? 'bg-[#FF8A1E] text-white hover:bg-[#FF7A00]' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleFilterChange('all')}
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger 
                  value="nearby" 
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${
                    activeFilter === 'nearby' 
                      ? 'bg-[#FF8A1E] text-white hover:bg-[#FF7A00]' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleFilterChange('nearby')}
                >
                  Próximos de mim
                </TabsTrigger>
                <TabsTrigger 
                  value="popular" 
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${
                    activeFilter === 'popular' 
                      ? 'bg-[#FF8A1E] text-white hover:bg-[#FF7A00]' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleFilterChange('popular')}
                >
                  Popular
                </TabsTrigger>
                <TabsTrigger 
                  value="today" 
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${
                    activeFilter === 'today' 
                      ? 'bg-[#FF8A1E] text-white hover:bg-[#FF7A00]' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleFilterChange('today')}
                >
                  Hoje
                </TabsTrigger>
                <TabsTrigger 
                  value="weekend" 
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${
                    activeFilter === 'weekend' 
                      ? 'bg-[#FF8A1E] text-white hover:bg-[#FF7A00]' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleFilterChange('weekend')}
                >
                  Fim de semana
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant={filtersApplied ? "default" : "outline"} 
                  size="sm"
                  className={filtersApplied ? "bg-[#FF8A1E] hover:bg-[#FF7A00] text-white" : ""}
                >
                  <Filter size={16} className="mr-1" />
                  Filtrar
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90%] max-w-md dark:bg-card dark:border-[#2C2C2C]">
                <SheetHeader>
                  <SheetTitle className="dark:text-[#EDEDED]">Filtros</SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3 dark:text-[#EDEDED]">Tipo de evento</h3>
                    <RadioGroup defaultValue="all">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="dark:text-[#EDEDED]">Todos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="dark:text-[#EDEDED]">Públicos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="group" id="group" />
                        <Label htmlFor="group" className="dark:text-[#EDEDED]">De grupos</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3 dark:text-[#EDEDED]">Data</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="today" />
                        <Label htmlFor="today" className="dark:text-[#EDEDED]">Hoje</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="tomorrow" />
                        <Label htmlFor="tomorrow" className="dark:text-[#EDEDED]">Amanhã</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="weekend" />
                        <Label htmlFor="weekend" className="dark:text-[#EDEDED]">Este fim de semana</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="week" />
                        <Label htmlFor="week" className="dark:text-[#EDEDED]">Esta semana</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3 dark:text-[#EDEDED]">Distância máxima</h3>
                    <div className="px-2">
                      <Slider defaultValue={[10]} max={50} step={1} className="mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground dark:text-[#B3B3B3]">
                        <span>5km</span>
                        <span>25km</span>
                        <span>50km</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3 dark:text-[#EDEDED]">Opções</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="free" className="dark:text-[#EDEDED]">Apenas eventos gratuitos</Label>
                        <Switch id="free" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="accessible" className="dark:text-[#EDEDED]">Acessível para PCD</Label>
                        <Switch id="accessible" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pets" className="dark:text-[#EDEDED]">Pet friendly</Label>
                        <Switch id="pets" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <SheetFooter className="flex-col sm:space-x-0 sm:space-y-2">
                  <Button 
                    className="w-full bg-[#FF8A1E] hover:bg-[#FF7A00]"
                    onClick={applyFilters}
                  >
                    Aplicar filtros
                  </Button>
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Limpar filtros
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center">
            {searchQuery && (
              <div className="flex items-center bg-muted/30 dark:bg-[#262626]/50 px-3 py-1 rounded-lg text-sm mr-2">
                <span className="mr-1">"{searchQuery}"</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-5 h-5 p-0" 
                  onClick={() => handleSearchChange("")}
                >
                  <X size={12} />
                </Button>
              </div>
            )}
            
            {activeFilter !== 'all' && (
              <div className="flex items-center bg-muted/30 dark:bg-[#262626]/50 px-3 py-1 rounded-lg text-sm">
                <span className="mr-1 capitalize">
                  {activeFilter === 'nearby' ? 'Próximos de mim' :
                   activeFilter === 'popular' ? 'Popular' :
                   activeFilter === 'today' ? 'Hoje' :
                   activeFilter === 'weekend' ? 'Fim de semana' : 
                   activeFilter}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-5 h-5 p-0" 
                  onClick={() => handleFilterChange("all")}
                >
                  <X size={12} />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Events Results */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
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
                  type={event.type}
                  groupName={event.groupName}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 dark:bg-[#262626]/50 rounded-xl">
            <Search className="mx-auto h-12 w-12 text-muted-foreground dark:text-[#B3B3B3] mb-2" />
            <h3 className="text-lg font-medium mb-1 dark:text-[#EDEDED]">Nenhum evento encontrado</h3>
            <p className="text-sm text-muted-foreground dark:text-[#B3B3B3] mb-4">
              {searchQuery 
                ? `Não encontramos resultados para "${searchQuery}"`
                : "Tente ajustar seus filtros ou buscar por outro termo"
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
                setEvents(MOCK_EVENTS);
              }}
            >
              Limpar busca e filtros
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExplorarPage;
