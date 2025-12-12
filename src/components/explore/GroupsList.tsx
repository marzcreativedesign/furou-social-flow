
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Globe, Plus, Calendar } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface GroupsListProps {
  searchQuery: string;
}

const GroupsList = ({ searchQuery }: GroupsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { myGroups, publicGroups, pendingInvites, joinGroup, acceptInvite, declineInvite } = useGroups();

  const handleJoinGroup = async (groupId: string) => {
    await joinGroup(groupId);
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação para entrar no grupo foi enviada"
    });
  };

  const handleAcceptInvite = async (inviteId: string) => {
    await acceptInvite(inviteId);
    toast({
      title: "Convite aceito",
      description: "Você agora faz parte do grupo!"
    });
  };

  const handleDeclineInvite = async (inviteId: string) => {
    await declineInvite(inviteId);
    toast({
      title: "Convite recusado",
      description: "O convite foi recusado"
    });
  };

  // Filter groups based on search
  const filteredMyGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublicGroups = publicGroups.filter(group => 
    !myGroups.some(mg => mg.id === group.id) &&
    (group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 mt-4">
      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Badge variant="destructive">{pendingInvites.length}</Badge>
            Convites pendentes
          </h3>
          <div className="space-y-3">
            {pendingInvites.map(invite => (
              <Card key={invite.id} className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={invite.group.image_url} />
                      <AvatarFallback>{invite.group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{invite.group.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Você foi convidado para este grupo
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptInvite(invite.id)}>
                        Aceitar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeclineInvite(invite.id)}>
                        Recusar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Groups */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Meus grupos</h3>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Criar grupo
          </Button>
        </div>
        
        {filteredMyGroups.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum grupo encontrado" : "Você ainda não participa de nenhum grupo"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredMyGroups.map(group => (
              <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative h-32">
                  <img 
                    src={group.image_url} 
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className="absolute top-2 right-2 gap-1"
                    variant={group.type === "public" ? "default" : "secondary"}
                  >
                    {group.type === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {group.type === "public" ? "Público" : "Privado"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-1">{group.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.members_count} membros
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {group.events_count} eventos
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Public Groups to Join */}
      {filteredPublicGroups.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Descobrir grupos</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredPublicGroups.map(group => (
              <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-32">
                  <img 
                    src={group.image_url} 
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 gap-1">
                    <Globe className="h-3 w-3" />
                    Público
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-1">{group.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {group.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {group.events_count}
                      </span>
                    </div>
                    <Button size="sm" onClick={() => handleJoinGroup(group.id)}>
                      Participar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
