
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GroupsService } from "@/services/groups.service";

interface CreateGroupDialogProps {
  onGroupCreated: (newGroup: any) => void;
}

const CreateGroupDialog = ({ onGroupCreated }: CreateGroupDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (newGroupName.trim() === "") {
      toast({
        title: "Erro",
        description: "O nome do grupo não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const createdGroup = await GroupsService.createGroup({
        name: newGroupName,
        description: newGroupDescription || undefined,
        image_url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3"
      });

      if (!createdGroup || createdGroup.length === 0) {
        throw new Error("Falha ao criar grupo");
      }

      const newGroup = {
        id: createdGroup[0].id,
        name: createdGroup[0].name,
        description: createdGroup[0].description,
        image_url: createdGroup[0].image_url || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3",
        members: 1,
        lastActivity: "Agora",
        created_at: createdGroup[0].created_at
      };

      onGroupCreated(newGroup);
      
      toast({
        title: "Grupo criado",
        description: `O grupo "${newGroupName}" foi criado com sucesso!`,
      });

      navigate(`/grupo/${newGroup.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o grupo",
        variant: "destructive",
      });
    } finally {
      setNewGroupName("");
      setNewGroupDescription("");
      setIsDialogOpen(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus size={16} />
          Criar Grupo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo grupo</DialogTitle>
          <DialogDescription>
            Digite o nome do seu novo grupo. Você poderá adicionar membros após a criação.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do grupo</Label>
            <Input
              id="name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Ex: Amigos da Faculdade"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              placeholder="Ex: Grupo para organizar os rolês da faculdade"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateGroup} disabled={loading}>
            {loading ? "Criando..." : "Criar Grupo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
