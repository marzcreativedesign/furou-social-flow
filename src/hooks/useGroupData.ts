
import { useState, useEffect } from 'react';
import { GroupsService } from '@/services/groups/groups.service';
import { GroupEventsService } from '@/services/groups/events.service';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Group, GroupWithMembers } from '@/types/group';

interface GroupMember {
  id: string;
  name: string;
  image: string;
  isAdmin: boolean;
  stats?: {
    participated: number;
    missed: number;
    pending: number;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  image_url?: string;
  attendees?: number;
}

interface UseGroupDataResult {
  group: GroupWithMembers | null;
  events: Event[];
  members: GroupMember[];
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isOwner: boolean;
}

export const useGroupData = (id: string | undefined): UseGroupDataResult => {
  const [group, setGroup] = useState<GroupWithMembers | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!id) {
        setError('Group ID not provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const { data: groupData, error: groupError } = await GroupsService.getGroupById(id);
        
        if (groupError) {
          setError(groupError.message);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os dados do grupo',
            variant: 'destructive',
          });
          return;
        }
        
        if (groupData) {
          setGroup(groupData);
          
          const { data: user } = await supabase.auth.getUser();
          const isUserAdmin = groupData.group_members?.some(
            (member: any) => member.user_id === user.user?.id && member.is_admin
          );
          setIsAdmin(isUserAdmin);
          
          const firstAdmin = groupData.group_members?.find((member: any) => member.is_admin);
          setIsOwner(firstAdmin?.user_id === user.user?.id);
          
          const { data: groupEvents, error: eventsError } = await GroupEventsService.getGroupEvents(id);
          
          if (!eventsError && groupEvents) {
            const formattedEvents = groupEvents.map((item: any) => ({
              id: item.id,
              title: item.title,
              date: new Date(item.date).toLocaleString('pt-BR', {
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric'
              }),
              location: item.location,
              image_url: item.image_url,
              attendees: 0
            }));
            
            setEvents(formattedEvents);
          }
          
          if (groupData.group_members && Array.isArray(groupData.group_members)) {
            const formattedMembers = groupData.group_members.map((member: any) => ({
              id: member.user_id,
              name: member.profile?.full_name || member.profile?.username || 'Member',
              image: member.profile?.avatar_url || `https://i.pravatar.cc/150?u=${member.user_id}`,
              isAdmin: member.is_admin,
              stats: { 
                participated: Math.floor(Math.random() * 10),
                missed: Math.floor(Math.random() * 5),
                pending: Math.floor(Math.random() * 3)
              }
            }));
            
            setMembers(formattedMembers);
          }
        }
      } catch (err: any) {
        console.error('Error fetching group data:', err);
        setError(err?.message || 'An unexpected error occurred');
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao carregar os dados do grupo',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [id, toast]);

  return {
    group,
    events,
    members,
    loading,
    error,
    isAdmin,
    isOwner
  };
};
