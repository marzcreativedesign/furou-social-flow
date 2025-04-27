
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export type Group = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  member_count?: number;
}

export const useGroupsAdmin = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Since groups table is removed, we return an empty array
      setGroups([]);
      toast({
        title: "Funcionalidade desativada",
        description: "O módulo de grupos está temporariamente indisponível.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Erro ao carregar grupos",
        description: "Não foi possível carregar a lista de grupos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    groups,
    loading,
    fetchGroups
  };
};
