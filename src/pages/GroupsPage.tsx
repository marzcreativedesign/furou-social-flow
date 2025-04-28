
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, Mail, Clock, AlertCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { CreateGroupRequest } from "@/types/group";

const GroupsPage = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedGroupIdForInvite, setSelectedGroupIdForInvite] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  
  const {
    groups,
    pendingInvites,
    loadingGroups,
    loadingInvites,
    creatingGroup,
    sendingInvite,
    acceptingInvite,
    rejectingInvite,
    createGroup,
    acceptInvite,
    rejectInvite,
    createInvite
  } = useGroups();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateGroupRequest>();
  
  const onCreateGroup = async (data: CreateGroupRequest) => {
    try {
      await createGroup(data);
      setCreateDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };
  
  const onSendInvite = async () => {
    if (!selectedGroupIdForInvite || !inviteEmail) return;
    
    try {
      await createInvite({
        group_id: selectedGroupIdForInvite,
        invitee_email: inviteEmail
      });
      
      setInviteDialogOpen(false);
      setInviteEmail("");
      setSelectedGroupIdForInvite(null);
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
    }
  };
  
  const openInviteDialog = (groupId: string) => {
    setSelectedGroupIdForInvite(groupId);
    setInviteDialogOpen(true);
  };

  return (
    <MainLayout title="Grupos" showDock>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Grupos</h1>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Criar Grupo
          </Button>
        </div>

        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="groups">
              <Users className="mr-2 h-4 w-4" />
              Meus Grupos
            </TabsTrigger>
            <TabsTrigger value="invites">
              <Mail className="mr-2 h-4 w-4" />
              Convites Pendentes 
              {pendingInvites && pendingInvites.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">
                  {pendingInvites.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups" className="mt-0">
            {loadingGroups ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="flex flex-col">
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : groups && groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => (
                  <Card key={group.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>{group.type || "Grupo"}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">
                        {group.description || "Sem descrição"}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/grupos/${group.id}`)}
                      >
                        Ver detalhes
                      </Button>
                      {group.is_admin && (
                        <Button 
                          onClick={() => openInviteDialog(group.id)}
                          variant="secondary"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Convidar
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">Você não está em nenhum grupo</h3>
                <p className="text-muted-foreground mb-4">
                  Crie um novo grupo ou aceite convites pendentes para começar.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Grupo
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invites" className="mt-0">
            {loadingInvites ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="flex flex-col">
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : pendingInvites && pendingInvites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingInvites.map((invite) => (
                  <Card key={invite.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{invite.group?.name}</CardTitle>
                      <CardDescription>
                        Convite de {invite.inviter?.full_name || "Desconhecido"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          Expira em: {new Date(invite.expires_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invite.group?.description || "Sem descrição"}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => rejectInvite(invite.id)}
                        disabled={rejectingInvite}
                      >
                        Recusar
                      </Button>
                      <Button 
                        onClick={() => acceptInvite(invite.invite_code)}
                        disabled={acceptingInvite}
                      >
                        Aceitar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">Nenhum convite pendente</h3>
                <p className="text-muted-foreground">
                  Quando você receber convites para grupos, eles aparecerão aqui.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Diálogo para criar grupo */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <form onSubmit={handleSubmit(onCreateGroup)}>
              <DialogHeader>
                <DialogTitle>Criar novo grupo</DialogTitle>
                <DialogDescription>
                  Preencha as informações para criar seu novo grupo. Você será o administrador.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do grupo *</Label>
                  <Input 
                    id="name"
                    {...register("name", { required: "Nome é obrigatório" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Input 
                    id="type"
                    placeholder="Ex: Amigos, Trabalho, Família..."
                    {...register("type")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description"
                    placeholder="Descreva o propósito do grupo"
                    {...register("description")}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={creatingGroup}>
                  {creatingGroup ? "Criando..." : "Criar grupo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
              
              <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p>
                  Se o usuário não estiver cadastrado, ele receberá um e-mail para se cadastrar.
                </p>
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

export default GroupsPage;
