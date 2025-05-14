
// Re-export from our centralized implementation
import { useToast as useToastHook, toast, type Toast } from "@/hooks/use-toast";

// Re-export everything
export { useToastHook as useToast, toast, type Toast };
