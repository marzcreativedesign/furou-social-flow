
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import EventManagement from "./EventManagement";
import UserManagement from "./UserManagement";
import { BarChart, LineChart, PieChart } from "../charts/AdminCharts";
import GroupManagement from "./GroupManagement";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface DashboardStats {
  users: number;
  events: number;
  contributions: number;
  confirmations: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    events: 0,
    contributions: 0,
    confirmations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Events count
        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });

        // Event costs count
        const { count: costsCount } = await supabase
          .from('event_costs')
          .select('*', { count: 'exact', head: true });

        // Event confirmations count
        const { count: confirmationsCount } = await supabase
          .from('event_confirmations')
          .select('*', { count: 'exact', head: true });

        setStats({
          users: usersCount || 0,
          events: eventsCount || 0,
          contributions: costsCount || 0,
          confirmations: confirmationsCount || 0,
        });

      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Usuários"
          value={stats.users}
          description="Total de usuários registrados"
          loading={loading}
        />
        <StatCard
          title="Eventos"
          value={stats.events}
          description="Eventos criados no sistema"
          loading={loading}
        />
        <StatCard
          title="Contribuições"
          value={stats.contributions}
          description="Contribuições financeiras"
          loading={loading}
        />
        <StatCard
          title="Confirmações"
          value={stats.confirmations}
          description="Participações confirmadas"
          loading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Métricas do sistema</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-64">
              <LineChart />
            </div>
            <div className="h-64">
              <BarChart />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Gerenciar Eventos</TabsTrigger>
          <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
          <TabsTrigger value="groups">Gerenciar Grupos</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <EventManagement />
        </TabsContent>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  description,
  loading = false
}: {
  title: string;
  value: number;
  description: string;
  loading?: boolean;
}) => {
  return (
    <Card>
      <div className="p-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="text-3xl font-bold mt-1">
          {loading ? (
            <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
          ) : (
            value.toLocaleString()
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
    </Card>
  );
};

export default AdminDashboard;
