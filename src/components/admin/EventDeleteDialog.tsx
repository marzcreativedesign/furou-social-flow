
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Event } from "@/hooks/useAdminEvents";

interface EventDeleteDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventDelete: () => void;
}

const EventDeleteDialog = ({ event, open, onOpenChange, onEventDelete }: EventDeleteDialogProps) => {
  const { toast } = useToast();

  const deleteEvent = async () => {
    if (!event) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      });

      onEventDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o evento "{event?.title}"?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={deleteEvent}>
            Excluir evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDeleteDialog;
