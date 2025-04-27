
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { EventsService } from "@/services/events.service";
import { toast } from "sonner";
import { Event } from "@/types/event";
import { FilterType, UseHomeEventsReturn } from "./types";
import { useDebounce } from "@/utils/debounce";
import { generateCacheKey, getCache, setCache } from "@/utils/clientCache";

// Define a interface para eventos em cache
interface CachedHomeEvents {
  events: ExtendedEvent[];
  publicEvents: ExtendedEvent[];
  timestamp: number;
}

// Define extended event type com as propriedades personalizadas necessárias
interface ExtendedEvent extends Event {
  type?: 'public' | 'private' | 'group';
  groupName?: string | null;
  confirmed?: boolean;
  attendees?: number;
}

export const useHomeEvents = (
  searchQuery: string,
  activeFilter: FilterType
): UseHomeEventsReturn => {
  const { user } = useAuth();
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [publicEvents, setPublicEvents] = useState<ExtendedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Aplica debounce na busca para reduzir requisições durante digitação
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Cria uma chave de cache baseada no usuário atual
  const cacheKey = user ? generateCacheKey('homeEvents', { userId: user.id }) : 'homeEvents_guest';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        
        // Verifica se existem dados em cache primeiro
        const cachedData = getCache<CachedHomeEvents>(cacheKey);
        if (cachedData) {
          console.log('[Cache] Usando dados em cache para página inicial');
          setEvents(cachedData.events);
          setPublicEvents(cachedData.publicEvents);
          setLoading(false);
          
          // Se o cache tem mais de 2 minutos, recarrega em segundo plano
          if (Date.now() - cachedData.timestamp > 2 * 60 * 1000) {
            console.log('[Cache] Atualizando dados em segundo plano');
            setTimeout(() => refreshData(), 500);
          }
          return;
        }
        
        await refreshData();
      } catch (error) {
        console.error("Error loading homepage data:", error);
        toast.error("Erro ao carregar dados");
        setLoading(false);
      }
    };

    const refreshData = async () => {
      try {
        if (!user) return;
        
        console.time('fetchHomeEvents');
        
        // Fetch eventos relacionados ao usuário
        const { data: userEvents, error: eventsError } = await EventsService.getEvents();
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          toast.error("Erro ao carregar eventos");
        } else if (userEvents) {
          // Processar eventos principais
          const processedEvents = userEvents
            .filter(event => event.event_participants?.some(
              p => p.user_id === user.id && p.status !== 'invited' && p.status !== 'pending'
            ) || event.creator_id === user.id)
            .map(event => {
              const groupInfo = event.group_events && event.group_events[0]?.groups 
                ? event.group_events[0].groups 
                : null;
              
              return {
                ...event,
                confirmed: event.event_participants && event.event_participants.some(
                  p => p.user_id === user.id && p.status === 'confirmed'
                ),
                type: event.is_public ? "public" as const : (groupInfo ? "group" as const : "private" as const),
                groupName: groupInfo?.name || null,
                attendees: event.event_participants?.length || 0
              } as ExtendedEvent;
            });
          
          setEvents(processedEvents);
        }

        // Fetch eventos públicos (otimizado)
        const { data: publicEventsData, error: publicEventsError } = await EventsService.getPublicEvents();
        
        if (publicEventsError) {
          console.error("Error fetching public events:", publicEventsError);
        } else if (publicEventsData) {
          const formattedPublicEvents = publicEventsData
            .filter(event => !user || event.creator_id !== user.id)
            .map(event => ({
              ...event,
              confirmed: event.event_participants ? event.event_participants.some(
                p => p.user_id === user?.id && p.status === 'confirmed'
              ) : false,
              type: "public" as const,
              attendees: event.event_participants?.length || 0
            } as ExtendedEvent));
          
          setPublicEvents(formattedPublicEvents);
          
          // Armazena os dados em cache para uso futuro
          const cacheData: CachedHomeEvents = {
            events: processedEvents || [], // Fixed: using processedEvents instead of formattedEvents
            publicEvents: formattedPublicEvents || [],
            timestamp: Date.now()
          };
          
          setCache(cacheKey, cacheData, { expireTimeInMinutes: 10 });
        }
        
        console.timeEnd('fetchHomeEvents');
        setLoading(false);
      } catch (error) {
        console.error("Error refreshing data:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, cacheKey]);

  // Filtra eventos com base na busca (já com debounce) e nos filtros ativos
  const filteredEvents = events.filter(event => {
    if (
      (activeFilter === 'public' && !event.is_public) || 
      (activeFilter === 'private' && (event.is_public || event.type === 'group')) || 
      (activeFilter === 'group' && event.type !== 'group') || 
      (activeFilter === 'confirmed' && !event.confirmed) || 
      (activeFilter === 'missed' && event.confirmed !== false)
    ) {
      return false;
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) || 
        (event.groupName && event.groupName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return { loading, filteredEvents, publicEvents };
};
