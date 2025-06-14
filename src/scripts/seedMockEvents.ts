
import { supabase } from "@/integrations/supabase/client";

// AJUSTE: insira aqui o user.id do usuário que deve ser o criador dos eventos de mock!
const creator_id = "COLOQUE_O_USER_ID_DO_ADMIN_AQUI";

const now = new Date();
const makeDate = (daysOffset = 0, hour = 19, min = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, min, 0, 0);
  return date.toISOString();
};

const mockEvents = [
  {
    title: "Churrasco entre Amigos",
    description: "Venha curtir um bom churrasco na casa do João!",
    location: "Casa do João",
    address: "Rua das Laranjeiras, 80",
    date: makeDate(0, 18, 0), // hoje, 18h
    is_public: true,
    creator_id,
    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    estimated_budget: 400.0,
  },
  {
    title: "Jogo de Futebol",
    description: "Bora bater uma bola no parque!",
    location: "Parque Municipal",
    address: "Av. das Palmeiras, 200",
    date: makeDate(1, 10, 0), // amanhã, 10h
    is_public: true,
    creator_id,
    image_url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    estimated_budget: 0,
  },
  {
    title: "Noite do Cinema",
    description: "Sessão especial de cinema com pipoca liberada.",
    location: "CineFácil",
    address: "Av. Central, 500",
    date: makeDate(2, 20, 30), // 2 dias à frente, 20h30
    is_public: false,
    creator_id,
    image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    estimated_budget: 120.0,
  },
  {
    title: "Workshop de Tecnologia",
    description: "Aprenda novas tendências em tecnologia.",
    location: "Coworking Tech",
    address: "Rua da Inovação, 910",
    date: makeDate(3, 15, 0), // 3 dias à frente
    is_public: true,
    creator_id,
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    estimated_budget: 0,
  },
  {
    title: "Almoço em Família",
    description: "Almoço especial para toda a família.",
    location: "Restaurante da Vovó",
    address: "Rua dos Sabores, 100",
    date: makeDate(-1, 12, 0), // ontem, 12h (exemplo: evento passado)
    is_public: false,
    creator_id,
    image_url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    estimated_budget: 200.0,
  }
];

(async function run() {
  if (!creator_id || creator_id.includes("COLOQUE_O_USER_ID_DO_ADMIN_AQUI")) {
    console.error("Defina um user_id válido em creator_id antes de rodar este script.");
    return;
  }

  try {
    for (const event of mockEvents) {
      const { data, error } = await supabase
        .from('events')
        .insert([event]);
      if (error) {
        console.error("Erro ao criar evento", event.title, error);
      } else {
        console.log("Evento criado:", event.title, data);
      }
    }
    console.log("SEED COMPLETO!");
  } catch (err) {
    console.error("Erro geral ao popular eventos:", err);
  }
})();
