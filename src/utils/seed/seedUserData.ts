
import { supabase } from '@/integrations/supabase/client';
import { createEvent, createGroup, createNotification } from './helpers';
import type { SeedUserDataResult } from './types';

export const seedUserData = async (userId: string): Promise<SeedUserDataResult> => {
  try {
    const eventIds: string[] = [];
    const eventCount = Math.floor(Math.random() * 6) + 5; // 5-10 events
    
    // Create events
    for (let i = 0; i < eventCount; i++) {
      const event = await createEvent(userId);
      if (event) {
        eventIds.push(event.id);
      }
    }
    
    // Create groups
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
    
    // Create notifications
    const notifCount = Math.floor(Math.random() * 4) + 5; // 5-8 notifications
    for (let i = 0; i < notifCount; i++) {
      await createNotification(
        userId, 
        i, 
        eventIds.length > i ? eventIds[i] : null
      );
    }
    
    return {
      success: true,
      eventIds,
      groupIds,
      eventCount,
      groupCount,
      notificationCount: notifCount
    };
  } catch (error) {
    console.error("Error seeding user data:", error);
    return {
      success: false,
      error
    };
  }
};

// Completely rewritten with explicit return types to avoid TypeScript inference issues
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    // First try to find the profile by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      const result: SeedUserDataResult = {
        success: false,
        error: userError.message
      };
      return result;
    }
    
    if (userData && userData.id) {
      return await seedUserData(userData.id);
    }
    
    // If not found in profiles, try using the current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData && sessionData.session?.user && sessionData.session.user.email === email) {
      return await seedUserData(sessionData.session.user.id);
    }
    
    // If user still not found
    const notFoundResult: SeedUserDataResult = {
      success: false,
      error: `Could not find user with email ${email}`
    };
    return notFoundResult;
  } catch (error) {
    console.error("Error seeding data for email:", error);
    const errorResult: SeedUserDataResult = {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
    return errorResult;
  }
};

export default {
  seedUserData,
  seedDataForEmail
};
