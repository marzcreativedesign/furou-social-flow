
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

// Use explicit typing to avoid recursive type references
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    // First try to find the profile directly
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error fetching profile:", userError);
      return {
        success: false,
        error: userError
      };
    }
    
    if (userData && userData.id) {
      return await seedUserData(userData.id);
    }
    
    // If not found in profiles, try using the current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData.session?.user && sessionData.session.user.email === email) {
      return await seedUserData(sessionData.session.user.id);
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
      error: typeof error === 'object' ? (error as Error).message : String(error)
    };
  }
};

export default {
  seedUserData,
  seedDataForEmail
};
