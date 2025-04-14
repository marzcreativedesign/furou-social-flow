
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, LineChart, PieChart } from "@/components/charts/AdminCharts";
import { UsersIcon, Calendar, Users, UserCircle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalGroups: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      
      try {
        // Obter contagem de usuários
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        // Obter contagem de eventos
        const { count: eventCount, error: eventError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
          
        // Obter contagem de grupos
        const { count: groupCount, error: groupError } = await supabase
          .from('groups')
          .select('*', { count: 'exact', head: true });
          
        // Estimar usuários ativos (aqueles que criaram eventos recentemente)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: activeUserCount, error: activeUserError } = await supabase
          .from('events')
          .select('creator_id', { count: 'exact', head: true })
          .gt('created_at', thirtyDaysAgo.toISOString());
        
        if (!userError && !eventError && !groupError && !activeUserError) {
          setStats({
            totalUsers: userCount || 0,
            totalEvents: eventCount || 0,
            totalGroups: groupCount || 0,
            activeUsers: activeUserCount || 0,
          });
        } else {
          console.error('Erro ao buscar estatísticas:', { userError, eventError, groupError, activeUserError });
        }
      } catch (error) {
        console.error('Erro ao buscar dados estatísticos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Usuários" 
          value={stats.totalUsers} 
          loading={loading}
          icon={<UsersIcon className="h-8 w-8 text-blue-500" />}
        />
        <StatCard 
          title="Eventos Criados" 
          value={stats.totalEvents} 
          loading={loading}
          icon={<Calendar className="h-8 w-8 text-green-500" />}
        />
        <StatCard 
          title="Total de Grupos" 
          value={stats.totalGroups} 
          loading={loading}
          icon={<Users className="h-8 w-8 text-purple-500" />}
        />
        <StatCard 
          title="Usuários Ativos" 
          value={stats.activeUsers} 
          loading={loading}
          icon={<UserCircle className="h-8 w-8 text-amber-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registros de Usuários</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eventos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Mensal</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart />
        </CardContent>
      </Card>
    </div>
  );
};

// Componente de card para estatísticas
const StatCard = ({ title, value, loading, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-9 w-20 mt-1" />
            ) : (
              <div className="text-3xl font-bold">{value}</div>
            )}
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
