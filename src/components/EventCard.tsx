
import { Calendar, MapPin, Users } from "lucide-react";
import EventTag from "./EventTag";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import { memo } from "react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
  confirmed?: boolean;
  type?: "public" | "private";
  size?: "default" | "large";
}

const EventCard = memo(({
  id,
  title,
  date,
  location,
  imageUrl,
  attendees,
  confirmed,
  type = "public",
  size = "default",
}: EventCardProps) => {
  const isPastEvent = new Date(date) < new Date();

  const getCardBorder = () => {
    if (isPastEvent) return "border-l-4 border-l-gray-500";
    
    switch (type) {
      case "public":
        return "border-l-4 border-l-green-500";
      case "private":
        return "border-l-4 border-l-blue-500";
      default:
        return "";
    }
  };

  const isLarge = size === "large";
  const fallbackImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3";

  return (
    <Link to={`/evento/${id}`} className={`event-card animate-fade-in ${getCardBorder()} block hover:shadow-md transition-shadow duration-200 bg-card`}>
      <div className={`relative ${isLarge ? 'h-60' : 'h-40'}`}>
        <OptimizedImage 
          src={imageUrl || fallbackImage}
          alt={title}
          className={`w-full h-full object-cover ${isPastEvent ? 'grayscale' : ''}`}
          aspectRatio={isLarge ? "16/9" : "4/3"}
          lazyLoad={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {type && !isPastEvent && (
            <EventTag 
              type={type} 
              label={type === "public" ? "Público" : "Privado"} 
            />
          )}
          {isPastEvent && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-800/80 text-gray-200 border border-gray-700">
              Encerrado
            </span>
          )}
        </div>
        {!isPastEvent && confirmed !== undefined && (
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
        
        <div className={`absolute bottom-0 left-0 right-0 p-4 text-white`}>
          <h3 className={`font-bold ${isLarge ? 'text-xl' : 'text-lg'} line-clamp-2 text-shadow-sm`}>{title}</h3>
          <div className={`mt-1 space-y-1`}>
            <div className="flex items-center text-sm text-white/90">
              <Calendar size={isLarge ? 16 : 14} className="mr-1" />
              <span className="line-clamp-1">{date}</span>
            </div>
            <div className="flex items-center text-sm text-white/90">
              <MapPin size={isLarge ? 16 : 14} className="mr-1" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center text-sm text-white/90">
              <Users size={isLarge ? 16 : 14} className="mr-1" />
              <span>{attendees} confirmados</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
