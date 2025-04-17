
import { Calendar, MapPin, Users } from "lucide-react";
import EventTag from "./EventTag";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";
import { memo } from "react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
  confirmed?: boolean;
  type?: "public" | "private" | "group";
  groupName?: string | null;
  size?: "default" | "large";
}

// Use memo to prevent unnecessary re-renders
const EventCard = memo(({
  id,
  title,
  date,
  location,
  imageUrl,
  attendees,
  confirmed,
  type = "public",
  groupName = null,
  size = "default",
}: EventCardProps) => {
  // Define background color based on event type
  const getCardBorder = () => {
    switch (type) {
      case "public":
        return "border-l-4 border-l-green-500";
      case "private":
        return "border-l-4 border-l-blue-500";
      case "group":
        return "border-l-4 border-l-amber-500";
      default:
        return "";
    }
  };

  // Determine if the card should be larger
  const isLarge = size === "large";
  
  // Use data attributes for selective rendering and better performance
  return (
    <Link 
      to={`/evento/${id}`} 
      className={`event-card animate-fade-in ${getCardBorder()} block hover:shadow-md transition-shadow duration-200`}
      data-event-id={id}
      data-event-type={type}
    >
      <div className={`relative ${isLarge ? 'h-60' : 'h-40'}`}>
        <LazyImage
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          aspectRatio={isLarge ? "16/9" : "4/3"}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {type && (
            <EventTag 
              type={type} 
              label={type === "public" ? "Público" : type === "private" ? "Privado" : "Grupo"} 
            />
          )}
          {groupName && (
            <EventTag type="group" label={groupName} />
          )}
        </div>
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
      <div className={`p-4 ${isLarge ? 'space-y-3' : ''}`}>
        <h3 className={`font-bold ${isLarge ? 'text-xl' : 'text-lg'} line-clamp-1`}>{title}</h3>
        <div className={`${isLarge ? 'mt-3' : 'mt-2'} space-y-2`}>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={isLarge ? 16 : 14} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={isLarge ? 16 : 14} className="mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users size={isLarge ? 16 : 14} className="mr-1" />
            <span>{attendees} confirmados</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;
