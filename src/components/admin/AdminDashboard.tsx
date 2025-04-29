
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import SystemSettings from './SystemSettings';
import Analytics from './Analytics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="events">
          <EventManagement />
        </TabsContent>
        
        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
