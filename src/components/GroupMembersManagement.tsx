
import React, { useState, useEffect } from "react";
import {
  Users,
  Trash2,
  Send,
  Copy,
  UserPlus,
  Crown,
  Shield,
  User,
  X,
  Check,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { GroupsService } from "@/services/groups.service";
import { supabase } from "@/integrations/supabase/client";

// Tipos para os membros do grupo
type MemberRole = "owner" | "admin" | "member";

interface GroupMember {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: MemberRole;
  user_id: string;
  is_admin: boolean;
}

interface GroupMembersManagementProps {
  groupId: string;
  isOwner: boolean;
  isAdmin: boolean;
}

const GroupMembersManagement: React.FC<GroupMembersManagementProps> = ({
  groupId,
  isOwner,
  isAdmin
}) => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInvite, setEmailInvite] = useState("");
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Gerar link simples de convite
  const inviteLink = `https://furou.app/convite/${groupId}/${Date.now()}`;

  // Buscar membros do grupo (apenas dados reais)
  useEffect(() => {
    const fetchGroupMembers = async () => {
      setLoading(true);
      try {
        const { data: groupMembers } = await GroupsService.getGroupMembers(groupId);
        if (groupMembers && groupMembers.length > 0) {
          const { data: currentUser } = await supabase.auth.getUser();
          const formattedMembers = groupMembers.map(member => ({
            id: member.id,
            user_id: member.user_id,
            name: member.profiles?.full_name || member.profiles?.username || 'Usuário',
            email: member.profiles?.email || undefined,
            avatarUrl: member.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${member.user_id}`,
            role: member.is_admin ? (member.user_id === currentUser.user?.id ? "owner" : "admin")  : "member",
            is_admin: member.is_admin
          }));
          setMembers(formattedMembers);
        } else {
          setMembers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupMembers();
    }
  }, [groupId]);

  const handleRemoveMember = async (member: GroupMember) => {
    await GroupsService.removeMember(groupId, member.user_id);
    setMembers(members.filter(m => m.id !== member.id));
  };

  const handleUpdateRole = async (member: GroupMember, isNewAdmin: boolean) => {
    await GroupsService.updateMember(groupId, member.user_id, isNewAdmin);
    const updatedMembers = members.map(m => 
      m.id === member.id ? { 
        ...m, 
        role: isNewAdmin ? "admin" : "member",
        is_admin: isNewAdmin
      } : m
    );
    setMembers(updatedMembers);
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleInviteByEmail = async () => {
    setEmailInvite("");
    setShowInviteDialog(false);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  const translateRole = (role: MemberRole): string => {
    switch (role) {
      case "owner":
        return "Proprietário";
      case "admin":
        return "Administrador";
      case "member":
        return "Membro";
      default:
        return "Membro";
    }
  };

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case "owner":
        return <Crown size={16} className="text-yellow-500" />;
      case "admin":
        return <Shield size={16} className="text-blue-500" />;
      case "member":
        return <User size={16} className="text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Membros do Grupo
        </CardTitle>
        <CardDescription>
          {members.length} participantes neste grupo
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{member.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{member.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{getRoleIcon(member.role)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{translateRole(member.role)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>

              {(isOwner || (isAdmin && member.role === "member")) && member.role !== "owner" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                        <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwner && (
                      <>
                        <DropdownMenuItem 
                          onClick={()  => handleUpdateRole(member, member.role === "admin" ? false : true)}
                        >
                          {member.role === "admin" ? (
                            <>
                              <User className="mr-2 h-4 w-4" />
                              <span>Tornar Membro</span>
                            </>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Tornar Admin</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500"
                      onClick={() => setSelectedMember(member)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Remover do grupo</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      {(isOwner || isAdmin) && (
        <CardFooter>
          <div className="flex flex-col w-full space-y-2">
            <Button onClick={() => setShowInviteDialog(true)} className="w-full" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Convidar novos participantes
            </Button>
          </div>
        </CardFooter>
      )}

      {/* Diálogo de confirmação para remoção */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Remover participante</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            {selectedMember && (
              <>
                <p className="mb-2">Você tem certeza que deseja remover:</p>
                <div className="flex justify-center mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedMember.avatarUrl} />
                    <AvatarFallback>{selectedMember.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="font-medium text-lg">{selectedMember.name}</p>
                <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
              </>
            )}
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto"
              onClick={() => {
                if (selectedMember) {
                  handleRemoveMember(selectedMember);
                  setSelectedMember(null);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de convite */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Convidar para o grupo</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <p className="font-medium">Convidar por e-mail</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="email@exemplo.com" 
                  value={emailInvite}
                  onChange={e => setEmailInvite(e.target.value)}
                />
                <Button 
                  onClick={handleInviteByEmail}
                  disabled={!emailInvite || !validateEmail(emailInvite)}
                >
                  <Send className="h-4 w-4 mr-2" /> 
                  Enviar
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Ou compartilhe o link</p>
              <div className="flex gap-2">
                <Input value={inviteLink} readOnly />
                <Button variant="outline" onClick={copyInviteLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => setShowInviteDialog(false)}
            >
              <Check className="mr-2 h-4 w-4" />
              Concluído
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GroupMembersManagement;
