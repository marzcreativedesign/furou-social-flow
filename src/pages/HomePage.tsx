
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import EventCard from "../components/EventCard";

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Happy Hour no Bar do Zé",
    date: "Hoje, 19:00",
    location: "Rua Augusta, 1492",
    imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 8,
  },
  {
    id: "2",
    title: "Aniversário da Marina",
    date: "Amanhã, 20:00",
    location: "Alameda Santos, 1000",
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 15,
  },
  {
    id: "3",
    title: "Churrasco de Domingo",
    date: "Domingo, 12:00",
    location: "Av. Paulista, 1000",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 12,
  },
  {
    id: "4",
    title: "Festival de Música",
    date: "Próximo Sábado, 16:00",
    location: "Parque Ibirapuera",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 50,
  },
];

const MOCK_NEARBY_EVENTS = [
  {
    id: "5",
    title: "Exposição de Arte",
    date: "Este final de semana",
    location: "MASP",
    imageUrl: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 30,
  },
  {
    id: "6",
    title: "Aula de Yoga no Parque",
    date: "Sábado, 9:00",
    location: "Parque Villa-Lobos",
    imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 15,
  },
];

const HomePage = () => {
  const [location, setLocation] = useState("São Paulo, SP");
  
  return (
    <div className="pb-20">
      <Header showSearch />
      
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center text-sm mb-6">
          <MapPin size={16} className="text-primary mr-1" />
          <span>{location}</span>
        </div>
        
        <div className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="w-full input-primary pl-10"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
        
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Seus eventos</h2>
            <Link to="/eventos" className="text-sm font-medium text-primary">
              Ver todos
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MOCK_EVENTS.slice(0, 2).map((event) => (
              <Link to={`/evento/${event.id}`} key={event.id}>
                <EventCard {...event} />
              </Link>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Eventos próximos</h2>
            <Link to="/eventos/proximos" className="text-sm font-medium text-primary">
              Ver todos
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MOCK_NEARBY_EVENTS.map((event) => (
              <Link to={`/evento/${event.id}`} key={event.id}>
                <EventCard {...event} />
              </Link>
            ))}
          </div>
        </section>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default HomePage;
