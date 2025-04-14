
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      const groupsWithMembers = await Promise.all(groupsData.map(async (group) => {
        const { count, error: countError } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);
          
        if (countError) {
          console.error('Error counting members for group:', group.id, countError);
          return { ...group, member_count: 0 };
        }
        
        return { ...group, member_count: count || 0 };
      }));

      setGroups(groupsWithMembers);
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

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    fetchGroups
  };
};
