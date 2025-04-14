
import { Button } from "@/components/ui/button";

type FilterType = 'all' | 'public' | 'private' | 'group' | 'confirmed' | 'missed';

interface EventTypeFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const EventTypeFilters = ({ activeFilter, onFilterChange }: EventTypeFiltersProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
      <Button 
        variant={activeFilter === 'all' ? 'default' : 'outline'} 
        size="sm" 
        className={`rounded-full whitespace-nowrap ${activeFilter !== 'all' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
        onClick={() => onFilterChange('all')}
      >
        Todos
      </Button>
      <Button 
        variant={activeFilter === 'public' ? 'default' : 'outline'} 
        size="sm" 
        className={`rounded-full whitespace-nowrap ${activeFilter !== 'public' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
        onClick={() => onFilterChange('public')}
      >
        Eventos Públicos
      </Button>
      <Button 
        variant={activeFilter === 'private' ? 'default' : 'outline'} 
        size="sm" 
        className={`rounded-full whitespace-nowrap ${activeFilter !== 'private' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
        onClick={() => onFilterChange('private')}
      >
        Eventos Privados
      </Button>
      <Button 
        variant={activeFilter === 'group' ? 'default' : 'outline'} 
        size="sm" 
        className={`rounded-full whitespace-nowrap ${activeFilter !== 'group' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
        onClick={() => onFilterChange('group')}
      >
        Grupos
      </Button>
      <Button 
        variant={activeFilter === 'confirmed' ? 'default' : 'outline'} 
        size="sm" 
        className={`rounded-full whitespace-nowrap ${activeFilter !== 'confirmed' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
        onClick={() => onFilterChange('confirmed')}
      >
        Confirmados
      </Button>
      <Button 
        variant={activeFilter === 'missed' ? 'default' : 'outline'} 
        size="sm" 
        className={`rounded-full whitespace-nowrap ${activeFilter !== 'missed' ? 'dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]' : 'dark:bg-primary dark:text-white dark:hover:bg-accent'}`} 
        onClick={() => onFilterChange('missed')}
      >
        Furei
      </Button>
    </div>
  );
};

export default EventTypeFilters;
