
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles and standardizes errors in the services
 */
export const handleError = (error: any, message: string) => {
  console.error(message, error);
  return { data: null, error: { message, originalError: error } };
};

/**
 * Gets the currently authenticated user
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) throw new Error("User not authenticated");
  if (!data.user) throw new Error("User not found");
  
  return data.user;
}
