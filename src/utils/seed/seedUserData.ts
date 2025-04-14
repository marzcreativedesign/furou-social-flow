
// Tipagem explícita para os resultados das consultas
interface ProfileQueryResult {
  data: { id: string }[] | null;
  error: any;
}

// Função para semear dados do usuário com base no email
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    const { data, error: queryError }: ProfileQueryResult = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);

    if (queryError) {
      console.error('Error querying profile by email:', queryError);
      return {
        success: false,
        error: queryError.message,
      };
    }

    if (data && data.length > 0) {
      return await seedUserData(data[0].id);
    }

    // Verificação de sessão atual
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;

    if (currentUser && currentUser.email === email) {
      return await seedUserData(currentUser.id);
    }

    return {
      success: false,
      error: `Could not find user with email ${email}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error seeding data for email:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Import supabase client and types
import { supabase } from '@/integrations/supabase/client';
import { SeedUserDataResult, NotificationTemplate } from './types';
import { getRandomItem, getRandomFutureDate, createEvent, createGroup, createNotification } from './helpers';

// Função principal para semear dados do usuário
export const seedUserData = async (userId: string): Promise<SeedUserDataResult> => {
  try {
    const eventIds: string[] = [];
    const groupIds: string[] = [];
    
    // Criar eventos
    const eventCount = Math.floor(Math.random() * 5) + 2; // 2-6 eventos
    for (let i = 0; i < eventCount; i++) {
      const event = await createEvent(userId);
      if (event) {
        eventIds.push(event.id);
      }
    }
    
    // Criar grupos e associá-los aos eventos aleatoriamente
    const groupCount = Math.floor(Math.random() * 3) + 1; // 1-3 grupos
    for (let i = 0; i < groupCount; i++) {
      const eventId = eventIds.length > 0 ? getRandomItem(eventIds) : undefined;
      const groupId = await createGroup(userId, eventId);
      if (groupId) {
        groupIds.push(groupId);
      }
    }
    
    // Criar notificações
    const notificationCount = Math.floor(Math.random() * 8) + 3; // 3-10 notificações
    for (let i = 0; i < notificationCount; i++) {
      const relatedId = Math.random() > 0.5 && eventIds.length > 0 
        ? getRandomItem(eventIds) 
        : null;
        
      await createNotification(userId, i, relatedId);
    }
    
    return {
      success: true,
      eventIds,
      groupIds,
      eventCount: eventIds.length,
      groupCount: groupIds.length,
      notificationCount
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error seeding data:", errorMessage);
    return {
      success: false,
      error: errorMessage
    };
  }
};
