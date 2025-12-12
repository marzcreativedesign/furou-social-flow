
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
  }
];

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
      { id: "p3", user_id: "mock-user-3", event_id: "event-1", status: "pending", profiles: mockProfiles[2] }
    ],
    attendees: 3
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
      { id: "p4", user_id: "mock-user-2", event_id: "event-2", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p5", user_id: "mock-user-1", event_id: "event-2", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p6", user_id: "mock-user-4", event_id: "event-2", status: "confirmed", profiles: mockProfiles[3] }
    ],
    attendees: 3
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
    creator_id: "mock-user-3",
    created_at: "2024-11-20T10:00:00Z",
    updated_at: "2024-11-20T10:00:00Z",
    profiles: mockProfiles[2],
    event_participants: [
      { id: "p7", user_id: "mock-user-3", event_id: "event-3", status: "confirmed", profiles: mockProfiles[2] },
      { id: "p8", user_id: "mock-user-1", event_id: "event-3", status: "pending", profiles: mockProfiles[0] }
    ],
    attendees: 2
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
      { id: "p9", user_id: "mock-user-4", event_id: "event-4", status: "confirmed", profiles: mockProfiles[3] },
      { id: "p10", user_id: "mock-user-2", event_id: "event-4", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p11", user_id: "mock-user-1", event_id: "event-4", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p12", user_id: "mock-user-3", event_id: "event-4", status: "pending", profiles: mockProfiles[2] }
    ],
    attendees: 4
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
      { id: "p13", user_id: "mock-user-1", event_id: "event-5", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p14", user_id: "mock-user-2", event_id: "event-5", status: "confirmed", profiles: mockProfiles[1] }
    ],
    attendees: 2
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
      { id: "p15", user_id: "mock-user-2", event_id: "event-6", status: "confirmed", profiles: mockProfiles[1] },
      { id: "p16", user_id: "mock-user-1", event_id: "event-6", status: "confirmed", profiles: mockProfiles[0] },
      { id: "p17", user_id: "mock-user-3", event_id: "event-6", status: "confirmed", profiles: mockProfiles[2] },
      { id: "p18", user_id: "mock-user-4", event_id: "event-6", status: "pending", profiles: mockProfiles[3] }
    ],
    attendees: 4
  }
];

export const mockNotifications = [
  {
    id: "notif-1",
    user_id: "mock-user-1",
    title: "Novo evento criado",
    message: "Maria Santos criou o evento 'Festa Junina'",
    read: false,
    created_at: "2024-12-11T10:00:00Z"
  },
  {
    id: "notif-2",
    user_id: "mock-user-1",
    title: "Confirmação de presença",
    message: "Pedro Costa confirmou presença no seu evento 'Churrasco de Fim de Semana'",
    read: false,
    created_at: "2024-12-10T15:30:00Z"
  },
  {
    id: "notif-3",
    user_id: "mock-user-1",
    title: "Lembrete",
    message: "O evento 'Churrasco de Fim de Semana' acontece em 3 dias!",
    read: true,
    created_at: "2024-12-09T09:00:00Z"
  }
];

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
  }
];

// Helper function to get event by ID
export const getEventById = (id: string) => {
  return mockEvents.find(event => event.id === id) || null;
};

// Helper function to get events by creator
export const getEventsByCreator = (creatorId: string) => {
  return mockEvents.filter(event => event.creator_id === creatorId);
};

// Helper function to get user's participating events
export const getUserParticipatingEvents = (userId: string) => {
  return mockEvents.filter(event => 
    event.event_participants?.some(p => p.user_id === userId)
  );
};

// Helper function to get profile by ID
export const getProfileById = (id: string) => {
  return mockProfiles.find(profile => profile.id === id) || null;
};
