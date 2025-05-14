
// Import from Sonner directly
import { toast as sonnerToast } from "sonner";

// Define our custom toast type that works with both implementations
export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

// Create a wrapper function that converts our Toast type to Sonner's format
export function toast(props: Toast) {
  return sonnerToast(props);
}

// Export a useToast hook
export const useToast = () => {
  // This is a simple implementation to make it compatible with the Radix UI pattern
  return {
    toast,
    // For compatibility with Radix UI toast
    toasts: [] as Toast[],
    dismiss: (id: string) => {},
  };
};
