
// Import Sonner's toast
import { toast as sonnerToast } from "sonner";

// Define our custom Toast type (used for typing, but note: Sonner doesn't require it)
export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

// Just a wrapper for Sonner
export function toast(props: Toast) {
  return sonnerToast(props.title || "", {
    description: props.description,
    action: props.action,
    className: props.variant === "destructive" ? "destructive" : undefined,
  });
}

// No-op useToast for compatibility
export const useToast = () => {
  // No-op: Sonner manages all internal state.
  return {
    toast,
    toasts: [] as Toast[],
    dismiss: (_id: string) => {},
  };
};

