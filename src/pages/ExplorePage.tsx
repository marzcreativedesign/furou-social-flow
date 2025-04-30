
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import ExploreSearchBar from '@/components/explore/ExploreSearchBar';
import ExploreTabs from '@/components/explore/ExploreTabs';
import ExploreFilters from '@/components/explore/ExploreFilters';
import GroupsComingSoon from '@/components/explore/GroupsComingSoon';
import ExploreHeader from '@/components/explore/ExploreHeader';
import { useExploreEvents } from '@/hooks/useExploreEvents';
import EventsGrid from '@/components/events/EventsGrid';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");

  const {
    events,
    loading,
    currentPage,
    totalPages,
    searchQuery,
    handleSearch,
    handlePageChange
  } = useExploreEvents();

  return (
    <MainLayout title="Explorar" showDock>
      <div className="p-4">
        <ExploreHeader title="Descubra novos eventos" />
        
        <ExploreSearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />
        
        <ExploreTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {activeTab === "events" ? (
          <>
            <ExploreFilters />
            
            <EventsGrid
              events={events}
              loading={loading}
              searchQuery={searchQuery}
              locationQuery=""
              pagination={{
                currentPage: currentPage,
                totalPages: totalPages,
                onPageChange: handlePageChange
              }}
            />
          </>
        ) : (
          <GroupsComingSoon />
        )}
      </div>
    </MainLayout>
  );
};

export default ExplorePage;
