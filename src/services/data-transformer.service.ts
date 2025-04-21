
interface RawGroup {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string | null;
  group_members?: any[];
  // Add more fields as needed
}

export interface TransformedGroup {
  id: string;
  name: string;
  description: string;
  image_url: string;
  members: number;
  created_at?: string;
  // Add more fields as needed
}

export const DataTransformerService = {
  // Transforma dados de grupo do formato do banco para o formato da UI
  transformGroupData: (rawGroup: RawGroup | null): TransformedGroup | null => {
    if (!rawGroup) return null;
    
    return {
      id: rawGroup.id,
      name: rawGroup.name,
      description: rawGroup.description || '',
      image_url: rawGroup.image_url || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
      members: rawGroup.group_members?.length || 0,
      created_at: rawGroup.created_at,
    };
  },
  
  // Transforma lista de grupos
  transformGroupsList: (rawGroups: RawGroup[] | null): TransformedGroup[] => {
    if (!rawGroups || !Array.isArray(rawGroups)) return [];
    
    return rawGroups.map(group => 
      DataTransformerService.transformGroupData(group)
    ).filter((group): group is TransformedGroup => group !== null);
  },
  
  // Transforma dados de membros do grupo
  transformGroupMember: (rawMember: any): any => {
    if (!rawMember) return null;
    
    return {
      id: rawMember.id,
      user_id: rawMember.user_id,
      name: rawMember.profiles?.full_name || rawMember.profiles?.username || 'Usuário',
      email: rawMember.profiles?.email,
      avatarUrl: rawMember.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${rawMember.user_id}`,
      role: rawMember.is_admin ? "admin" : "member",
      is_admin: rawMember.is_admin
    };
  },
  
  // Transforma lista de membros do grupo
  transformGroupMembersList: (rawMembers: any[]): any[] => {
    if (!rawMembers || !Array.isArray(rawMembers)) return [];
    
    return rawMembers
      .map(member => DataTransformerService.transformGroupMember(member))
      .filter(member => member !== null);
  },
};
