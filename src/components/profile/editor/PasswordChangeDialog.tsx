
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole } from "lucide-react";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme a nova senha"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

export const PasswordChangeDialog = ({ 
  open, 
  onOpenChange, 
  isMobile = false 
}: PasswordChangeDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso."
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Erro ao atualizar senha",
        description: "Verifique se a senha atual está correta",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Alterar Senha</DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#EDEDED]">Senha Atual</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#EDEDED]">Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-[#EDEDED]">Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="password"
                          className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col gap-3 mt-6">
                  <Button 
                    type="submit"
                    className="dark:bg-primary dark:text-white dark:hover:bg-accent"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Alterando...' : 'Alterar senha'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-card dark:border-[#2C2C2C] overflow-y-auto max-h-[90vh] max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-[#EDEDED]">Alterar Senha</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#EDEDED]">Senha Atual</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="password"
                      className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#EDEDED]">Nova Senha</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="password"
                      className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#EDEDED]">Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="password"
                      className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="dark:bg-primary dark:text-white dark:hover:bg-accent"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Alterando...' : 'Alterar senha'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
