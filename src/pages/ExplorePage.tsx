
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, CalendarIcon, Filter } from "lucide-react";
import MainLayout from "../components/MainLayout";
import EventCard from "../components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock events para demonstração
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Festival de Música ao Vivo",
    date: "Próximo sábado, 19:00",
    location: "Parque Villa-Lobos",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 120,
    type: "public",
  },
  {
    id: "2",
    title: "Feira Gastronômica",
    date: "Domingo, 11:00",
    location: "Praça Charles Miller",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 75,
    type: "public",
  },
  {
    id: "3",
    title: "Corrida Beneficente",
    date: "Próximo sábado, 8:00",
    location: "Parque Ibirapuera",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 200,
    type: "public",
  },
  {
    id: "4",
    title: "Exposição de Arte",
    date: "Todos os dias, 9:00 - 18:00",
    location: "MASP",
    imageUrl: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 45,
    type: "public",
  },
  {
    id: "5",
    title: "Workshop de Fotografia",
    date: "Sexta-feira, 14:00",
    location: "Centro Cultural São Paulo",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1164&q=80",
    attendees: 30,
    type: "public",
  }
];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSearchByLocation, setIsSearchByLocation] = useState(false);
  
  const filteredEvents = MOCK_EVENTS.filter(event => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return event.title.toLowerCase().includes(query) || 
           event.location.toLowerCase().includes(query);
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
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
                <EventCard 
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  imageUrl={event.imageUrl}
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
              {searchQuery ? 
                "Não encontramos eventos com esses termos de busca." : 
                "Não há eventos públicos disponíveis no momento."}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExplorePage;
