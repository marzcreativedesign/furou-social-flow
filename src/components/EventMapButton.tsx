
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EventMapButtonProps {
  address: string;
  location: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
}

const EventMapButton = ({ 
  address, 
  location, 
  variant = "outline",
  size = "sm" 
}: EventMapButtonProps) => {
  const { toast } = useToast();
  
  const handleOpenMap = () => {
    const formattedAddress = encodeURIComponent(`${location}, ${address}`);
    
    // Detectar o dispositivo e abrir o app apropriado
    try {
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        // iOS - tenta abrir no Apple Maps
        window.open(`maps://maps.apple.com/?q=${formattedAddress}`);
      } else {
        // Android ou outros - tenta abrir no Google Maps
        window.open(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`);
      }
      
      toast({
        title: "Abrindo mapa",
        description: "Redirecionando para o aplicativo de mapas"
      });
    } catch (error) {
      console.error("Erro ao abrir o mapa:", error);
      
      // Fallback para Google Maps no navegador
      window.open(`https://www.google.com/maps/search/?api=1&query=${formattedAddress}`, "_blank");
      
      toast({
        title: "Abrindo Google Maps",
        description: "Redirecionando para o Google Maps no navegador"
      });
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className="flex items-center justify-center gap-1" 
      onClick={handleOpenMap}
    >
      <MapPin size={16} />
      Ver no mapa
    </Button>
  );
};

export default EventMapButton;
