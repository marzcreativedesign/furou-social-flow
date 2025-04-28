
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, ArrowLeft, Calendar, LogOut, Shield } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { GroupMember } from "@/types/group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const GroupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  
  const {
    groups,
    groupMembers,
    selectedGroupId,
    loadingGroups,
    loadingMembers,
    sendingInvite,
    leavingGroup,
    setSelectedGroupId,
    createInvite,
    leaveGroup
  } = useGroups();

  // Ao carregar a página, define o ID do grupo selecionado
  useEffect(() => {
    if (id) {
      setSelectedGroupId(id);
    }
  }, [id, setSelectedGroupId]);

  // Encontra o grupo atual
  const currentGroup = groups?.find(group => group.id === id);
  const isAdmin = currentGroup?.is_admin || false;

  // Função para obter as iniciais do nome
  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  const onSendInvite = async () => {
    if (!id || !inviteEmail) return;
    
    try {
      await createInvite({
        group_id: id,
        invitee_email: inviteEmail
      });
      
      setInviteDialogOpen(false);
      setInviteEmail("");
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
    }
  };
  
  const onLeaveGroup = async () => {
    if (!id) return;
    
    try {
      await leaveGroup(id);
      navigate("/grupos");
    } catch (error) {
      console.error("Erro ao sair do grupo:", error);
    }
  };

  if (loadingGroups) {
    return (
      <MainLayout title="Carregando grupo..." showDock>
        <div className="p-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <Skeleton className="h-10 w-24 mb-8" />
          
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentGroup) {
    return (
      <MainLayout title="Grupo não encontrado" showDock>
        <div className="p-4">
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">Grupo não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O grupo que você está procurando não existe ou você não tem acesso a ele.
            </p>
            <Button onClick={() => navigate("/grupos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Grupos
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={currentGroup.name} showDock>
      <div className="p-4">
        <div className="flex items-center mb-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 p-0 w-8 h-8"
            onClick={() => navigate("/grupos")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{currentGroup.name}</h1>
        </div>
        
        {currentGroup.type && (
          <Badge variant="outline" className="mb-4">
            {currentGroup.type}
          </Badge>
        )}
        
        {currentGroup.description && (
          <p className="text-muted-foreground mb-6">{currentGroup.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          {isAdmin && (
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Convidar Pessoas
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate(`/grupos/${id}/eventos`)}>
            <Calendar className="mr-2 h-4 w-4" />
            Ver Eventos
          </Button>
          <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                <LogOut className="mr-2 h-4 w-4" />
                Sair do Grupo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sair do grupo?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você tem certeza que deseja sair deste grupo? Você precisará de um novo convite para voltar.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 hover:bg-red-600" 
                  onClick={onLeaveGroup}
                  disabled={leavingGroup}
                >
                  {leavingGroup ? "Saindo..." : "Sair"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <Tabs defaultValue="members">
          <TabsList className="mb-4">
            <TabsTrigger value="members">
              <Users className="mr-2 h-4 w-4" />
              Membros
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="mt-0">
            <Card>
              <CardContent className="p-6">
                {loadingMembers ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {groupMembers?.map((member: GroupMember) => (
                        <div key={member.id} className="flex items-center space-x-4">
                          <Avatar>
                            {member.profiles?.avatar_url ? (
                              <AvatarImage src={member.profiles.avatar_url} alt={member.profiles.full_name || "Membro"} />
                            ) : (
                              <AvatarFallback>
                                {getInitials(member.profiles?.full_name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member.profiles?.full_name || "Usuário"}
                              {member.is_admin && (
                                <span className="ml-2 inline-flex items-center">
                                  <Shield className="h-3 w-3 text-primary mr-1" />
                                  <span className="text-xs text-primary">Admin</span>
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.profiles?.email || ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Diálogo para enviar convite */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar para o grupo</DialogTitle>
              <DialogDescription>
                Digite o e-mail da pessoa que você deseja convidar para este grupo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setInviteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={onSendInvite} 
                disabled={!inviteEmail || sendingInvite}
              >
                {sendingInvite ? "Enviando..." : "Enviar convite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default GroupDetailPage;
