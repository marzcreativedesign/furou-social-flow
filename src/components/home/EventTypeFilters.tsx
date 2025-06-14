
import { Button } from "@/components/ui/button";

// The filter types for event listing
export type FilterType = 'all' | 'public' | 'private' | 'confirmed' | 'missed';

interface EventTypeFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const EventTypeFilters = ({ activeFilter, onFilterChange }: EventTypeFiltersProps) => {
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'public', label: 'Públicos' },
    { id: 'private', label: 'Privados' },
    { id: 'confirmed', label: 'Confirmados' },
    { id: 'missed', label: 'Não Fui' }
  ];

  return (
    <div className="flex overflow-x-auto space-x-2 pb-3">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          size="sm"
          className={`flex-shrink-0 ${
            activeFilter === filter.id
              ? ''
              : 'text-muted-foreground'
          }`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default EventTypeFilters;

