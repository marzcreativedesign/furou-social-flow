
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export interface ExploreFiltersProps {
  location?: string | null;
  date?: Date | null;
  onLocationChange?: (location: string | null) => void;
  onDateChange?: (date: Date | null) => void;
}

const ExploreFilters = ({ location, date, onLocationChange, onDateChange }: ExploreFiltersProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium">Eventos Públicos</h2>
      <Button variant="outline" size="sm">
        <Filter size={16} className="mr-1" />
        Filtrar
      </Button>
    </div>
  );
};

export default ExploreFilters;
