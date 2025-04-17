
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsService } from "@/services/notifications.service";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
});

// Define the type explicitly using z.infer to avoid deep type instantiation
type FormValues = z.infer<typeof formSchema>;

interface EventInviteDialogProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
}

const EventInviteDialog = ({ eventId, eventTitle, eventDate }: EventInviteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .single();
      
      if (userError) {
        // User not found, send invitation email
        // In a real app, you would call an edge function here to send the email
        console.log("Sending invitation email to:", values.email);
        
        toast({
          title: "Convite enviado",
          description: `Um convite foi enviado para ${values.email}`,
        });
      } else {
        // User found, create notification
        await NotificationsService.createNotification({
          title: "Novo convite para evento",
          content: `Você foi convidado para participar do evento "${eventTitle}" em ${eventDate}.`,
          type: "invite",
          related_id: eventId,
          user_id: userData.id
        });
        
        // Update event_confirmations or create a pending invitation
        await supabase
          .from('event_confirmations')
          .insert({
            event_id: eventId,
            user_id: userData.id,
            status: 'invited'
          });
        
        toast({
          title: "Convite enviado",
          description: `${values.email} foi convidado para o evento.`,
        });
      }
      
      // Close dialog and reset form
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
          <Mail className="h-4 w-4" />
          <span>Convidar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar para o evento</DialogTitle>
          <DialogDescription>
            Envie um convite para participar do evento "{eventTitle}".
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email@exemplo.com" 
                      {...field} 
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enviar convite</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventInviteDialog;
