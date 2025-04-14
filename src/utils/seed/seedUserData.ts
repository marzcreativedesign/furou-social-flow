
import { supabase } from '@/integrations/supabase/client';
import { createEvent, createGroup, createNotification } from './helpers';
import type { SeedUserDataResult } from './types';

// Função para criar eventos
const createEvents = async (userId: string): Promise<string[]> => {
  const eventIds: string[] = [];
  const eventCount = Math.floor(Math.random() * 6) + 5; // 5-10 events

  for (let i = 0; i < eventCount; i++) {
    const event = await createEvent(userId);
    if (event && event.id) {
      eventIds.push(event.id);
    }
  }

  return eventIds;
};

// Função para criar grupos
const createGroups = async (userId: string, eventIds: string[]): Promise<string[]> => {
  const groupIds: string[] = [];
  const groupCount = Math.floor(Math.random() * 4) + 3; // 3-6 groups

  for (let i = 0; i < groupCount; i++) {
    const randomEventId = eventIds.length > 0 ? eventIds[Math.floor(Math.random() * eventIds.length)] : undefined;

    const groupId = await createGroup(userId, randomEventId);
    if (groupId) {
      groupIds.push(groupId);
    }
  }

  return groupIds;
};

// Função para criar notificações
const createNotifications = async (userId: string, eventIds: string[]): Promise<void> => {
  const notifCount = Math.floor(Math.random() * 4) + 5; // 5-8 notifications

  for (let i = 0; i < notifCount; i++) {
    await createNotification(userId, i, eventIds.length > i ? eventIds[i] : null);
  }
};

// Função principal para semear os dados
export const seedUserData = async (userId: string): Promise<SeedUserDataResult> => {
  try {
    // Criar eventos
    const eventIds = await createEvents(userId);

    // Criar grupos
    const groupIds = await createGroups(userId, eventIds);

    // Criar notificações
    await createNotifications(userId, eventIds);

    return {
      success: true,
      eventIds,
      groupIds,
      eventCount: eventIds.length,
      groupCount: groupIds.length,
      notificationCount: eventIds.length, // Total de notificações criadas
    };
  } catch (error) {
    console.error('Error seeding user data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Função para semear dados com base no email
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    // Primeiro, tentar encontrar o perfil pelo email
    const { data: profile, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      return {
        success: false,
        error: userError.message,
      };
    }

    // Se encontrou o perfil, use o ID do perfil
    if (profile && profile.id) {
      return await seedUserData(profile.id);
    }

    // Se não encontrou no perfil, tente usar a sessão atual
    const { data: sessionData } = await supabase.auth.getSession();
    
    // Verificar se sessionData e suas propriedades existem antes de acessar
    if (sessionData && 
        sessionData.session && 
        sessionData.session.user &&
        sessionData.session.user.email === email && 
        sessionData.session.user.id) {
      return await seedUserData(sessionData.session.user.id);
    }

    // Se o usuário ainda não for encontrado
    return {
      success: false,
      error: `Could not find user with email ${email}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export default {
  seedUserData,
  seedDataForEmail,
};
