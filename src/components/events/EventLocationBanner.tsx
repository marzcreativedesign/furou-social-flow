
import { MapPin } from "lucide-react";

interface EventLocationBannerProps {
  locationQuery: string;
  onClearLocation: () => void;
}

const EventLocationBanner = ({ locationQuery, onClearLocation }: EventLocationBannerProps) => {
  if (!locationQuery) return null;
  
  return (
    <div className="bg-muted/30 p-3 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <MapPin size={18} className="text-primary mr-2" />
        <span>Eventos em: <strong>{locationQuery}</strong></span>
      </div>
      <button
        className="text-sm text-muted-foreground hover:text-foreground"
        onClick={onClearLocation}
      >
        Limpar
      </button>
    </div>
  );
};

export default EventLocationBanner;
