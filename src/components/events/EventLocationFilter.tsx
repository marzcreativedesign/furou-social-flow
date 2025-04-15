
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import EventDrawer from "./EventDrawer";

interface EventLocationFilterProps {
  locationQuery: string;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLocationQuery: (query: string) => void;
}

const EventLocationFilter = ({
  locationQuery,
  onLocationChange,
  setLocationQuery,
}: EventLocationFilterProps) => {
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre"];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Filter size={20} />
        </Button>
      </DrawerTrigger>
      <EventDrawer
        locationQuery={locationQuery}
        onLocationChange={onLocationChange}
        onClearLocation={() => setLocationQuery("")}
      >
        {cities.map((city) => (
          <Button
            key={city}
            variant="outline"
            className="w-full justify-start"
            onClick={() => setLocationQuery(city)}
          >
            <Filter size={16} className="mr-2" />
            {city}
          </Button>
        ))}
      </EventDrawer>
    </Drawer>
  );
};

export default EventLocationFilter;
