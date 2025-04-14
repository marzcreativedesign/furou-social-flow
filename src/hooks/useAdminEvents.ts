
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  is_public: boolean;
  creator_id: string;
  created_at: string | null;
  creator_name?: string;
};

export const useAdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:creator_id (
            full_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEvents = data.map(event => ({
        ...event,
        creator_name: event.profiles?.full_name || event.profiles?.username || 'Usuário desconhecido'
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    fetchEvents
  };
};
