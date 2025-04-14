
import { type Group } from "@/hooks/useGroupsAdmin";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface GroupEditDialogProps {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: Group) => void;
}

const GroupEditDialog = ({
  group,
  open,
  onOpenChange,
  onSave
}: GroupEditDialogProps) => {
  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Nome</label>
            <Input
              id="name"
              value={group.name}
              onChange={(e) => group.name = e.target.value}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
            <Textarea
              id="description"
              rows={3}
              value={group.description || ''}
              onChange={(e) => group.description = e.target.value}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="image_url" className="text-sm font-medium">URL da imagem</label>
            <Input
              id="image_url"
              value={group.image_url || ''}
              onChange={(e) => group.image_url = e.target.value}
            />
            {group.image_url && (
              <div className="mt-2">
                <img 
                  src={group.image_url} 
                  alt={group.name}
                  className="w-full h-40 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(group)}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupEditDialog;
