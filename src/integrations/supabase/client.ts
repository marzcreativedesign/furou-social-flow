
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vktfksgurakdwajvnulk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdGZrc2d1cmFrZHdhanZudWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzUwNzMsImV4cCI6MjA2MDA1MTA3M30.uPljeQ8MlEhPCgthvSl8ReEYFy-HX1PX9aj4ER_H4rA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Check if we're in development mode to provide mock data
const IS_DEV = process.env.NODE_ENV === 'development' || !SUPABASE_URL;

// Mock data provider function for development
export const getMockData = (collectionName: string) => {
  // In a production environment, we wouldn't have this mock data
  if (!IS_DEV) {
    return null;
  }

  // Return mock data based on the collection name
  switch (collectionName) {
    case 'events':
      return MOCK_EVENTS;
    case 'upcoming_events':
      return MOCK_UPCOMING_EVENTS;
    case 'pending_actions':
      return MOCK_PENDING_ACTIONS;
    default:
      return null;
  }
};

// Mock data for the application
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Happy Hour no Bar do Zé",
    date: "Hoje, 19:00",
    location: "Bar do Zé",
    imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 8,
    confirmed: true,
    type: "public",
    groupName: null
  },
  {
    id: "2",
    title: "Aniversário da Marina",
    date: "Amanhã, 20:00",
    location: "Alameda Santos, 1000",
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 15,
    confirmed: false,
    type: "private",
    groupName: null
  },
  {
    id: "3",
    title: "Churrasco de Domingo",
    date: "Domingo, 12:00",
    location: "Av. Paulista, 1000",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 12,
    confirmed: true,
    type: "group",
    groupName: "Amigos da Faculdade"
  },
  {
    id: "10",
    title: "Noite de Jogos",
    date: "Sábado, 18:00",
    location: "Rua Augusta, 500",
    imageUrl: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 6,
    confirmed: true,
    type: "private",
    groupName: null
  },
  {
    id: "11",
    title: "Trilha no Pico do Jaraguá",
    date: "Domingo, 07:00",
    location: "Pico do Jaraguá",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 10,
    confirmed: false,
    type: "group",
    groupName: "Aventureiros SP"
  }
];

const MOCK_UPCOMING_EVENTS = [
  {
    id: "4",
    title: "Festival de Música",
    date: "Próx. Sábado, 16:00",
    location: "Parque Ibirapuera",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 50,
    confirmed: true,
    type: "public",
    groupName: null
  },
  {
    id: "5",
    title: "Exposição de Arte",
    date: "Próx. Sábado, 10:00",
    location: "MASP",
    imageUrl: "https://images.unsplash.com/photo-1605429523419-d828acb941d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    attendees: 30,
    confirmed: false,
    type: "public",
    groupName: null
  },
  {
    id: "6",
    title: "Show de Stand-up",
    date: "Sexta-feira, 21:00",
    location: "Comedy Club",
    imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    attendees: 80,
    confirmed: true,
    type: "public",
    groupName: null
  },
  {
    id: "7",
    title: "Food Truck Festival",
    date: "Domingo, 12:00",
    location: "Memorial da América Latina",
    imageUrl: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    attendees: 120,
    confirmed: false,
    type: "public",
    groupName: null
  },
  {
    id: "8",
    title: "Feira de Vinil",
    date: "Sábado, 10:00",
    location: "Centro Cultural",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca91d0e92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 45,
    confirmed: true,
    type: "public",
    groupName: null
  },
  {
    id: "9",
    title: "Workshop de Fotografia",
    date: "Terça-feira, 18:30",
    location: "Estúdio Central",
    imageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    attendees: 15,
    confirmed: false,
    type: "public",
    groupName: null
  }
];

const MOCK_PENDING_ACTIONS = [
  {
    id: "1",
    title: "Confirmação de presença",
    eventName: "Happy Hour no Bar do Zé",
    date: "Hoje, 19:00",
    imageUrl: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    type: "confirmation"
  },
  {
    id: "2",
    title: "Convite para grupo",
    eventName: "Amigos do Colégio",
    date: "Novo grupo",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80",
    type: "group_invite"
  },
  {
    id: "3",
    title: "Convite para evento",
    eventName: "Aniversário do João",
    date: "Próximo sábado, 20:00",
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    type: "event_invite"
  },
  {
    id: "4",
    title: "Mudança de local",
    eventName: "Festival de Música",
    date: "Local atualizado",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    type: "location_change"
  }
];
