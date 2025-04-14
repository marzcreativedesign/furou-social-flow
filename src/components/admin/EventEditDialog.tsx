
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Event } from "@/hooks/useAdminEvents";

interface EventEditDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdate: () => void;
}

const EventEditDialog = ({ event, open, onOpenChange, onEventUpdate }: EventEditDialogProps) => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(event);
  const { toast } = useToast();

  const saveEventChanges = async () => {
    if (!editingEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: editingEvent.title,
          description: editingEvent.description,
          date: editingEvent.date,
          location: editingEvent.location,
          is_public: editingEvent.is_public
        })
        .eq('id', editingEvent.id);

      if (error) throw error;

      toast({
        title: "Evento atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      onEventUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Erro ao atualizar evento",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  if (!editingEvent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
          <DialogDescription>
            Atualize as informações do evento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              rows={3}
              value={editingEvent.description || ''}
              onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Data e Hora
              </label>
              <Input
                id="date"
                type="datetime-local"
                value={new Date(editingEvent.date).toISOString().slice(0, 16)}
                onChange={(e) => setEditingEvent({...editingEvent, date: new Date(e.target.value).toISOString()})}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Local
              </label>
              <Input
                id="location"
                value={editingEvent.location || ''}
                onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_public"
              checked={editingEvent.is_public}
              onChange={(e) => setEditingEvent({...editingEvent, is_public: e.target.checked})}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_public" className="text-sm font-medium">
              Evento público
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={saveEventChanges}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
