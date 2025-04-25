import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Calendar, Info, Users, Badge } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupHeader from '@/components/group-detail/GroupHeader';
import GroupEvents from '@/components/group-detail/GroupEvents';
import GroupAbout from '@/components/group-detail/GroupAbout';
import GroupMembersManagement from '@/components/GroupMembersManagement';
import GroupRanking from '@/components/GroupRanking';
import { GroupsService } from '@/services/groups';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
        // Fetch group details
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
          
          // Check if user is admin
          const { data: user } = await supabase.auth.getUser();
          const isUserAdmin = groupData.group_members?.some(
            (member: any) => member.user_id === user.user?.id && member.is_admin
          );
          setIsAdmin(isUserAdmin);
          
          // For simplicity, assuming the first admin is the owner
          const firstAdmin = groupData.group_members?.find((member: any) => member.is_admin);
          setIsOwner(firstAdmin?.user_id === user.user?.id);
          
          // Get group events
          const { data: groupEvents, error: eventsError } = await GroupsService.getGroupEvents(id);
          
          if (!eventsError && groupEvents) {
            const formattedEvents = groupEvents.map((item: any) => ({
              id: item.events.id,
              title: item.events.title,
              date: new Date(item.events.date).toLocaleString('pt-BR', {
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
              }),
              location: item.events.location,
              image_url: item.events.image_url,
              attendees: 0 // Will update with actual count
            }));
            
            setEvents(formattedEvents);
          }
          
          // Get group members
          const { data: groupMembers, error: membersError } = await GroupsService.getGroupMembers(id);
          
          if (!membersError && groupMembers) {
            // Convert to the format expected by GroupRanking
            const formattedMembers = groupMembers.map((member: GroupMember) => ({
              id: member.user_id,
              name: member.profiles?.full_name || member.profiles?.username || 'Usuário',
              image: member.profiles?.avatar_url || 'https://i.pravatar.cc/150?u=' + member.user_id,
              isAdmin: member.is_admin,
              stats: { 
                participated: Math.floor(Math.random() * 10), // Mock stats for now
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
          activeEventsCount={events.filter(e => new Date(e.date) > new Date()).length}
        />

        <Tabs 
          defaultValue="eventos" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="eventos">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="membros">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Membros</span>
            </TabsTrigger>
            <TabsTrigger value="ranking">
              <Badge className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ranking</span>
            </TabsTrigger>
            <TabsTrigger value="sobre">
              <Info className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sobre</span>
            </TabsTrigger>
          </TabsList>
          
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
              admins={members.filter(m => m.isAdmin)}
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
