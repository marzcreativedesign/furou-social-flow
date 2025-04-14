
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import MainLayout from "../components/MainLayout";

// Mock data for groups
const MOCK_GROUPS = [
  {
    id: "1",
    name: "Amigos da Faculdade",
    members: 12,
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    lastActivity: "Há 2 dias",
  },
  {
    id: "2",
    name: "Colegas de Trabalho",
    members: 8,
    imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    lastActivity: "Há 1 semana",
  },
  {
    id: "3",
    name: "Família",
    members: 5,
    imageUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    lastActivity: "Hoje",
  },
];

const Groups = () => {
  const { toast } = useToast();
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateGroup = () => {
    if (newGroupName.trim() === "") {
      toast({
        title: "Erro",
        description: "O nome do grupo não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    const newGroup = {
      id: String(groups.length + 1),
      name: newGroupName,
      members: 1,
      imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      lastActivity: "Agora",
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setIsDialogOpen(false);
    
    toast({
      title: "Grupo criado",
      description: `O grupo "${newGroupName}" foi criado com sucesso!`,
    });
  };

  return (
    <MainLayout title="Seus Grupos">
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Seus grupos</h2>
          
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateGroup}>Criar Grupo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <Link to={`/grupo/${group.id}`} key={group.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={group.imageUrl} alt={group.name} />
                        <AvatarFallback>
                          {group.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{group.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {group.members} {group.members === 1 ? "membro" : "membros"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-xs text-muted-foreground">Última atividade: {group.lastActivity}</p>
                  </CardContent>
                  <CardFooter className="pt-1">
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Users size={12} />
                      <span>Ver detalhes</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users size={48} className="text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">Nenhum grupo ainda</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Crie seu primeiro grupo para organizar seus eventos com amigos
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Criar meu primeiro grupo
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Groups;
