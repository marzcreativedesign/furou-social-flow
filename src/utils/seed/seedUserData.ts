
import { supabase } from '@/integrations/supabase/client';
import { createEvent, createGroup, createNotification } from './helpers';
import type { SeedUserDataResult } from './types';

// Função para criar eventos
const createEvents = async (userId: string): Promise<string[]> => {
  const eventIds: string[] = [];
  const eventCount = Math.floor(Math.random() * 6) + 5; // 5-10 events

  const eventPromises = Array.from({ length: eventCount }, async () => {
    const event = await createEvent(userId);
    return event?.id;
  });

  const events = await Promise.all(eventPromises);
  events.filter(Boolean).forEach(id => id && eventIds.push(id)); // Adiciona os IDs válidos

  return eventIds;
};

// Função para criar grupos
const createGroups = async (userId: string, eventIds: string[]): Promise<string[]> => {
  const groupIds: string[] = [];
  const groupCount = Math.floor(Math.random() * 4) + 3; // 3-6 groups

  const groupPromises = Array.from({ length: groupCount }, async () => {
    const randomEventId = eventIds.length > 0 ? eventIds[Math.floor(Math.random() * eventIds.length)] : undefined;
    return await createGroup(userId, randomEventId);
  });

  const groups = await Promise.all(groupPromises);
  groups.filter(Boolean).forEach(id => id && groupIds.push(id)); // Adiciona os IDs válidos

  return groupIds;
};

// Função para criar notificações
const createNotifications = async (userId: string, eventIds: string[]): Promise<void> => {
  const notifCount = Math.floor(Math.random() * 4) + 5; // 5-8 notifications

  const notificationPromises = Array.from({ length: notifCount }, async (_, index) => {
    await createNotification(userId, index, eventIds[index] ?? null); // Verifica se o ID do evento existe
  });

  await Promise.all(notificationPromises);
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

// Interface explícita para dados do perfil para evitar problemas de tipagem
interface ProfileData {
  id: string;
}

// Função para semear dados com base no email
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    // Usando uma abordagem sem RPC para evitar problemas de tipagem
    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (queryError) {
      console.error('Error querying profile by email:', queryError);
      return {
        success: false,
        error: queryError.message,
      };
    }

    // Se encontrou o perfil, usa esse ID
    if (data) {
      return await seedUserData(data.id);
    }

    // Tenta obter a sessão atual
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;

    // Se temos um usuário válido com email correspondente
    if (currentUser && currentUser.email === email) {
      return await seedUserData(currentUser.id);
    }

    // Se não encontrou usuário correspondente
    return {
      success: false,
      error: `Could not find user with email ${email}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in seedDataForEmail:', errorMessage);
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
