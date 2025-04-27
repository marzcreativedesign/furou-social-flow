
import { useState, useEffect } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGroupMembers } from "./hooks/useGroupMembers";
import MembersList from "./MembersList";
import { InviteDialog } from "./InviteDialog";
import type { MemberManagementProps } from "./types";

const GroupMembersManagement = ({ groupId, isOwner, isAdmin }: MemberManagementProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { 
    members, 
    loading, 
    fetchMembers, 
    removeMember, 
    updateRole, 
    inviteMember 
  } = useGroupMembers(groupId);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <Card>
      <CardHeader className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <CardTitle className="flex items-center gap-2">
          Membros do Grupo
        </CardTitle>
        <CardDescription>
          {members.length} participantes neste grupo
        </CardDescription>
      </CardHeader>

      <CardContent>
        <MembersList
          members={members}
          isOwner={isOwner}
          isAdmin={isAdmin}
          onUpdateRole={updateRole}
          onRemove={removeMember}
        />
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

      <InviteDialog
        groupId={groupId}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onInvite={inviteMember}
      />
    </Card>
  );
};

export default GroupMembersManagement;
