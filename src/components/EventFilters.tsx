
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, MapPin } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventFiltersProps = {
  onFilterChange: (filters: EventFilters) => void;
};

export type EventFilters = {
  type: 'all' | 'public' | 'private' | 'invited' | 'confirmed';
  date: 'all' | 'today' | 'weekend' | 'week' | 'month';
};

const EventFilters = ({ onFilterChange }: EventFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<EventFilters>({
    type: 'all',
    date: 'all',
  });
  
  const handleTypeChange = (value: string) => {
    const newFilters = {
      ...activeFilters,
      type: value as EventFilters['type'],
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleDateChange = (value: string) => {
    const newFilters = {
      ...activeFilters,
      date: value as EventFilters['date'],
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Tipo de evento</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button 
            variant={activeFilters.type === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('all')}
          >
            Todos
          </Button>
          <Button 
            variant={activeFilters.type === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('public')}
          >
            Públicos
          </Button>
          <Button 
            variant={activeFilters.type === 'invited' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('invited')}
          >
            Convidado
          </Button>
          <Button 
            variant={activeFilters.type === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange('confirmed')}
          >
            Confirmados
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Data</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button 
            variant={activeFilters.date === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDateChange('all')}
          >
            Todos
          </Button>
          <Button 
            variant={activeFilters.date === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDateChange('today')}
          >
            Hoje
          </Button>
          <Button 
            variant={activeFilters.date === 'weekend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDateChange('weekend')}
          >
            Este fim de semana
          </Button>
          <Button 
            variant={activeFilters.date === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDateChange('week')}
          >
            Esta semana
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
