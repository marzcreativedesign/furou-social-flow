
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // Fetch all groups for admin
      const { data, error } = await supabase
        .from('groups')
        .select('*, group_members:group_members(count)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include member count
      const transformedGroups = data.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        image_url: null, // Since image_url doesn't exist in the database, set it to null
        created_at: group.created_at,
        updated_at: group.updated_at,
        member_count: group.group_members?.length || 0
      }));
      
      setGroups(transformedGroups);
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
