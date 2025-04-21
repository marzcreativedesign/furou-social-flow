
import { create } from 'zustand';
import { GroupsService } from '@/services/groups.service';

interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  members?: number;
  lastActivity?: string;
  created_at?: string;
}

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setGroups: (groups: Group[]) => void;
  setCurrentGroup: (group: Group | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchGroups: () => Promise<void>;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
  
  setGroups: (groups) => set({ groups }),
  setCurrentGroup: (currentGroup) => set({ currentGroup }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  fetchGroups: async () => {
    set({ loading: true, error: null });
    try {
      const { data: groupMembers, error } = await GroupsService.getUserGroups();
      
      if (error) {
        set({ error: error.message || 'Erro ao carregar grupos', loading: false });
        return;
      }
      
      if (groupMembers && groupMembers.length > 0) {
        // Map para evitar grupos duplicados
        const groupsMap = new Map<string, Group>();

        groupMembers.forEach(item => {
          if (item.groups?.id) {
            const groupId = item.groups.id;
            if (!groupsMap.has(groupId)) {
              groupsMap.set(groupId, {
                id: groupId,
                name: item.groups?.name || "",
                description: item.groups?.description || "",
                image_url: item.groups?.image_url || "",
                members: 1,
                lastActivity: "",
                created_at: item.groups?.created_at,
              });
            }
          }
        });

        const formattedGroups = Array.from(groupsMap.values());
        set({ groups: formattedGroups, loading: false });
      } else {
        set({ groups: [], loading: false });
      }
    } catch (error: any) {
      set({ 
        error: error?.message || 'Ocorreu um erro inesperado', 
        loading: false 
      });
    }
  }
}));
