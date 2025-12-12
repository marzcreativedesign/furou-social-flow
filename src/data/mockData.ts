import { Event } from '@/types/event';

// Mock user for simulation
export const mockUser = {
  id: 'mock-user-123',
  email: 'usuario@demo.com',
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  user_metadata: {
    full_name: 'Usuário Demo'
  }
};

export const mockProfile = {
  id: 'mock-user-123',
  full_name: 'Usuário Demo',
  username: 'demo_user',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  bio: 'Entusiasta de eventos e encontros sociais',
  interests: ['música', 'tecnologia', 'esportes'],
  created_at: new Date().toISOString()
};

// Helper to get dates relative to today
const getDate = (daysFromNow: number, hour: number = 19): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const mockEvents: Event[] = [
  {
    id: 'evt-001',
    title: 'Festival de Jazz ao Ar Livre',
    description: 'Uma noite mágica de jazz com artistas locais e internacionais. Traga sua cadeira de praia e aproveite a música sob as estrelas.',
    date: getDate(2, 18),
    location: 'Parque Ibirapuera',
    address: 'Av. Pedro Álvares Cabral, s/n - Vila Mariana, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
    estimated_budget: 150,
    creator_id: 'mock-user-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'mock-user-123',
      full_name: 'Maria Santos',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      username: 'maria_santos'
    },
    event_participants: [
      { id: 'p1', user_id: 'u1', event_id: 'evt-001', status: 'confirmed' },
      { id: 'p2', user_id: 'u2', event_id: 'evt-001', status: 'confirmed' },
      { id: 'p3', user_id: 'u3', event_id: 'evt-001', status: 'pending' }
    ],
    attendees: 45
  },
  {
    id: 'evt-002',
    title: 'Hackathon Tech Weekend',
    description: 'Dois dias de programação intensa, networking e muita pizza! Venha criar soluções inovadoras com desenvolvedores de toda a cidade.',
    date: getDate(5, 9),
    location: 'Google Campus',
    address: 'Rua Coronel Oscar Porto, 70 - Paraíso, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    estimated_budget: 0,
    creator_id: 'user-456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-456',
      full_name: 'Carlos Dev',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      username: 'carlos_dev'
    },
    event_participants: [
      { id: 'p4', user_id: 'u4', event_id: 'evt-002', status: 'confirmed' },
      { id: 'p5', user_id: 'u5', event_id: 'evt-002', status: 'confirmed' }
    ],
    attendees: 120
  },
  {
    id: 'evt-003',
    title: 'Aula de Yoga no Parque',
    description: 'Comece o dia com energia positiva! Aula aberta para todos os níveis, do iniciante ao avançado.',
    date: getDate(1, 7),
    location: 'Parque Villa-Lobos',
    address: 'Av. Prof. Fonseca Rodrigues, 2001 - Alto de Pinheiros, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    estimated_budget: 30,
    creator_id: 'user-789',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-789',
      full_name: 'Ana Wellness',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      username: 'ana_wellness'
    },
    event_participants: [],
    attendees: 25
  },
  {
    id: 'evt-004',
    title: 'Churras de Fim de Semana',
    description: 'Churrasco entre amigos! Cada um traz uma carne ou acompanhamento. Bebidas por conta própria.',
    date: getDate(3, 12),
    location: 'Casa do João',
    address: 'Rua dos Amigos, 123 - Moema, São Paulo - SP',
    is_public: false,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    estimated_budget: 80,
    creator_id: 'mock-user-123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'mock-user-123',
      full_name: 'Usuário Demo',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      username: 'demo_user'
    },
    event_participants: [
      { id: 'p6', user_id: 'mock-user-123', event_id: 'evt-004', status: 'confirmed' }
    ],
    attendees: 15
  },
  {
    id: 'evt-005',
    title: 'Feira de Startups',
    description: 'Conheça as startups mais promissoras da região. Palestras, networking e oportunidades de investimento.',
    date: getDate(7, 10),
    location: 'Centro de Convenções',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    estimated_budget: 50,
    creator_id: 'user-startup',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-startup',
      full_name: 'Startup Hub',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=startup',
      username: 'startup_hub'
    },
    event_participants: [],
    attendees: 300
  },
  {
    id: 'evt-006',
    title: 'Noite de Board Games',
    description: 'Traga seu jogo favorito ou experimente novos! Temos Catan, Ticket to Ride, Azul e muito mais.',
    date: getDate(0, 19),
    location: 'Luderia Games',
    address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800',
    estimated_budget: 25,
    creator_id: 'user-games',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-games',
      full_name: 'Pedro Gamer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      username: 'pedro_gamer'
    },
    event_participants: [
      { id: 'p7', user_id: 'mock-user-123', event_id: 'evt-006', status: 'confirmed' }
    ],
    attendees: 12
  },
  {
    id: 'evt-007',
    title: 'Workshop de Fotografia',
    description: 'Aprenda técnicas de fotografia urbana com profissionais. Traga sua câmera ou celular!',
    date: getDate(-2, 14),
    location: 'Centro Histórico',
    address: 'Praça da Sé, s/n - Sé, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    estimated_budget: 100,
    creator_id: 'user-foto',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-foto',
      full_name: 'Foto Club SP',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foto',
      username: 'foto_club'
    },
    event_participants: [],
    attendees: 20
  },
  {
    id: 'evt-008',
    title: 'Corrida Matinal 5K',
    description: 'Corrida em grupo todas as manhãs de sábado. Todos os níveis são bem-vindos!',
    date: getDate(-1, 6),
    location: 'Parque do Povo',
    address: 'Av. Henrique Chamma, 420 - Itaim Bibi, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    estimated_budget: 0,
    creator_id: 'user-run',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-run',
      full_name: 'Running Club',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=run',
      username: 'running_club'
    },
    event_participants: [],
    attendees: 50
  },
  {
    id: 'evt-009',
    title: 'Festa Junina Beneficente',
    description: 'Comidas típicas, quadrilha, pescaria e muita diversão! Renda revertida para instituição de caridade.',
    date: getDate(10, 16),
    location: 'Escola Municipal',
    address: 'Rua das Flores, 200 - Pinheiros, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    estimated_budget: 40,
    creator_id: 'user-festa',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-festa',
      full_name: 'Comunidade Unida',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comunidade',
      username: 'comunidade_unida'
    },
    event_participants: [],
    attendees: 200
  },
  {
    id: 'evt-010',
    title: 'Cinema ao Ar Livre',
    description: 'Sessão especial de filmes clássicos sob as estrelas. Pipoca grátis!',
    date: getDate(4, 20),
    location: 'Praça do Por do Sol',
    address: 'Rua Desembargador Ferreira França - Alto de Pinheiros, São Paulo - SP',
    is_public: true,
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    estimated_budget: 20,
    creator_id: 'user-cinema',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profiles: {
      id: 'user-cinema',
      full_name: 'Cine Club',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cinema',
      username: 'cine_club'
    },
    event_participants: [],
    attendees: 80
  }
];

// Get events for specific date (for agenda)
export const getEventsForDate = (date: Date): Event[] => {
  return mockEvents.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};

// Get upcoming events
export const getUpcomingEvents = (): Event[] => {
  const now = new Date();
  return mockEvents
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Get past events
export const getPastEvents = (): Event[] => {
  const now = new Date();
  return mockEvents
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get public events
export const getPublicEvents = (): Event[] => {
  return mockEvents.filter(event => event.is_public);
};

// Get event by ID
export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};
