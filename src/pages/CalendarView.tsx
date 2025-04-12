
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CircleDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isSameMonth, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EventTag from "../components/EventTag";

// Mock events with dates
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Happy Hour no Bar do Zé",
    date: "2025-04-12T19:00:00",
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
    date: "2025-04-13T20:00:00",
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
    date: "2025-04-14T12:00:00",
    location: "Av. Paulista, 1000",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 12,
    confirmed: true,
    type: "group",
    groupName: "Amigos da Faculdade"
  },
  {
    id: "4",
    title: "Festival de Música",
    date: "2025-04-20T16:00:00",
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
    date: "2025-05-05T10:00:00",
    location: "MASP",
    imageUrl: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 30,
    confirmed: false,
    type: "public",
    groupName: null
  }
];

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'missed' | 'invited'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get all days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get events for selected day
  const selectedDayEvents = selectedDay 
    ? MOCK_EVENTS.filter(event => {
        const isSameDate = isSameDay(parseISO(event.date), selectedDay);
        
        // Apply filters
        if (filter === 'confirmed') return isSameDate && event.confirmed === true;
        if (filter === 'missed') return isSameDate && event.confirmed === false;
        // In a real app, you'd have a proper invited filter
        if (filter === 'invited') return isSameDate;
        
        return isSameDate;
      })
    : [];
    
  // Apply search filter
  const filteredDayEvents = selectedDayEvents.filter(event => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      event.title.toLowerCase().includes(query) || 
      event.location.toLowerCase().includes(query) ||
      (event.groupName && event.groupName.toLowerCase().includes(query))
    );
  });
    
  const hasEventOnDay = (day: Date) => {
    return MOCK_EVENTS.some(event => isSameDay(parseISO(event.date), day));
  };

  const getEventTypeOnDay = (day: Date): "public" | "private" | "group" | "mixed" | null => {
    const eventsOnDay = MOCK_EVENTS.filter(event => isSameDay(parseISO(event.date), day));
    
    if (eventsOnDay.length === 0) return null;
    
    const types = new Set(eventsOnDay.map(event => event.type));
    
    if (types.size > 1) return "mixed";
    return eventsOnDay[0].type as "public" | "private" | "group";
  };
  
  const getDotColorForEventType = (type: "public" | "private" | "group" | "mixed" | null): string => {
    if (!type) return "transparent";
    
    switch (type) {
      case "public": return "bg-green-500";
      case "private": return "bg-blue-500";
      case "group": return "bg-amber-500";
      case "mixed": return "bg-purple-500";
      default: return "bg-gray-400";
    }
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Helper function to get label from event type
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "public": return "Público";
      case "private": return "Privado";
      case "group": return "Grupo";
      default: return "Evento";
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="pb-20">
      <Header title="Agenda" />
      
      <div className="px-4 py-4">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h2 className="text-xl font-bold">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h2>
          
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Calendar Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
            <span>Público</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
            <span>Privado</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-amber-500 mr-1"></span>
            <span>Grupo</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-purple-500 mr-1"></span>
            <span>Diversos</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-700 mr-1"></span>
            <span>Confirmado</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-destructive mr-1"></span>
            <span>Furei</span>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={filter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setFilter('confirmed')}
          >
            Eu Vou
          </Button>
          <Button 
            variant={filter === 'missed' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setFilter('missed')}
          >
            Furei
          </Button>
          <Button 
            variant={filter === 'invited' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setFilter('invited')}
          >
            Convidado
          </Button>
        </div>
        
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div 
              key={day} 
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {days.map((day, i) => {
            const hasEvent = hasEventOnDay(day);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const eventType = getEventTypeOnDay(day);
            const dotColor = getDotColorForEventType(eventType);
            
            return (
              <button
                key={i}
                className={`
                  h-12 rounded-full flex items-center justify-center relative
                  ${isCurrentMonth ? "" : "opacity-30"}
                  ${isSelected ? "bg-primary text-white" : "hover:bg-muted"}
                `}
                onClick={() => setSelectedDay(day)}
              >
                <span className="text-sm">{format(day, "d")}</span>
                {hasEvent && !isSelected && (
                  <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Search bar for events */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar eventos..."
            className="w-full input-primary pl-10 mb-4"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <CalendarIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>
        
        {/* Selected day events */}
        {selectedDay && (
          <div>
            <h3 className="font-bold text-lg mb-4">
              Eventos para {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            
            {filteredDayEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredDayEvents.map(event => (
                  <Card 
                    key={event.id}
                    className="overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/evento/${event.id}`)}
                  >
                    <div className="flex h-24">
                      <div 
                        className="w-24 h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.imageUrl})` }}
                      ></div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-1 mb-1">
                            <EventTag 
                              type={event.type as "public" | "private" | "group"} 
                              label={getEventTypeLabel(event.type)} 
                            />
                            {event.groupName && (
                              <EventTag type="group" label={event.groupName} />
                            )}
                          </div>
                          <h4 className="font-medium line-clamp-2">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">{format(parseISO(event.date), "HH:mm")}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant={event.confirmed ? "default" : "outline"}>
                            {event.confirmed ? "Confirmado" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-muted/20 rounded-xl">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">Nenhum evento</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Nenhum evento encontrado para sua busca." : "Não há eventos agendados para esta data"}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/criar')}
                >
                  Criar Evento
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default CalendarView;
