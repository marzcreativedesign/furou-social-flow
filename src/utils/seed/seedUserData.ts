
import { supabase } from "@/integrations/supabase/client";
import { SeedUserDataResult } from "./types";

// Helper function to safely perform database queries
async function safeQueryProfiles(email: string): Promise<{ id: string } | null> {
  try {
    // Avoid deep type instantiation by not using generic parameter
    const result = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (result.error) {
      console.error('Error querying profile by email:', result.error);
      return null;
    }
    
    // Use a simple type assertion with known structure
    return result.data as { id: string } | null;
  } catch (error) {
    console.error('Unexpected error querying profiles:', error);
    return null;
  }
}

// Function to seed data for a user based on email
export const seedDataForEmail = async (email: string): Promise<SeedUserDataResult> => {
  try {
    // First try to find the user by email in profiles
    const profileData = await safeQueryProfiles(email);
    
    if (profileData) {
      return await seedUserData(profileData.id);
    }
    
    // If not found in profiles, check current session
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData?.session?.user;
    
    if (currentUser && currentUser.email === email) {
      return await seedUserData(currentUser.id);
    }
    
    return {
      success: false,
      error: `Could not find user with email ${email}`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Implementation of seedUserData with improved error handling and tracking
export const seedUserData = async (userId: string): Promise<SeedUserDataResult> => {
  try {
    // Create sample events with controlled batch size
    const eventResults = await seedSampleEvents(userId);
    
    return {
      success: true,
      eventCount: eventResults.length,
      eventIds: eventResults.map(event => event.id)
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during seeding';
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Helper function to seed sample events
async function seedSampleEvents(userId: string): Promise<any[]> {
  const sampleEvents = [
    {
      creator_id: userId,
      title: "Sample Event 1",
      description: "This is a demo event created automatically",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      location: "São Paulo",
      is_public: true,
      image_url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3"
    },
    {
      creator_id: userId,
      title: "Sample Event 2",
      description: "This is another demo event created automatically",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
      location: "Rio de Janeiro",
      is_public: false,
      image_url: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?ixlib=rb-4.0.3"
    }
  ];
  
  const { data, error } = await supabase.from("events").insert(sampleEvents).select();
  
  if (error) {
    throw new Error(`Failed to create sample events: ${error.message}`);
  }
  
  // Also add the creator as a participant for each event
  if (data && data.length > 0) {
    const participantInserts = data.map(event => ({
      event_id: event.id,
      user_id: userId,
      status: "confirmed"
    }));
    
    await supabase.from("event_participants").insert(participantInserts);
  }
  
  return data || [];
}
