import { supabase } from '@/integrations/supabase/client';

// Test user data
const TEST_USER_EMAIL = 'teste@furou.com';

// Mock event data
const MOCK_EVENTS = [
  {
    title: "Happy Hour no Bar do Zé",
    description: "Vamos nos encontrar para tomar umas e conversar!",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
    location: "Bar do Zé, Rua Augusta, 1500",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3"
  },
  {
    title: "Aniversário do Carlos",
    description: "Festa surpresa para o Carlos! Não comentem nada com ele.",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week from now
    location: "Alameda Santos, 1000, Apto 42",
    is_public: false,
    image_url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3"
  },
  {
    title: "Festival de Música",
    description: "O maior festival de música do ano, com várias atrações!",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks from now
    location: "Parque Ibirapuera",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3"
  },
  {
    title: "Churrasco de Domingo",
    description: "Vamos fazer um churrasco para comemorar o fim do projeto!",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    location: "Av. Paulista, 1000, Área de Lazer",
    is_public: false,
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3"
  },
  {
    title: "Workshop de Fotografia",
    description: "Aprenda técnicas avançadas de fotografia com profissionais.",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
    location: "Centro Cultural São Paulo",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3"
  },
  {
    title: "Reunião de Trabalho",
    description: "Reunião para discutir o próximo trimestre.",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day from now
    location: "Escritório Central, 12º andar",
    is_public: false,
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3"
  },
  {
    title: "Feira de Vinhos",
    description: "Degustação de vinhos de várias regiões do mundo.",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    location: "Shopping JK Iguatemi",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3"
  },
  {
    title: "Encontro de Desenvolvedores",
    description: "Meetup para discutir as últimas tendências em tecnologia.",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days from now
    location: "WeWork Paulista",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3"
  },
  {
    title: "Show de Jazz",
    description: "Uma noite de música jazz com artistas locais.",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days from now
    location: "Blue Note São Paulo",
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3"
  },
  {
    title: "Jantar de Formatura",
    description: "Celebração da formatura da turma de 2023.",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days from now
    location: "Restaurante Fasano",
    is_public: false,
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3"
  }
];

// Mock group data
const MOCK_GROUPS = [
  {
    name: "Amigos da Faculdade",
    description: "Grupo dos amigos da faculdade para organizar encontros.",
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3"
  },
  {
    name: "Time de Futebol",
    description: "Grupo para organizar partidas de futebol aos finais de semana.",
    image_url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3"
  },
  {
    name: "Clube do Livro",
    description: "Discussões mensais sobre livros selecionados.",
    image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3"
  },
  {
    name: "Equipe de Trabalho",
    description: "Grupo da equipe de desenvolvimento de projetos.",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3"
  },
  {
    name: "Viagens e Aventuras",
    description: "Planejamento de viagens e experiências ao ar livre.",
    image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3"
  },
  {
    name: "Chefs Amadores",
    description: "Compartilhando receitas e experiências culinárias.",
    image_url: "https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?ixlib=rb-4.0.3"
  },
  {
    name: "Gamers Unite",
    description: "Grupo para jogar online e discutir novos jogos.",
    image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3"
  },
  {
    name: "Maratonistas",
    description: "Treinamento para corridas e maratonas.",
    image_url: "https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3"
  },
  {
    name: "Cinéfilos",
    description: "Discussões sobre filmes e séries.",
    image_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3"
  },
  {
    name: "Yoga e Meditação",
    description: "Compartilhando práticas de bem-estar e mindfulness.",
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3"
  }
];

// Mock notification types
const NOTIFICATION_TYPES = ['info', 'event_invite', 'group_invite', 'event_update', 'location_change', 'confirmation'];

// Function to seed data for the test user
export const seedTestUserData = async () => {
  try {
    // Get test user
    const { data, error: userError } = await supabase.auth.getUser();
    
    if (userError || !data.user) {
      console.error("Error fetching user:", userError);
      return { success: false, error: userError || new Error("User not found") };
    }
    
    const userId = data.user.id;
    
    // Seed events
    const eventIds = [];
    for (const eventData of MOCK_EVENTS) {
      const { data: eventResponse, error: eventError } = await supabase
        .from('events')
        .insert({
          ...eventData,
          creator_id: userId
        })
        .select();
        
      if (eventError) {
        console.error("Error creating event:", eventError);
        continue;
      }
      
      if (eventResponse && eventResponse.length > 0) {
        eventIds.push(eventResponse[0].id);
        
        // Add some participants to each event
        await supabase
          .from('event_participants')
          .insert({
            event_id: eventResponse[0].id,
            user_id: userId,
            status: 'confirmed'
          });
      }
    }
    
    // Seed groups
    const groupIds = [];
    for (const groupData of MOCK_GROUPS) {
      const { data: groupResponse, error: groupError } = await supabase
        .from('groups')
        .insert(groupData)
        .select();
        
      if (groupError) {
        console.error("Error creating group:", groupError);
        continue;
      }
      
      if (groupResponse && groupResponse.length > 0) {
        const groupId = groupResponse[0].id;
        groupIds.push(groupId);
        
        // Add test user as member of the group
        await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            user_id: userId,
            is_admin: true
          });
          
        // Associate a random event with this group
        if (eventIds.length > 0) {
          const randomEventId = eventIds[Math.floor(Math.random() * eventIds.length)];
          await supabase
            .from('group_events')
            .insert({
              group_id: groupId,
              event_id: randomEventId
            });
        }
      }
    }
    
    // Seed notifications (10 different notifications)
    const notificationTitles = [
      "Novo evento criado!",
      "Convite para grupo",
      "Convite para evento",
      "Mudança de local",
      "Confirmação pendente",
      "Lembrete de evento",
      "Aniversário próximo",
      "Atualização de evento",
      "Convite para festa",
      "Nova mensagem recebida"
    ];
    
    const notificationContents = [
      "Um novo evento foi criado: Happy Hour no Bar do Zé",
      "Você foi convidado para o grupo Amigos da Faculdade",
      "Você foi convidado para o evento Aniversário do Carlos",
      "O local do evento Festival de Música foi alterado",
      "Por favor, confirme sua presença no evento Churrasco de Domingo",
      "Seu evento Workshop de Fotografia acontecerá em breve",
      "O aniversário de um amigo está chegando!",
      "O evento Reunião de Trabalho foi atualizado",
      "Você foi convidado para a Feira de Vinhos",
      "Você recebeu uma nova mensagem no grupo Equipe de Trabalho"
    ];
    
    for (let i = 0; i < 10; i++) {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: NOTIFICATION_TYPES[i % NOTIFICATION_TYPES.length],
          title: notificationTitles[i],
          content: notificationContents[i],
          related_id: i < eventIds.length ? eventIds[i] : null,
          is_read: Math.random() > 0.7 // About 30% read, 70% unread
        });
    }
    
    return {
      eventIds,
      groupIds,
      success: true
    };
  } catch (error) {
    console.error("Error seeding test user data:", error);
    return {
      success: false,
      error
    };
  }
};

// Default export for easier importing
export default { seedTestUserData };
