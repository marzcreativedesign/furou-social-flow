
import { z } from "zod";

export const groupFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  image_url: z.string().optional(),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;

export interface CreateGroupDialogProps {
  onGroupCreated: (newGroup: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
