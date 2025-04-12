
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
  type: 'all' | 'public' | 'private' | 'invited' | 'confirmed' | 'missed' | 'group';
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
        <div className="flex flex-wrap gap-2 pb-2">
          <Button 
            variant={activeFilters.type === 'all' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTypeChange('all')}
          >
            Todos
          </Button>
          <Button 
            variant={activeFilters.type === 'public' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTypeChange('public')}
          >
            Públicos
          </Button>
          <Button 
            variant={activeFilters.type === 'private' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTypeChange('private')}
          >
            Privados
          </Button>
          <Button 
            variant={activeFilters.type === 'group' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTypeChange('group')}
          >
            Grupos
          </Button>
          <Button 
            variant={activeFilters.type === 'invited' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTypeChange('invited')}
          >
            Convidado
          </Button>
          <Button 
            variant={activeFilters.type === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTypeChange('confirmed')}
          >
            Confirmados
          </Button>
          <Button 
            variant={activeFilters.type === 'missed' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleTypeChange('missed')}
          >
            Furei
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Data</h3>
        <div className="flex flex-wrap gap-2 pb-2">
          <Button 
            variant={activeFilters.date === 'all' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleDateChange('all')}
          >
            Todos
          </Button>
          <Button 
            variant={activeFilters.date === 'today' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleDateChange('today')}
          >
            Hoje
          </Button>
          <Button 
            variant={activeFilters.date === 'weekend' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => handleDateChange('weekend')}
          >
            Este fim de semana
          </Button>
          <Button 
            variant={activeFilters.date === 'week' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
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
