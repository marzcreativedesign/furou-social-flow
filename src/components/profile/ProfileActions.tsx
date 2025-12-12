
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Edit } from "lucide-react";

export interface ProfileActionsProps {
  onSignOut?: () => void;
  groupsCount?: number;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({ onSignOut }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleEditProfile}
        className="flex items-center justify-center"
      >
        <Edit className="h-4 w-4 mr-2" />
        Editar
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSettings}
        className="flex items-center justify-center"
      >
        <Settings className="h-4 w-4 mr-2" />
        Config.
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onSignOut}
        className="flex items-center justify-center text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </div>
  );
};
