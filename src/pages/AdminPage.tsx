
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import EventManagement from "@/components/admin/EventManagement";
import EventMetrics from "@/components/admin/EventMetrics";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, eventos e visualize métricas da plataforma
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          Administrador
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <EventManagement />
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <EventMetrics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
