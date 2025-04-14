
import { CalendarDays, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
}

interface UserEventsProps {
  events: Event[];
}

const UserEvents = ({ events }: UserEventsProps) => {
  const navigate = useNavigate();

  if (events.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 dark:bg-[#262626]/50 rounded-xl">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground dark:text-[#B3B3B3] mb-2" />
        <h3 className="text-lg font-medium mb-1 dark:text-[#EDEDED]">Sem histórico de eventos</h3>
        <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
          Este usuário ainda não participou de nenhum evento
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {events.map(event => (
        <Card 
          key={event.id} 
          className="overflow-hidden cursor-pointer dark:bg-card dark:border-[#2C2C2C] dark:hover:bg-[#262626]"
          onClick={() => navigate(`/evento/${event.id}`)}
        >
          <div className="flex h-24">
            <div 
              className="w-24 h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${event.imageUrl})` }}
            ></div>
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <h4 className="font-medium line-clamp-2 dark:text-[#EDEDED]">{event.title}</h4>
                <p className="text-xs text-muted-foreground dark:text-[#B3B3B3]">{event.date}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs flex items-center text-muted-foreground dark:text-[#B3B3B3]">
                  <Users size={12} className="mr-1" />
                  <span>{event.attendees} confirmados</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserEvents;
