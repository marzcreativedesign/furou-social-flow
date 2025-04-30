
import { supabase } from "@/integrations/supabase/client";

/**
 * Trata e padroniza erros nos serviços
 */
export const handleError = (error: any, message: string) => {
  console.error(message, error);
  return { data: null, error: { message, originalError: error } };
};

/**
 * Obtém o usuário autenticado atualmente
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) throw new Error("User not authenticated");
  if (!data.user) throw new Error("User not found");
  
  return data.user;
}
