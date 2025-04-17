import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '../components/MainLayout';
import EventCard from '../components/EventCard';
import { EventQueriesService } from '@/services/event/queries';
import { useToast } from "@/components/ui/use-toast";
import { Event, EventServiceResponse } from "@/types/event";
import EventsPagination from '@/components/events/EventsPagination';
import ExploreSearchBar from '@/components/explore/ExploreSearchBar';
import ExploreTabs from '@/components/explore/ExploreTabs';
import ExploreFilters from '@/components/explore/ExploreFilters';
import GroupsComingSoon from '@/components/explore/GroupsComingSoon';

interface EventsResponse {
  events: Event[];
  metadata: {
    totalPages: number;
    currentPage: number;
  };
}

const ExplorePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("events");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  
  const { 
    data: eventsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['publicEvents', currentPage, pageSize],
    queryFn: async () => {
      const response = await EventQueriesService.getPublicEvents(currentPage, pageSize) as EventServiceResponse;
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao buscar eventos públicos');
      }
      
      return { 
        events: (response.data || []).map(event => ({
          ...event,
          date: new Date(event.date).toLocaleString('pt-BR', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric'
          }),
          attendees: event.event_participants?.length || 0
        })),
        metadata: {
          totalPages: response.metadata?.totalPages || 1,
          currentPage: response.metadata?.currentPage || 1
        }
      };
    },
    placeholderData: (previousData) => previousData // Use this instead of keepPreviousData
  });
  
  const events = eventsData?.events || [];
  const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };

  const filteredEvents = events.filter(event => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) ||
        (event.profiles && event.profiles.full_name && event.profiles.full_name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleEventClick = (id: string) => navigate(`/evento/${id}`);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout title="Explorar" showDock>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Descubra novos eventos</h1>
        
        <ExploreSearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <ExploreTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {activeTab === "events" ? (
          <>
            <ExploreFilters />
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map(event => (
                    <div 
                      key={event.id} 
                      onClick={() => handleEventClick(event.id)} 
                      className="cursor-pointer"
                    >
                      <EventCard 
                        id={event.id}
                        title={event.title}
                        date={event.date}
                        location={event.location || ""}
                        imageUrl={event.image_url || ""}
                        attendees={event.attendees || 0}
                        type="public"
                        size="large"
                      />
                    </div>
                  ))}
                </div>
                
                <EventsPagination 
                  currentPage={metadata.currentPage}
                  totalPages={metadata.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-1">Nenhum evento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `Não encontramos resultados para "${searchQuery}"` 
                    : "Não há eventos públicos disponíveis"}
                </p>
              </div>
            )}
          </>
        ) : (
          <GroupsComingSoon 
            onExploreEvents={() => setActiveTab("events")}
            onCreateGroup={() => navigate('/grupos')}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ExplorePage;
