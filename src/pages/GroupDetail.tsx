
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import GroupHeader from '@/components/group-detail/GroupHeader';
import GroupEvents from '@/components/group-detail/GroupEvents';
import GroupAbout from '@/components/group-detail/GroupAbout';
import GroupMembersManagement from '@/components/group-detail/GroupMembersManagement';
import GroupRanking from '@/components/GroupRanking';
import GroupStats from '@/components/group-detail/GroupStats';
import GroupTabs from '@/components/group-detail/GroupTabs';
import { Button } from '@/components/ui/button';
import { useGroupData } from '@/hooks/useGroupData';
import ErrorBoundary from '@/components/ErrorBoundary';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('eventos');
  
  const {
    group,
    events,
    members,
    loading,
    error,
    isAdmin,
    isOwner
  } = useGroupData(id);

  if (loading) {
    return (
      <MainLayout 
        title="Carregando..." 
        showBack 
        onBack={() => navigate('/grupos')}
      >
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !group) {
    return (
      <MainLayout 
        title="Grupo não encontrado" 
        showBack 
        onBack={() => navigate('/grupos')}
      >
        <div className="p-4 text-center">
          <p className="mb-4">O grupo que você está procurando não foi encontrado.</p>
          <Button onClick={() => navigate('/grupos')}>Voltar para grupos</Button>
        </div>
      </MainLayout>
    );
  }

  const activeEventsCount = events.filter((e: any) => new Date(e.date) > new Date()).length;

  return (
    <MainLayout 
      title={group.name} 
      showBack 
      onBack={() => navigate('/grupos')}
    >
      <div className="p-4">
        <ErrorBoundary>
          <GroupHeader 
            name={group.name}
            description={group.description || ''}
            imageUrl={group.image_url}
            membersCount={members.length}
            eventsCount={events.length}
            activeEventsCount={activeEventsCount}
          />

          <GroupStats
            membersCount={members.length}
            eventsCount={events.length}
            activeEventsCount={activeEventsCount}
          />

          <Tabs 
            defaultValue="eventos" 
            value={activeTab} 
            className="w-full"
          >
            <GroupTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <TabsContent value="eventos">
              <ErrorBoundary>
                <GroupEvents events={events} isAdmin={isAdmin} />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="membros">
              <ErrorBoundary>
                <GroupMembersManagement 
                  groupId={id || '0'}
                  isOwner={isOwner}
                  isAdmin={isAdmin}
                />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="ranking">
              <ErrorBoundary>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Ranking de Participação</h2>
                  <GroupRanking members={members} />
                </div>
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="sobre">
              <ErrorBoundary>
                <GroupAbout
                  description={group.description}
                  createdAt={group.created_at}
                  admins={members.filter((m: any) => m.isAdmin)}
                  isOwner={isOwner}
                  onSettingsClick={() => {}}
                />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </div>
    </MainLayout>
  );
};

export default GroupDetail;
