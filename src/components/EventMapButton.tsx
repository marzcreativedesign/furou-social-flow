
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventMapButtonProps {
  address: string;
  location: string;
}

const EventMapButton = ({ address, location }: EventMapButtonProps) => {
  const handleOpenMap = () => {
    const formattedAddress = encodeURIComponent(`${location}, ${address}`);
    
    // Tentar detectar o dispositivo e abrir o app apropriado
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      // iOS - tenta abrir no Apple Maps
      window.open(`maps://maps.apple.com/?q=${formattedAddress}`);
    } else {
      // Android ou outros - tenta abrir no Google Maps
      window.open(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="ml-2 flex items-center" 
      onClick={handleOpenMap}
    >
      <MapPin size={16} className="mr-1" />
      Ver no mapa
    </Button>
  );
};

export default EventMapButton;
