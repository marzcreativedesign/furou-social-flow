
import { toast as sonnerToast, ToastT } from "sonner";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { useToast as useRadixToast } from "@/components/ui/use-toast";

export type Toast = ToastT;

export function toast(props: ToastT) {
  return sonnerToast(props);
}

export const useToast = useRadixToast;
