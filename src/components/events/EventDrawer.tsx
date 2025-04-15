
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

interface EventDrawerProps {
  locationQuery: string;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearLocation: () => void;
  children: React.ReactNode;
}

const EventDrawer = ({
  locationQuery,
  onLocationChange,
  onClearLocation,
  children,
}: EventDrawerProps) => {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Filtrar por localização</DrawerTitle>
      </DrawerHeader>
      <div className="p-4">
        <div className="relative mb-4">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Digite uma localização..." 
            value={locationQuery} 
            onChange={onLocationChange} 
            className="pl-10" 
          />
        </div>
        <h3 className="font-medium mb-2">Explorar por localização</h3>
        <div className="space-y-2">
          {children}
        </div>
      </div>
      <DrawerFooter>
        <Button onClick={onClearLocation} variant="outline">Limpar filtros</Button>
        <DrawerClose asChild>
          <Button>Aplicar</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
};

export default EventDrawer;
