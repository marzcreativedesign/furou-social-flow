
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventQueriesService } from '@/services/event/queries';
import { Event } from "@/types/event";
import { ExploreEventsData, ExploreEventsResponse } from "@/types/explore";
import { getEventsCacheKey, getCachedEvents, cacheEvents, isCacheStale } from "@/utils/eventCache";
import { createEventResponse } from "@/utils/eventTransforms";
import { useDebounce } from '@/utils/debounce';

/**
 * Hook otimizado para explorar eventos com:
 * - Paginação eficiente
 * - Cache local
 * - Debounce para busca
 * - Prefetching da próxima página
 */
export const useExploreEvents = (pageSize: number = 9) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Implementa debounce para evitar consultas excessivas durante digitação
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const cacheKey = getEventsCacheKey('exploreEvents', { 
    page: currentPage, 
    pageSize,
    search: debouncedSearchQuery // Inclui o termo de busca na chave de cache
  });
  
  // Verifica se o cache existe e está "stale" (expirado, mas ainda utilizável)
  const isStale = isCacheStale(cacheKey);
  
  const { 
    data: eventsData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['publicEvents', currentPage, pageSize, debouncedSearchQuery],
    queryFn: async () => {
      // Estratégia de cache - tenta usar cache primeiro
      const cachedData = getCachedEvents(cacheKey);
      if (cachedData) {
        console.log('[Cache] Usando dados em cache para eventos de exploração');
        return cachedData;
      }

      console.log('[API] Buscando eventos de exploração do servidor');
      const response = await EventQueriesService.getPublicEvents(currentPage, pageSize);
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao buscar eventos públicos');
      }
      
      const result = createEventResponse(
        response.data || [],
        response.metadata?.currentPage || 1,
        response.metadata?.totalPages || 1
      );
      
      // Armazena resultado em cache com expiração de 5 minutos
      cacheEvents(cacheKey, result, 5);
      
      return result;
    },
    staleTime: 5 * 60 * 1000, // Dados permanecem "frescos" por 5 minutos
    gcTime: 10 * 60 * 1000,   // Dados são mantidos no cache por 10 minutos
  });

  // Atualiza se os dados estão stale (expirados mas ainda utilizáveis)
  useEffect(() => {
    if (isStale && !isLoading) {
      console.log('[Cache] Dados em cache expirados, atualizando em segundo plano');
      refetch(); // Recarrega em segundo plano se os dados estiverem stale
    }
  }, [isStale, isLoading, refetch]);

  // Implementação de prefetch da próxima página
  useEffect(() => {
    const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };
    
    if (metadata.currentPage < metadata.totalPages) {
      const nextPage = currentPage + 1;
      const nextPageCacheKey = getEventsCacheKey('exploreEvents', { 
        page: nextPage, 
        pageSize,
        search: debouncedSearchQuery 
      });
      
      // Prefetch apenas se não estiver em cache
      if (!getCachedEvents(nextPageCacheKey)) {
        console.log(`[Prefetch] Pré-carregando página ${nextPage}`);
        
        // Pequeno atraso para prefetch, priorizando renderização atual
        const timer = setTimeout(() => {
          EventQueriesService.getPublicEvents(nextPage, pageSize)
            .then((apiResponse: ExploreEventsResponse) => {
              if (apiResponse && !apiResponse.error && apiResponse.data) {
                const responseData = apiResponse.data as Event[];
                const responseMetadata = apiResponse.metadata || { totalPages: 1, currentPage: nextPage };
                
                const result = createEventResponse(
                  responseData,
                  nextPage,
                  responseMetadata.totalPages || 1
                );
                
                cacheEvents(nextPageCacheKey, result, 5);
              }
            })
            .catch(err => {
              console.error("Erro durante prefetch:", err);
            });
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentPage, eventsData, pageSize, debouncedSearchQuery]);

  const events = eventsData?.events || [];
  const metadata = eventsData?.metadata || { totalPages: 1, currentPage: 1 };

  // Filtra eventos baseado na busca (já aplicado debounce)
  const filteredEvents = events.filter(event => {
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query)) ||
        (event.profiles && event.profiles.full_name && event.profiles.full_name.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return {
    events: filteredEvents,
    isLoading,
    error,
    metadata,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    refetch
  };
};
