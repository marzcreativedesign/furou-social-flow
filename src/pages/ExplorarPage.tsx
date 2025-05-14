
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useExploreEvents } from '@/hooks/useExploreEvents';
import { useNavigate } from 'react-router-dom';
import ExploreHeader from '@/components/explore/ExploreHeader';
import ExploreSearchBar from '@/components/explore/ExploreSearchBar';
import ExploreTabs from '@/components/explore/ExploreTabs';
import EventsGrid from '@/components/events/EventsGrid';
import ExploreFilters from '@/components/explore/ExploreFilters';

const ExplorarPage = () => {
  const navigate = useNavigate();
  const {
    events,
    loading,
    activeTab,
    currentPage,
    totalPages,
    searchQuery,
    location,
    date,
    handleTabChange,
    handleSearch,
    handleLocationChange,
    handleDateChange,
    handlePageChange,
  } = useExploreEvents();

  return (
    <MainLayout
      title="Explorar"
      showBack
      onBack={() => navigate('/')}
      showSearch={false}
    >
      <div className="px-4 py-4">
        <ExploreHeader />
        <ExploreSearchBar 
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <ExploreTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <ExploreFilters 
          location={location}
          date={date}
          onLocationChange={handleLocationChange}
          onDateChange={handleDateChange}
        />
        <EventsGrid 
          events={events}
          loading={loading}
          searchQuery={searchQuery}
          locationQuery={location || ""}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange
          }}
        />
      </div>
    </MainLayout>
  );
};

export default ExplorarPage;
