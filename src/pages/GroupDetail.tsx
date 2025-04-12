
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  Mail, 
  Link as LinkIcon, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  ChevronRight
} from "lucide-react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useToast } from "../components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";

// Mock data for a group
const MOCK_GROUP = {
  id: "1",
  name: "Amigos da Faculdade",
  description: "Grupo para organizar eventos da turma de 2023",
  imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
  members: [
    { 
      id: "1", 
      name: "João Silva", 
      image: "https://i.pravatar.cc/150?img=1",
      isAdmin: true,
      stats: { participated: 12, missed: 2, pending: 1 }
    },
    { 
      id: "2", 
      name: "Maria Souza", 
      image: "https://i.pravatar.cc/150?img=5",
      isAdmin: false,
      stats: { participated: 10, missed: 1, pending: 3 }
    },
    { 
      id: "3", 
      name: "Pedro Santos", 
      image: "https://i.pravatar.cc/150?img=7",
      isAdmin: false,
      stats: { participated: 8, missed: 4, pending: 2 }
    },
    { 
      id: "4", 
      name: "Ana Oliveira", 
      image: "https://i.pravatar.cc/150?img=9",
      isAdmin: false, 
      stats: { participated: 14, missed: 0, pending: 0 }
    }
  ],
  events: [
    {
      id: "1",
      title: "Churrasco de Final de Semestre",
      date: "Sábado, 20 de Maio",
      confirmedCount: 8,
      pendingCount: 4,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      id: "2",
      title: "Estudo em Grupo para Prova Final",
      date: "Quinta, 25 de Maio",
      confirmedCount: 6,
      pendingCount: 6,
      image: "https://images.unsplash.com/photo-1554252116-bdb8a68dba68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ]
};

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState(MOCK_GROUP);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState(group.name);
  const [editGroupDescription, setEditGroupDescription] = useState(group.description || "");

  // Sort members by participation rate
  const sortedMembers = [...group.members].sort((a, b) => {
    const totalA = a.stats.participated + a.stats.missed + a.stats.pending;
    const totalB = b.stats.participated + b.stats.missed + b.stats.pending;
    const rateA = totalA > 0 ? a.stats.participated / totalA : 0;
    const rateB = totalB > 0 ? b.stats.participated / totalB : 0;
    return rateB - rateA;
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleInvite = () => {
    if (inviteEmail.trim() === "") {
      toast({
        title: "Erro",
        description: "O e-mail não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    // Here you would send the invitation
    toast({
      title: "Convite enviado",
      description: `Um convite foi enviado para ${inviteEmail}`,
    });
    setInviteEmail("");
    setIsInviteDialogOpen(false);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://furou.app/convite/${group.id}`);
    toast({
      title: "Link copiado",
      description: "Link de convite copiado para a área de transferência",
    });
  };

  const handleEditGroup = () => {
    if (editGroupName.trim() === "") {
      toast({
        title: "Erro",
        description: "O nome do grupo não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    setGroup({
      ...group,
      name: editGroupName,
      description: editGroupDescription
    });

    setIsEditDialogOpen(false);
    toast({
      title: "Grupo atualizado",
      description: "As informações do grupo foram atualizadas com sucesso",
    });
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = group.members.filter(member => member.id !== memberId);
    setGroup({
      ...group,
      members: updatedMembers
    });

    toast({
      title: "Membro removido",
      description: "O membro foi removido do grupo com sucesso",
    });
  };

  const handlePromoteToAdmin = (memberId: string) => {
    const updatedMembers = group.members.map(member => 
      member.id === memberId ? { ...member, isAdmin: true } : member
    );
    
    setGroup({
      ...group,
      members: updatedMembers
    });

    toast({
      title: "Administrador adicionado",
      description: "O membro agora é um administrador do grupo",
    });
  };

  const handleDemoteFromAdmin = (memberId: string) => {
    const updatedMembers = group.members.map(member => 
      member.id === memberId ? { ...member, isAdmin: false } : member
    );
    
    setGroup({
      ...group,
      members: updatedMembers
    });

    toast({
      title: "Administrador removido",
      description: "O membro não é mais um administrador do grupo",
    });
  };

  return (
    <div className="pb-20">
      <Header showBack onBack={handleBack} title={group.name} />
      
      <div className="px-4 py-4">
        {/* Group Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={group.imageUrl} alt={group.name} />
              <AvatarFallback>
                {group.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{group.name}</h1>
              <p className="text-sm text-muted-foreground">
                {group.members.length} {group.members.length === 1 ? "membro" : "membros"}
              </p>
              {group.description && (
                <p className="text-sm mt-1">{group.description}</p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setIsEditDialogOpen(true);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar grupo
                  </DropdownMenuItem>
                </DialogTrigger>
              </Dialog>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Excluir grupo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar pessoas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar para o grupo</DialogTitle>
                <DialogDescription>
                  Envie um convite por e-mail ou compartilhe um link
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="nome@exemplo.com"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleInvite}>
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label>Compartilhar link</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`https://furou.app/convite/${group.id}`}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={copyInviteLink}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Criar evento
          </Button>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>
          
          {/* Members Tab */}
          <TabsContent value="members" className="pt-4">
            <div className="space-y-4">
              {sortedMembers.map((member, index) => {
                const total = member.stats.participated + member.stats.missed + member.stats.pending;
                const participationRate = total > 0 ? (member.stats.participated / total) * 100 : 0;
                const missedRate = total > 0 ? (member.stats.missed / total) * 100 : 0;
                const pendingRate = total > 0 ? (member.stats.pending / total) * 100 : 0;
                
                return (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.image} alt={member.name} />
                            <AvatarFallback>
                              {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member.name}
                              {member.isAdmin && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Admin
                                </span>
                              )}
                            </p>
                            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                Participou: {member.stats.participated}
                              </span>
                              <span className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                                Furou: {member.stats.missed}
                              </span>
                              <span className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                                Pendente: {member.stats.pending}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!member.isAdmin ? (
                              <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.id)}>
                                <ArrowUp className="mr-2 h-4 w-4" />
                                Tornar administrador
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleDemoteFromAdmin(member.id)}>
                                <ArrowDown className="mr-2 h-4 w-4" />
                                Remover como administrador
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Remover do grupo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Participation Bar */}
                      <div className="mt-3">
                        <div className="w-full h-2 flex">
                          <div 
                            className="bg-green-500 h-full"
                            style={{ width: `${participationRate}%` }}
                          ></div>
                          <div 
                            className="bg-red-500 h-full"
                            style={{ width: `${missedRate}%` }}
                          ></div>
                          <div 
                            className="bg-yellow-500 h-full"
                            style={{ width: `${pendingRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events" className="pt-4">
            <div className="space-y-4">
              {group.events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="flex h-24">
                    <div 
                      className="w-24 h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.image})` }}
                    ></div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2">{event.title}</h3>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs">
                          <span className="text-green-600">{event.confirmedCount} confirmados</span>
                          {event.pendingCount > 0 && (
                            <span className="text-yellow-600 ml-2">{event.pendingCount} pendentes</span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {group.events.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium mb-1">Nenhum evento</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Este grupo ainda não tem eventos
                  </p>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Criar o primeiro evento
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar grupo</DialogTitle>
            <DialogDescription>
              Altere as informações do seu grupo
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Nome do grupo</Label>
              <Input
                id="group-name"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="group-description">Descrição (opcional)</Label>
              <Input
                id="group-description"
                value={editGroupDescription}
                onChange={(e) => setEditGroupDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditGroup}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default GroupDetail;
