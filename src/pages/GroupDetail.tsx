import React, { useEffect, useState } from 'react';
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
import { GroupsService } from '@/services/groups/groups.service';
import { GroupEventsService } from '@/services/groups/events.service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<any>(null);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('eventos');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data: groupData, error: groupError } = await GroupsService.getGroupById(id);
        
        if (groupError) {
          console.error('Error fetching group:', groupError);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os dados do grupo',
            variant: 'destructive',
          });
          return;
        }
        
        if (groupData) {
          setGroup(groupData);
          
          const { data: user } = await supabase.auth.getUser();
          const isUserAdmin = groupData.group_members?.some(
            (member: any) => member.user_id === user.user?.id && member.is_admin
          );
          setIsAdmin(isUserAdmin);
          
          const firstAdmin = groupData.group_members?.find((member: any) => member.is_admin);
          setIsOwner(firstAdmin?.user_id === user.user?.id);
          
          const { data: groupEvents, error: eventsError } = await GroupEventsService.getGroupEvents(id);
          
          if (!eventsError && groupEvents) {
            const formattedEvents = groupEvents.map((item: any) => ({
              id: item.id,
              title: item.title,
              date: new Date(item.date).toLocaleString('pt-BR', {
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
              }),
              location: item.location,
              image_url: item.image_url,
              attendees: 0
            }));
            
            setEvents(formattedEvents);
          }
          
          if (groupData.group_members && Array.isArray(groupData.group_members)) {
            const formattedMembers = groupData.group_members.map((member: any) => ({
              id: member.user_id,
              name: member.profile?.full_name || member.profile?.username || 'Member',
              image: member.profile?.avatar_url || `https://i.pravatar.cc/150?u=${member.user_id}`,
              isAdmin: member.is_admin,
              stats: { 
                participated: Math.floor(Math.random() * 10),
                missed: Math.floor(Math.random() * 5),
                pending: Math.floor(Math.random() * 3)
              }
            }));
            
            setMembers(formattedMembers);
          }
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao carregar os dados do grupo',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [id, toast]);

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

  if (!group) {
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

  return (
    <MainLayout 
      title={group.name} 
      showBack 
      onBack={() => navigate('/grupos')}
    >
      <div className="p-4">
        <GroupHeader 
          name={group.name}
          description={group.description}
          imageUrl={group.image_url}
          membersCount={members.length}
          eventsCount={events.length}
          activeEventsCount={events.filter((e: any) => new Date(e.date) > new Date()).length}
        />

        <GroupStats
          membersCount={members.length}
          eventsCount={events.length}
          activeEventsCount={events.filter((e: any) => new Date(e.date) > new Date()).length}
        />

        <Tabs 
          defaultValue="eventos" 
          value={activeTab} 
          className="w-full"
        >
          <GroupTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <TabsContent value="eventos">
            <GroupEvents events={events} isAdmin={isAdmin} />
          </TabsContent>
          
          <TabsContent value="membros">
            <GroupMembersManagement 
              groupId={id || '0'}
              isOwner={isOwner}
              isAdmin={isAdmin}
            />
          </TabsContent>
          
          <TabsContent value="ranking">
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Ranking de Participação</h2>
              <GroupRanking members={members} />
            </div>
          </TabsContent>
          
          <TabsContent value="sobre">
            <GroupAbout
              description={group.description}
              createdAt={group.created_at}
              admins={members.filter((m: any) => m.isAdmin)}
              isOwner={isOwner}
              onSettingsClick={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GroupDetail;
