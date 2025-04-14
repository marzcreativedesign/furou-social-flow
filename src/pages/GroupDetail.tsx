
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import GroupMembersManagement from '../components/GroupMembersManagement';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Info, Map, MessageCircle, Plus, Settings, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Simulação de dados de um grupo
const mockGroup = {
  id: '123',
  name: 'Amigos da Faculdade',
  description: 'Grupo para combinar os rolês da galera da faculdade',
  membersCount: 15,
  eventsCount: 8,
  coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80',
  isOwner: true,
  isAdmin: true
};

// Simulação de eventos do grupo
const mockEvents = [
  {
    id: '1',
    title: 'Happy Hour na Vila',
    date: 'Sexta, 19:00',
    location: 'Vila Madalena',
    imageUrl: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    attendees: 12
  },
  {
    id: '2',
    title: 'Churrasco de Final de Semestre',
    date: 'Domingo, 12:00',
    location: 'Casa do João',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    attendees: 15
  },
  {
    id: '3',
    title: 'Apresentação de TCC',
    date: 'Segunda, 14:00',
    location: 'Universidade',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    attendees: 8
  }
];

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState(mockGroup);
  const [events, setEvents] = useState(mockEvents);
  const [activeTab, setActiveTab] = useState('eventos');

  // Em uma implementação real, buscaríamos os dados do grupo a partir do ID
  useEffect(() => {
    // Aqui seria uma chamada para uma API para buscar os dados do grupo
    console.log(`Buscando dados do grupo ${id}`);
    // Usar os dados mockados por enquanto
  }, [id]);

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
            src={group.coverImage} 
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
            <div className="text-lg font-bold">{group.membersCount}</div>
            <div className="text-sm text-muted-foreground">Membros</div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="text-lg font-bold">{group.eventsCount}</div>
            <div className="text-sm text-muted-foreground">Eventos</div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <div className="text-lg font-bold">2</div>
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
            <TabsTrigger value="chat">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Chat</span>
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
              {events.map(event => (
                <div 
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-border dark:border-gray-700"
                  onClick={() => navigate(`/evento/${event.id}`)}
                >
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {event.attendees} confirmados
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Map className="h-3 w-3 mr-1" />
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba Membros */}
          <TabsContent value="membros">
            <GroupMembersManagement 
              groupId={id || '0'}
              isOwner={group.isOwner}
              isAdmin={group.isAdmin}
            />
          </TabsContent>
          
          {/* Conteúdo da aba Chat */}
          <TabsContent value="chat" className="h-[400px] flex items-center justify-center">
            <div className="text-center p-4">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Chat do grupo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Em breve você poderá conversar com todos do grupo aqui.
              </p>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ativar notificações
              </Button>
            </div>
          </TabsContent>
          
          {/* Conteúdo da aba Sobre */}
          <TabsContent value="sobre" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-2">Sobre o grupo</h3>
              <p className="text-muted-foreground text-sm mb-4">{group.description}</p>
              
              <h4 className="font-medium mb-2">Criado em</h4>
              <p className="text-muted-foreground text-sm mb-4">01 de Janeiro de 2023</p>
              
              <h4 className="font-medium mb-2">Criado por</h4>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                  <AvatarFallback>CO</AvatarFallback>
                </Avatar>
                <span className="text-sm">Carlos Oliveira</span>
              </div>
            </div>
            
            {group.isOwner && (
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
