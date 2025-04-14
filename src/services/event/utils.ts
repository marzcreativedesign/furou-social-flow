
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleError = (error: any, message: string) => {
  console.error(`Error: ${message}`, error);
  toast.error(message);
  return { data: null, error };
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new Error("User not authenticated");
  }
  return data.user;
};
