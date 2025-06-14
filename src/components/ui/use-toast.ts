
// Re-export from our wrapper, ONLY Sonner
import { useToast as useToastHook, toast, type Toast } from "@/hooks/use-toast";

export { useToastHook as useToast, toast, type Toast };

