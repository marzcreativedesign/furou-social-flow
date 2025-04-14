import { supabase } from '@/integrations/supabase/client';
import { createEvent, createGroup, createNotification } from './helpers';
import type { SeedUserDataResult } from './types';

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

const createGroups = async (userId: string, eventIds: string[]): Promise<string[]> => {
  const groupIds: string[] = [];
  const groupCount = Math.floor(Math.random() * 4) + 3; // 3-6 groups
  
  for (let i = 0; i < groupCount; i++) {
    const randomEventId = eventIds.length > 0 ? 
      eventIds[Math.floor(Math.random() * eventIds.length)] : 
      undefined;
    
    const groupId = await createGroup(userId, randomEventId);
    if (groupId) {
      groupIds.push(groupId);
    }
  }
  return groupIds;
};

const createNotifications = async (userId: string, eventIds: string[]): Promise<void> => {
  const notifCount = Math.floor(Math.random() * 4) + 5; // 5-8 notifications
  
  for (let i = 0; i < notifCount; i++) {
    await createNotification(userId, i, eventIds.length > i ? eventIds[i] : null);
  }
};

export const seedUserData = async (userId: string): Promise<SeedUserDataResult> => {
  try {
    // Create events
    const eventIds = await createEvents(userId);
    
    // Create groups
    const groupIds = await createGroups(userId, eventIds);
    
    // Create notifications
    await createNotifications(userId, eventIds);
    
    return {
      success: true,
      eventIds,
      groupIds,
      eventCount: eventIds.length,
      groupCount: groupIds.length,
      notificationCount: eventIds.length // Total notifications created
    };
  } catch (error) {
    console.error("Error seeding user data:", error);
    return {
      success: false,
      error
    };
  }
};

export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    // First try to find the profile by email
    const { data, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error finding profile:", userError);
      return {
        success: false,
        error: userError.message
      };
    }
    
    if (data && data.id) {
      return await seedUserData(data.id);
    }
    
    // If not found in profiles, try using the current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData?.session?.user?.email === email) {
      const userId = sessionData.session.user.id;
      return await seedUserData(userId);
    }
    
    // If user still not found
    return {
      success: false,
      error: `Could not find user with email ${email}`
    };
  } catch (error) {
    console.error("Error seeding data for email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export default {
  seedUserData,
  seedDataForEmail
};
