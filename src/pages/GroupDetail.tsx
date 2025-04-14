import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import GroupMembersManagement from '../components/GroupMembersManagement';
import GroupRanking from '../components/GroupRanking';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Info, Map, MessageCircle, Plus, Settings, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GroupsService } from '@/services/groups.service';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  is_admin: boolean;
  joined_at: string;
  profiles?: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  image_url?: string;
  attendees?: number;
}

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<any[]>([]);
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
        {/* Header do grupo com imagem de capa */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6">
          <img 
            src={group.image_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac'} 
            alt={group.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-sm text-white/80">{group.description}</p>
          </div>
        </div>

        {/* Estatísticas do grupo */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="text-lg font-bold">{members.length}</div>
            <div className="text-sm text-muted-foreground">Membros</div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="text-lg font-bold">{events.length}</div>
            <div className="text-sm text-muted-foreground">Eventos</div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="text-lg font-bold">
              {events.filter(e => new Date(e.date) > new Date()).length}
            </div>
            <div className="text-sm text-muted-foreground">Ativos</div>
          </div>
        </div>

        {/* Abas de navegação */}
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
          
          {/* Conteúdo da aba Eventos */}
          <TabsContent value="eventos" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Eventos do Grupo</h2>
              <Button size="sm" onClick={() => navigate('/criar')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Evento
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.length > 0 ? (
                events.map(event => (
                  <div 
                    key={event.id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-border dark:border-gray-700"
                    onClick={() => navigate(`/evento/${event.id}`)}
                  >
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={event.image_url || 'https://images.unsplash.com/photo-1506157786151-b8491531f063'} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {event.attendees || 0} confirmados
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Map className="h-3 w-3 mr-1" />
                        {event.location || 'Local não definido'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-10 text-center">
                  <p className="text-muted-foreground mb-4">Este grupo ainda não possui eventos.</p>
                  {isAdmin && (
                    <Button onClick={() => navigate('/criar')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar primeiro evento
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba Membros */}
          <TabsContent value="membros">
            <GroupMembersManagement 
              groupId={id || '0'}
              isOwner={isOwner}
              isAdmin={isAdmin}
            />
          </TabsContent>
          
          {/* Conteúdo da aba Ranking */}
          <TabsContent value="ranking">
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Ranking de Participação</h2>
              <GroupRanking members={members} />
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba Sobre */}
          <TabsContent value="sobre" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">Sobre o grupo</h3>
              <p className="text-muted-foreground text-sm mb-4">{group.description || 'Sem descrição'}</p>
              
              <h4 className="font-medium mb-2">Criado em</h4>
              <p className="text-muted-foreground text-sm mb-4">
                {group.created_at 
                  ? new Date(group.created_at).toLocaleDateString('pt-BR') 
                  : 'Data desconhecida'}
              </p>
              
              <h4 className="font-medium mb-2">Criado por</h4>
              {members.filter(m => m.isAdmin).length > 0 ? (
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={members.find(m => m.isAdmin)?.image} />
                    <AvatarFallback>
                      {members.find(m => m.isAdmin)?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{members.find(m => m.isAdmin)?.name}</span>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Informação não disponível</p>
              )}
            </div>
            
            {isOwner && (
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações do grupo
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GroupDetail;
