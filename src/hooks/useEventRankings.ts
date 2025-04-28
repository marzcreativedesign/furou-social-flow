
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GroupsService } from "@/services/groups.service";
import { RankingUser } from "@/types/group";

export const useEventRankings = (initialLimit: number = 10) => {
  const [limit, setLimit] = useState(initialLimit);

  // Ranking de usuários que mais confirmaram presença em eventos
  const {
    data: confirmedRanking = [],
    isLoading: loadingConfirmed,
    refetch: refetchConfirmed
  } = useQuery({
    queryKey: ['confirmedRanking', limit],
    queryFn: async () => {
      const { data, error } = await GroupsService.getConfirmedEventRanking(limit);
      if (error) throw error;
      return data as RankingUser[];
    }
  });

  // Ranking de usuários que mais "furaram" eventos
  const {
    data: missedRanking = [],
    isLoading: loadingMissed,
    refetch: refetchMissed
  } = useQuery({
    queryKey: ['missedRanking', limit],
    queryFn: async () => {
      const { data, error } = await GroupsService.getMissedEventRanking(limit);
      if (error) throw error;
      return data as RankingUser[];
    }
  });

  const loadMore = () => {
    setLimit(prevLimit => prevLimit + 10);
  };

  return {
    confirmedRanking,
    missedRanking,
    loadingConfirmed,
    loadingMissed,
    refetchConfirmed,
    refetchMissed,
    loadMore,
    limit
  };
};
