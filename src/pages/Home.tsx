
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import EventsList from '@/components/home/EventsList';
import { useHomeData } from '@/hooks/home/useHomeData';
import EventTypeFilters from '@/components/home/EventTypeFilters';
import { FilterType } from '@/hooks/home/types';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { 
    loading, 
    filteredEvents, 
    publicEvents,
  } = useHomeData(searchQuery, activeFilter);

  return (
    <MainLayout 
      title="Home" 
      showSearch 
      onSearch={setSearchQuery}
    >
      <div className="px-4 py-4">
        <EventTypeFilters
          activeFilter={activeFilter}
          onFilterChange={(filter) => setActiveFilter(filter)}
        />
        
        <EventsList 
          title="Seus Eventos" 
          events={filteredEvents}
          loading={loading}
          showViewAll
          viewAllLink="/eventos"
        />

        <EventsList 
          title="Eventos Públicos" 
          events={publicEvents}
          loading={loading}
          showViewAll
          viewAllLink="/eventos"
        />
      </div>
    </MainLayout>
  );
};

export default Home;
