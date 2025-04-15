
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Share2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type EventMetrics = {
  event_id: string;
  event_title: string;
  views: number;
  shares: number;
  participants: number;
};

const EventMetrics = () => {
  const [metrics, setMetrics] = useState<EventMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get events with participant counts
        const { data: eventsWithParticipants, error: participantsError } = await supabase
          .from('events')
          .select(`
            id,
            title
          `);

        if (participantsError) throw participantsError;

        const formattedMetrics: EventMetrics[] = await Promise.all((eventsWithParticipants || []).map(async event => {
          // Get participants count for each event
          const { data: participantsData, count } = await supabase
            .from("event_confirmations")
            .select("*", { count: 'exact', head: true })
            .eq("event_id", event.id)
            .eq("status", "confirmed");
          
          return {
            event_id: event.id,
            event_title: event.title,
            views: Math.floor(Math.random() * 1000), // Placeholder for views
            shares: Math.floor(Math.random() * 100), // Placeholder for shares
            participants: count || 0
          };
        }));

        setMetrics(formattedMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Métricas de Eventos</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.event_id}>
            <CardHeader>
              <CardTitle className="text-lg">{metric.event_title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Visualizações</span>
                  </div>
                  <span className="font-medium">{metric.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Compartilhamentos</span>
                  </div>
                  <span className="font-medium">{metric.shares}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Participantes</span>
                  </div>
                  <span className="font-medium">{metric.participants}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventMetrics;
