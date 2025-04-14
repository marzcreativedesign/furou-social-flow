
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { GroupsService } from "@/services/groups.service";
import { useAuth } from "@/contexts/AuthContext";

interface Group {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  members?: number;
  lastActivity?: string;
  created_at?: string;
}

const Groups = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      
      setIsFetching(true);
      try {
        const { data, error } = await GroupsService.getUserGroups();
        
        if (error) {
          console.error("Error fetching groups:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus grupos",
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          const formattedGroups = data.map(item => ({
            id: item.groups?.id || "",
            name: item.groups?.name || "",
            description: item.groups?.description || "",
            image_url: item.groups?.image_url || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3",
            members: 1, // Placeholder until we implement member count
            lastActivity: "Recentemente", // Placeholder
            created_at: item.groups?.created_at
          }));
          
          setGroups(formattedGroups);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os grupos",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchGroups();
  }, [user, toast]);

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
      // The issue is here - we need to handle the correct return type
      const createdGroup = await GroupsService.createGroup({
        name: newGroupName,
        description: newGroupDescription || undefined,
        image_url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3"
      });

      if (!createdGroup || createdGroup.length === 0) {
        throw new Error("Falha ao criar grupo");
      }

      const newGroup: Group = {
        id: createdGroup[0].id,
        name: createdGroup[0].name,
        description: createdGroup[0].description,
        image_url: createdGroup[0].image_url || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3",
        members: 1,
        lastActivity: "Agora",
        created_at: createdGroup[0].created_at
      };

      setGroups(prevGroups => [...prevGroups, newGroup]);
      
      toast({
        title: "Grupo criado",
        description: `O grupo "${newGroupName}" foi criado com sucesso!`,
      });

      // Redirecionar para a página do novo grupo
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
        </div>
        
        {isFetching ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <Link to={`/grupo/${group.id}`} key={group.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={group.image_url} alt={group.name} />
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
                  {group.description && (
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                    </CardContent>
                  )}
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
