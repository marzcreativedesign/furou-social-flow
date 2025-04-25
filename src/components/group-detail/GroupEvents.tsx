
import { useNavigate } from "react-router-dom";
import { Plus, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  image_url?: string;
  attendees?: number;
}

interface GroupEventsProps {
  events: Event[];
  isAdmin: boolean;
}

const GroupEvents = ({ events, isAdmin }: GroupEventsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Eventos do Grupo</h2>
        <Button size="sm" onClick={() => navigate('/criar')}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Evento
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length > 0 ? (
          events.map(event => (
            <div 
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-border dark:border-gray-700 cursor-pointer"
              onClick={() => navigate(`/evento/${event.id}`)}
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={event.image_url || 'https://images.unsplash.com/photo-1506157786151-b8491531f063'} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {event.attendees || 0} confirmados
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Map className="h-3 w-3 mr-1" />
                  {event.location || 'Local não definido'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-10 text-center">
            <p className="text-muted-foreground mb-4">Este grupo ainda não possui eventos.</p>
            {isAdmin && (
              <Button onClick={() => navigate('/criar')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro evento
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupEvents;
