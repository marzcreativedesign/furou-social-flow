
import { supabase } from "@/integrations/supabase/client";
import { SeedUserDataResult } from "./types";

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
    const errorMessage = error instanceof Error ? 
      error.message : 'Unknown error occurred';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Implementation of seedUserData
export const seedUserData = async (userId: string): Promise<SeedUserDataResult> => {
  try {
    // Create some basic seed data for the user
    // For example, create some sample events
    const { error: eventError } = await supabase.from("events").insert([
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
    ]);

    if (eventError) {
      return {
        success: false,
        error: `Failed to create sample events: ${eventError.message}`
      };
    }

    return {
      success: true,
      message: "Sample data seeded successfully"
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? 
      error.message : 'Unknown error occurred during seeding';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
