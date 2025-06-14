import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import EventsList from '@/components/home/EventsList';
import EventTypeFilters from '@/components/home/EventTypeFilters';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Just a placeholder, since old hooks were deleted
  // The real HomePage is in HomePage.tsx
  return (
    <MainLayout 
      title="Home" 
      showSearch 
      onSearch={setSearchQuery}
    >
      <div className="px-4 py-4">
        <EventTypeFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <EventsList 
          title="Eventos"
          events={[]} // Substitua pelo hook correto/real
          loading={false}
        />
      </div>
    </MainLayout>
  );
};

export default Home;
