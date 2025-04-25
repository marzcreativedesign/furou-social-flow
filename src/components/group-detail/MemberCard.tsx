
import { useState } from "react";
import { User, Shield, Crown, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GroupMember } from "./types";

interface MemberCardProps {
  member: GroupMember;
  isOwner: boolean;
  isAdmin: boolean;
  onUpdateRole: (member: GroupMember, isAdmin: boolean) => void;
  onRemove: (member: GroupMember) => void;
}

export const MemberCard = ({ member, isOwner, isAdmin, onUpdateRole, onRemove }: MemberCardProps) => {
  const translateRole = (role: GroupMember["role"]) => {
    switch (role) {
      case "owner":
        return "Proprietário";
      case "admin":
        return "Administrador";
      case "member":
        return "Membro";
    }
  };

  const getRoleIcon = (role: GroupMember["role"]) => {
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
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
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
                <DropdownMenuItem onClick={() => onUpdateRole(member, !member.is_admin)}>
                  {member.is_admin ? (
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
              onClick={() => onRemove(member)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remover do grupo</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
