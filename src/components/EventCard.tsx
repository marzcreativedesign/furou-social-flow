
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
  confirmed?: boolean;
}

const EventCard = ({
  id,
  title,
  date,
  location,
  imageUrl,
  attendees,
  confirmed,
}: EventCardProps) => {
  return (
    <div className="event-card animate-fade-in">
      <div className="relative h-40">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {confirmed !== undefined && (
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
              confirmed
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {confirmed ? "Confirmado" : "Pendente"}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users size={14} className="mr-1" />
            <span>{attendees} confirmados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
