
// ============= Mock Users/Profiles =============

export const mockUser = {
  id: "mock-user-1",
  email: "usuario@furou.app",
  user_metadata: {
    full_name: "João Silva",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-12-01T10:00:00Z"
};

export const mockProfile = {
  id: "mock-user-1",
  full_name: "João Silva",
  username: "joaosilva",
  avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  bio: "Amante de eventos e encontros com amigos!",
  created_at: "2024-01-15T10:00:00Z"
};

export const mockProfiles = [
  mockProfile,
  {
    id: "mock-user-2",
    full_name: "Maria Santos",
    username: "mariasantos",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "Organizadora de festas",
    created_at: "2024-02-10T10:00:00Z"
  },
  {
    id: "mock-user-3",
    full_name: "Pedro Costa",
    username: "pedrocosta",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Sempre presente nos churrascos!",
    created_at: "2024-03-05T10:00:00Z"
  },
  {
    id: "mock-user-4",
    full_name: "Ana Oliveira",
    username: "anaoliveira",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Amante de piqueniques",
    created_at: "2024-03-20T10:00:00Z"
  },
  {
    id: "mock-user-5",
    full_name: "Lucas Mendes",
    username: "lucasmendes",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Fotógrafo amador",
    created_at: "2024-04-01T10:00:00Z"
  },
  {
    id: "mock-user-6",
    full_name: "Carla Ferreira",
    username: "carlaferreira",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Cozinheira nas horas vagas",
    created_at: "2024-04-15T10:00:00Z"
  }
];

// ============= Mock Gallery Images =============

export const mockGalleryImages: Record<string, any[]> = {
  "event-1": [
    {
      id: "img-1-1",
      src: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-2",
      event_id: "event-1",
      filename: "mock-user-2-churrasco-1.jpg",
      created_at: "2024-12-10T15:30:00Z",
      user: { fullName: "Maria Santos", avatarUrl: mockProfiles[1].avatar_url }
    },
    {
      id: "img-1-2",
      src: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-3",
      event_id: "event-1",
      filename: "mock-user-3-churrasco-2.jpg",
      created_at: "2024-12-10T16:00:00Z",
      user: { fullName: "Pedro Costa", avatarUrl: mockProfiles[2].avatar_url }
    },
    {
      id: "img-1-3",
      src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-1",
      event_id: "event-1",
      filename: "mock-user-1-churrasco-3.jpg",
      created_at: "2024-12-10T17:00:00Z",
      user: { fullName: "João Silva", avatarUrl: mockProfiles[0].avatar_url }
    }
  ],
  "event-2": [
    {
      id: "img-2-1",
      src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-4",
      event_id: "event-2",
      filename: "mock-user-4-festa-1.jpg",
      created_at: "2024-12-08T19:00:00Z",
      user: { fullName: "Ana Oliveira", avatarUrl: mockProfiles[3].avatar_url }
    },
    {
      id: "img-2-2",
      src: "https://images.unsplash.com/photo-1496843916299-590492c751f4?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-2",
      event_id: "event-2",
      filename: "mock-user-2-festa-2.jpg",
      created_at: "2024-12-08T20:30:00Z",
      user: { fullName: "Maria Santos", avatarUrl: mockProfiles[1].avatar_url }
    }
  ],
  "event-4": [
    {
      id: "img-4-1",
      src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-5",
      event_id: "event-4",
      filename: "mock-user-5-piquenique-1.jpg",
      created_at: "2024-12-05T11:00:00Z",
      user: { fullName: "Lucas Mendes", avatarUrl: mockProfiles[4].avatar_url }
    },
    {
      id: "img-4-2",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-4",
      event_id: "event-4",
      filename: "mock-user-4-piquenique-2.jpg",
      created_at: "2024-12-05T12:00:00Z",
      user: { fullName: "Ana Oliveira", avatarUrl: mockProfiles[3].avatar_url }
    },
    {
      id: "img-4-3",
      src: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-1",
      event_id: "event-4",
      filename: "mock-user-1-piquenique-3.jpg",
      created_at: "2024-12-05T13:00:00Z",
      user: { fullName: "João Silva", avatarUrl: mockProfiles[0].avatar_url }
    },
    {
      id: "img-4-4",
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      user_id: "mock-user-6",
      event_id: "event-4",
      filename: "mock-user-6-piquenique-4.jpg",
      created_at: "2024-12-05T14:00:00Z",
      user: { fullName: "Carla Ferreira", avatarUrl: mockProfiles[5].avatar_url }
    }
  ]
};

// ============= Mock Events =============

export const mockEvents = [
  {
    id: "event-1",
    title: "Churrasco de Fim de Semana",
    description: "Um churrasco delicioso com os amigos para comemorar o fim de semana. Traga sua bebida favorita!",
    date: "2025-01-15T14:00:00",
    location: "Casa do João",
    address: "Rua das Flores, 123 - São Paulo, SP",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=987",
    estimated_budget: 500,
    creator_id: "mock-user-1",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
    profiles: mockProfiles[0],
    event_participants: [
      { id: "p1", user_id: "mock-user-1", event_id: "event-1", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p2", user_id: "mock-user-2", event_id: "event-1", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p3", user_id: "mock-user-3", event_id: "event-1", status: "confirmed", profiles: mockProfiles[2] },
      { id: "p4", user_id: "mock-user-4", event_id: "event-1", status: "pending", profiles: mockProfiles[3] },
      { id: "p5", user_id: "mock-user-5", event_id: "event-1", status: "declined", profiles: mockProfiles[4] }
    ],
    attendees: 5
  },
  {
    id: "event-2",
    title: "Festa Junina",
    description: "Tradicional festa junina com comidas típicas, quadrilha e muito forró!",
    date: "2025-06-20T18:00:00",
    location: "Praça Central",
    address: "Praça da República - Centro, SP",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1470",
    estimated_budget: 1200,
    creator_id: "mock-user-2",
    created_at: "2024-11-15T10:00:00Z",
    updated_at: "2024-11-15T10:00:00Z",
    profiles: mockProfiles[1],
    event_participants: [
      { id: "p6", user_id: "mock-user-2", event_id: "event-2", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p7", user_id: "mock-user-1", event_id: "event-2", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p8", user_id: "mock-user-4", event_id: "event-2", status: "confirmed", profiles: mockProfiles[3] },
      { id: "p9", user_id: "mock-user-5", event_id: "event-2", status: "pending", profiles: mockProfiles[4] },
      { id: "p10", user_id: "mock-user-6", event_id: "event-2", status: "confirmed", profiles: mockProfiles[5] },
      { id: "p11", user_id: "mock-user-3", event_id: "event-2", status: "declined", profiles: mockProfiles[2] }
    ],
    attendees: 6
  },
  {
    id: "event-3",
    title: "Workshop de Fotografia",
    description: "Aprenda técnicas básicas e avançadas de fotografia com profissionais experientes.",
    date: "2025-02-10T09:00:00",
    location: "Studio Foto & Arte",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1474",
    estimated_budget: 300,
    creator_id: "mock-user-5",
    created_at: "2024-11-20T10:00:00Z",
    updated_at: "2024-11-20T10:00:00Z",
    profiles: mockProfiles[4],
    event_participants: [
      { id: "p12", user_id: "mock-user-5", event_id: "event-3", status: "confirmed", profiles: mockProfiles[4] },
      { id: "p13", user_id: "mock-user-1", event_id: "event-3", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p14", user_id: "mock-user-3", event_id: "event-3", status: "pending", profiles: mockProfiles[2] }
    ],
    attendees: 3
  },
  {
    id: "event-4",
    title: "Piquenique no Parque",
    description: "Um encontro relaxante ao ar livre com jogos, comidas e boa companhia.",
    date: "2025-03-08T10:00:00",
    location: "Parque Ibirapuera",
    address: "Parque Ibirapuera - Vila Mariana, SP",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&q=80&w=1470",
    estimated_budget: 200,
    creator_id: "mock-user-4",
    created_at: "2024-11-25T10:00:00Z",
    updated_at: "2024-11-25T10:00:00Z",
    profiles: mockProfiles[3],
    event_participants: [
      { id: "p15", user_id: "mock-user-4", event_id: "event-4", status: "confirmed", profiles: mockProfiles[3] },
      { id: "p16", user_id: "mock-user-2", event_id: "event-4", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p17", user_id: "mock-user-1", event_id: "event-4", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p18", user_id: "mock-user-3", event_id: "event-4", status: "pending", profiles: mockProfiles[2] },
      { id: "p19", user_id: "mock-user-5", event_id: "event-4", status: "confirmed", profiles: mockProfiles[4] },
      { id: "p20", user_id: "mock-user-6", event_id: "event-4", status: "declined", profiles: mockProfiles[5] }
    ],
    attendees: 6
  },
  {
    id: "event-5",
    title: "Happy Hour",
    description: "Depois do trabalho, vamos relaxar e tomar uma cerveja gelada!",
    date: "2025-01-25T18:30:00",
    location: "Bar do Zé",
    address: "Rua Augusta, 500 - Consolação, SP",
    is_public: false,
    image_url: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?auto=format&fit=crop&q=80&w=1470",
    estimated_budget: 150,
    creator_id: "mock-user-1",
    created_at: "2024-12-05T10:00:00Z",
    updated_at: "2024-12-05T10:00:00Z",
    profiles: mockProfiles[0],
    event_participants: [
      { id: "p21", user_id: "mock-user-1", event_id: "event-5", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p22", user_id: "mock-user-2", event_id: "event-5", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p23", user_id: "mock-user-6", event_id: "event-5", status: "pending", profiles: mockProfiles[5] }
    ],
    attendees: 3
  },
  {
    id: "event-6",
    title: "Aniversário da Maria",
    description: "Venha celebrar mais um ano de vida da nossa querida Maria!",
    date: "2025-02-28T20:00:00",
    location: "Salão de Festas",
    address: "Rua das Palmeiras, 200 - Moema, SP",
    is_public: false,
    image_url: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80&w=1498",
    estimated_budget: 2000,
    creator_id: "mock-user-2",
    created_at: "2024-12-10T10:00:00Z",
    updated_at: "2024-12-10T10:00:00Z",
    profiles: mockProfiles[1],
    event_participants: [
      { id: "p24", user_id: "mock-user-2", event_id: "event-6", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p25", user_id: "mock-user-1", event_id: "event-6", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p26", user_id: "mock-user-3", event_id: "event-6", status: "confirmed", profiles: mockProfiles[2] },
      { id: "p27", user_id: "mock-user-4", event_id: "event-6", status: "pending", profiles: mockProfiles[3] },
      { id: "p28", user_id: "mock-user-5", event_id: "event-6", status: "declined", profiles: mockProfiles[4] },
      { id: "p29", user_id: "mock-user-6", event_id: "event-6", status: "confirmed", profiles: mockProfiles[5] }
    ],
    attendees: 6
  }
];

// ============= Mock Groups =============

export const mockGroups = [
  {
    id: "group-1",
    name: "Amigos do Churrasco",
    description: "Grupo para organizar churrascos mensais entre amigos",
    image_url: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800",
    type: "private",
    creator_id: "mock-user-1",
    created_at: "2024-06-01T10:00:00Z",
    members: [
      { id: "gm-1", user_id: "mock-user-1", group_id: "group-1", role: "admin", profiles: mockProfiles[0] },
      { id: "gm-2", user_id: "mock-user-2", group_id: "group-1", role: "member", profiles: mockProfiles[1] },
      { id: "gm-3", user_id: "mock-user-3", group_id: "group-1", role: "member", profiles: mockProfiles[2] },
      { id: "gm-4", user_id: "mock-user-4", group_id: "group-1", role: "member", profiles: mockProfiles[3] }
    ],
    events_count: 5,
    members_count: 4
  },
  {
    id: "group-2",
    name: "Fotógrafos SP",
    description: "Comunidade de fotógrafos amadores e profissionais de São Paulo",
    image_url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=800",
    type: "public",
    creator_id: "mock-user-5",
    created_at: "2024-03-15T10:00:00Z",
    members: [
      { id: "gm-5", user_id: "mock-user-5", group_id: "group-2", role: "admin", profiles: mockProfiles[4] },
      { id: "gm-6", user_id: "mock-user-1", group_id: "group-2", role: "member", profiles: mockProfiles[0] },
      { id: "gm-7", user_id: "mock-user-6", group_id: "group-2", role: "member", profiles: mockProfiles[5] }
    ],
    events_count: 8,
    members_count: 3
  },
  {
    id: "group-3",
    name: "Piqueniques & Natureza",
    description: "Para quem ama aproveitar o ar livre com boas companhias",
    image_url: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&q=80&w=800",
    type: "public",
    creator_id: "mock-user-4",
    created_at: "2024-04-20T10:00:00Z",
    members: [
      { id: "gm-8", user_id: "mock-user-4", group_id: "group-3", role: "admin", profiles: mockProfiles[3] },
      { id: "gm-9", user_id: "mock-user-1", group_id: "group-3", role: "member", profiles: mockProfiles[0] },
      { id: "gm-10", user_id: "mock-user-2", group_id: "group-3", role: "member", profiles: mockProfiles[1] },
      { id: "gm-11", user_id: "mock-user-5", group_id: "group-3", role: "member", profiles: mockProfiles[4] },
      { id: "gm-12", user_id: "mock-user-6", group_id: "group-3", role: "member", profiles: mockProfiles[5] }
    ],
    events_count: 12,
    members_count: 5
  },
  {
    id: "group-4",
    name: "Happy Hour Club",
    description: "Grupo para combinar happy hours depois do trabalho",
    image_url: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?auto=format&fit=crop&q=80&w=800",
    type: "private",
    creator_id: "mock-user-1",
    created_at: "2024-07-10T10:00:00Z",
    members: [
      { id: "gm-13", user_id: "mock-user-1", group_id: "group-4", role: "admin", profiles: mockProfiles[0] },
      { id: "gm-14", user_id: "mock-user-2", group_id: "group-4", role: "member", profiles: mockProfiles[1] },
      { id: "gm-15", user_id: "mock-user-6", group_id: "group-4", role: "member", profiles: mockProfiles[5] }
    ],
    events_count: 15,
    members_count: 3
  }
];

// ============= Mock Group Invites =============

export const mockGroupInvites = [
  {
    id: "invite-1",
    group_id: "group-2",
    user_id: "mock-user-3",
    invited_by: "mock-user-5",
    status: "pending",
    created_at: "2024-12-10T10:00:00Z",
    group: mockGroups[1]
  },
  {
    id: "invite-2",
    group_id: "group-3",
    user_id: "mock-user-3",
    invited_by: "mock-user-4",
    status: "pending",
    created_at: "2024-12-11T10:00:00Z",
    group: mockGroups[2]
  }
];

// ============= Mock Notifications =============

export const mockNotifications = [
  {
    id: "notif-1",
    user_id: "mock-user-1",
    title: "Novo evento criado",
    message: "Maria Santos criou o evento 'Festa Junina'",
    read: false,
    created_at: "2024-12-11T10:00:00Z",
    type: "event"
  },
  {
    id: "notif-2",
    user_id: "mock-user-1",
    title: "Confirmação de presença",
    message: "Pedro Costa confirmou presença no 'Churrasco de Fim de Semana'",
    read: false,
    created_at: "2024-12-10T15:30:00Z",
    type: "participation"
  },
  {
    id: "notif-3",
    user_id: "mock-user-1",
    title: "Lembrete",
    message: "O evento 'Churrasco de Fim de Semana' acontece em 3 dias!",
    read: true,
    created_at: "2024-12-09T09:00:00Z",
    type: "reminder"
  },
  {
    id: "notif-4",
    user_id: "mock-user-1",
    title: "Convite para grupo",
    message: "Você foi convidado para o grupo 'Fotógrafos SP'",
    read: false,
    created_at: "2024-12-08T14:00:00Z",
    type: "group"
  },
  {
    id: "notif-5",
    user_id: "mock-user-1",
    title: "Recusa de presença",
    message: "Lucas Mendes não poderá comparecer ao 'Churrasco de Fim de Semana'",
    read: true,
    created_at: "2024-12-07T11:00:00Z",
    type: "participation"
  }
];

// ============= Mock Comments =============

export const mockComments = [
  {
    id: "comment-1",
    content: "Mal posso esperar! Vou levar a sobremesa!",
    created_at: "2024-12-05T14:30:00Z",
    user_id: "mock-user-2",
    event_id: "event-1",
    profiles: mockProfiles[1]
  },
  {
    id: "comment-2",
    content: "Ótima ideia! Eu levo as bebidas.",
    created_at: "2024-12-05T15:00:00Z",
    user_id: "mock-user-3",
    event_id: "event-1",
    profiles: mockProfiles[2]
  },
  {
    id: "comment-3",
    content: "Vai ter música ao vivo?",
    created_at: "2024-12-06T10:00:00Z",
    user_id: "mock-user-4",
    event_id: "event-2",
    profiles: mockProfiles[3]
  },
  {
    id: "comment-4",
    content: "Que horas começa exatamente?",
    created_at: "2024-12-06T11:00:00Z",
    user_id: "mock-user-5",
    event_id: "event-2",
    profiles: mockProfiles[4]
  },
  {
    id: "comment-5",
    content: "Alguém pode me dar carona?",
    created_at: "2024-12-07T09:00:00Z",
    user_id: "mock-user-6",
    event_id: "event-4",
    profiles: mockProfiles[5]
  },
  {
    id: "comment-6",
    content: "Posso te buscar! Me manda mensagem.",
    created_at: "2024-12-07T09:30:00Z",
    user_id: "mock-user-1",
    event_id: "event-4",
    profiles: mockProfiles[0]
  }
];

// ============= Helper Functions =============

export const getEventById = (id: string) => {
  return mockEvents.find(event => event.id === id) || null;
};

export const getEventsByCreator = (creatorId: string) => {
  return mockEvents.filter(event => event.creator_id === creatorId);
};

export const getUserParticipatingEvents = (userId: string) => {
  return mockEvents.filter(event => 
    event.event_participants?.some(p => p.user_id === userId)
  );
};

export const getProfileById = (id: string) => {
  return mockProfiles.find(profile => profile.id === id) || null;
};

export const getEventGallery = (eventId: string) => {
  return mockGalleryImages[eventId] || [];
};

export const getGroupById = (id: string) => {
  return mockGroups.find(group => group.id === id) || null;
};

export const getUserGroups = (userId: string) => {
  return mockGroups.filter(group => 
    group.members?.some(m => m.user_id === userId)
  );
};

export const getPublicGroups = () => {
  return mockGroups.filter(group => group.type === "public");
};

export const getPendingGroupInvites = (userId: string) => {
  return mockGroupInvites.filter(invite => 
    invite.user_id === userId && invite.status === "pending"
  );
};

export const getEventComments = (eventId: string) => {
  return mockComments.filter(comment => comment.event_id === eventId);
};

export const getUserNotifications = (userId: string) => {
  return mockNotifications.filter(notif => notif.user_id === userId);
};
