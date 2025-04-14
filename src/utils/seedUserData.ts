
import { supabase } from '@/integrations/supabase/client';

// Event names, descriptions and locations
const EVENT_NAMES = [
  "Aniversário do Carlos", "Happy Hour no Bar do Zé", "Festival de Música", 
  "Churrasco de Domingo", "Workshop de Fotografia", "Reunião de Trabalho", 
  "Feira de Vinhos", "Encontro de Desenvolvedores", "Show de Jazz", 
  "Jantar de Formatura", "Festa do Pijama", "Maratona de Filmes",
  "Aula de Culinária", "Trilha na Serra", "Noite de Jogos"
];

const EVENT_DESCRIPTIONS = [
  "Vamos celebrar mais um ano de vida!", 
  "Vamos nos encontrar para tomar umas e conversar!", 
  "O maior festival de música do ano, com várias atrações!",
  "Vamos fazer um churrasco para comemorar o fim do projeto!",
  "Aprenda técnicas avançadas com profissionais.",
  "Reunião para discutir o próximo trimestre.",
  "Degustação de vinhos de várias regiões do mundo.",
  "Meetup para discutir as últimas tendências em tecnologia.",
  "Uma noite de música com artistas locais.",
  "Celebração da formatura da turma de 2023."
];

const LOCATIONS = [
  "Bar do Zé, Rua Augusta, 1500",
  "Alameda Santos, 1000, Apto 42",
  "Parque Ibirapuera",
  "Av. Paulista, 1000, Área de Lazer",
  "Centro Cultural São Paulo",
  "Escritório Central, 12º andar",
  "Shopping JK Iguatemi",
  "WeWork Paulista",
  "Blue Note São Paulo",
  "Restaurante Fasano",
  "Casa da Marina, Rua dos Pinheiros, 750",
  "Parque Villa-Lobos",
  "Teatro Municipal"
];

const GROUP_NAMES = [
  "Amigos da Faculdade", "Time de Futebol", "Clube do Livro", 
  "Equipe de Trabalho", "Viagens e Aventuras", "Chefs Amadores", 
  "Gamers Unite", "Maratonistas", "Cinéfilos", 
  "Yoga e Meditação", "Dev Squad", "Turma do Colégio"
];

const GROUP_DESCRIPTIONS = [
  "Grupo dos amigos da faculdade para organizar encontros.",
  "Grupo para organizar partidas de futebol aos finais de semana.",
  "Discussões mensais sobre livros selecionados.",
  "Grupo da equipe de desenvolvimento de projetos.",
  "Planejamento de viagens e experiências ao ar livre.",
  "Compartilhando receitas e experiências culinárias.",
  "Grupo para jogar online e discutir novos jogos.",
  "Treinamento para corridas e maratonas.",
  "Discussões sobre filmes e séries.",
  "Compartilhando práticas de bem-estar e mindfulness."
];

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3"
];

const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const getRandomFutureDate = (): Date => {
  const now = new Date();
  const daysToAdd = Math.floor(Math.random() * 30) + 1;
  const result = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  
  result.setHours(Math.floor(Math.random() * 12) + 8); // Between 8 AM and 8 PM
  result.setMinutes(Math.floor(Math.random() * 4) * 15); // 0, 15, 30, or 45 mins
  
  return result;
};

// Define explicit types for the result of seedUserData
interface SeedUserDataResult {
  success: boolean;
  eventIds?: string[];
  groupIds?: string[];
  eventCount?: number;
  groupCount?: number;
  notificationCount?: number;
  error?: any;
}

export const seedUserData = async (userId: string): Promise<SeedUserDataResult> => {
  try {
    const eventIds: string[] = [];
    const eventCount = Math.floor(Math.random() * 6) + 5; // 5-10 events
    
    for (let i = 0; i < eventCount; i++) {
      const isPublic = Math.random() > 0.5;
      const eventDate = getRandomFutureDate();
      
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          title: getRandomItem(EVENT_NAMES),
          description: getRandomItem(EVENT_DESCRIPTIONS),
          date: eventDate.toISOString(),
          location: getRandomItem(LOCATIONS),
          is_public: isPublic,
          image_url: getRandomItem(IMAGE_URLS),
          creator_id: userId
        })
        .select();
        
      if (eventError) {
        console.error("Error creating event:", eventError);
        continue;
      }
      
      if (eventData && eventData.length > 0) {
        eventIds.push(eventData[0].id);
        
        await supabase
          .from('event_participants')
          .insert({
            event_id: eventData[0].id,
            user_id: userId,
            status: 'confirmed'
          });
      }
    }
    
    const groupIds: string[] = [];
    const groupCount = Math.floor(Math.random() * 4) + 3; // 3-6 groups
    
    for (let i = 0; i < groupCount; i++) {
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: getRandomItem(GROUP_NAMES),
          description: getRandomItem(GROUP_DESCRIPTIONS),
          image_url: getRandomItem(IMAGE_URLS)
        })
        .select();
        
      if (groupError) {
        console.error("Error creating group:", groupError);
        continue;
      }
      
      if (groupData && groupData.length > 0) {
        const groupId = groupData[0].id;
        groupIds.push(groupId);
        
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            user_id: userId,
            is_admin: true
          });
          
        if (memberError) {
          console.error("Error adding group member:", memberError);
        }
          
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
    
    const notificationTitles = [
      "Novo evento criado!",
      "Convite para grupo",
      "Convite para evento",
      "Mudança de local",
      "Confirmação pendente",
      "Lembrete de evento"
    ];
    
    const notificationContents = [
      "Um novo evento foi criado: Happy Hour no Bar do Zé",
      "Você foi convidado para o grupo Amigos da Faculdade",
      "Você foi convidado para o evento Aniversário do Carlos",
      "O local do evento Festival de Música foi alterado",
      "Por favor, confirme sua presença no evento Churrasco de Domingo",
      "Seu evento Workshop de Fotografia acontecerá em breve"
    ];
    
    const notifCount = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < notifCount; i++) {
      const index = i % notificationTitles.length;
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: ["info", "event_invite", "group_invite", "event_update", "location_change", "confirmation"][i % 6],
          title: notificationTitles[index],
          content: notificationContents[index],
          related_id: eventIds.length > i ? eventIds[i] : null,
          is_read: Math.random() > 0.7
        });
    }
    
    return {
      eventIds,
      groupIds,
      eventCount,
      groupCount,
      notificationCount: notifCount,
      success: true
    };
  } catch (error) {
    console.error("Error seeding user data:", error);
    return {
      success: false,
      error
    };
  }
};

// Explicitly define the return type for seedDataForEmail
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }
    
    if (profileData && profileData.id) {
      const result = await seedUserData(profileData.id);
      return result;
    }
    
    // If we can't find the user in the profiles table, check the session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData && sessionData.session && sessionData.session.user && 
        sessionData.session.user.email === email) {
      const result = await seedUserData(sessionData.session.user.id);
      return result;
    }
    
    // If we still can't find the user, return an error
    return {
      success: false,
      error: `Could not find user with email ${email}`
    };
  } catch (error: any) {
    console.error("Error seeding data for email:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  seedUserData,
  seedDataForEmail
};
