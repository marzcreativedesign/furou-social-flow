
import { supabase } from "@/integrations/supabase/client";

const sampleEvents = [
  {
    title: "Churrasco de Domingo",
    description: "Churrasco com a família e amigos",
    date: "2024-05-05T14:00:00",
    location: "Casa do João",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=987&ixlib=rb-4.0.3",
  },
  {
    title: "Festa Junina",
    description: "Tradicional festa junina com comidas típicas e música ao vivo",
    date: "2024-06-15T18:00:00",
    location: "Praça Central",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
  },
  {
    title: "Workshop de Fotografia",
    description: "Aprenda técnicas básicas de fotografia",
    date: "2024-05-20T09:00:00",
    location: "Studio Foto & Arte",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3",
  },
  {
    title: "Piquenique no Parque",
    description: "Encontro ao ar livre com jogos e atividades",
    date: "2024-06-02T10:00:00",
    location: "Parque Municipal",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
  },
];

export const createSampleEvents = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  for (const event of sampleEvents) {
    await supabase
      .from('events')
      .insert({
        ...event,
        creator_id: userData.user.id
      });
  }
};
