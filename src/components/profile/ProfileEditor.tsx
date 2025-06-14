
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileForm from "./ProfileForm";
import { PasswordChangeDialog } from "./PasswordChangeDialog";
import { LockKeyhole } from "lucide-react";

interface ProfileEditorProps {
  profile: any;
  onProfileUpdated: (profile: any) => void;
}

export const ProfileEditor = ({ profile, onProfileUpdated }: ProfileEditorProps) => {
  const [open, setOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const EditComponent = isMobile ? Drawer : Dialog;
  const EditComponentContent = isMobile ? DrawerContent : DialogContent;
  const EditComponentHeader = isMobile ? DrawerHeader : DialogHeader;
  const EditComponentTitle = isMobile ? DrawerTitle : DialogTitle;

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full">
        Editar Perfil
      </Button>

      <EditComponent open={open} onOpenChange={setOpen}>
        <EditComponentContent className={isMobile ? "h-[80vh] overflow-y-auto" : "max-w-xl overflow-y-auto max-h-[90vh]"}>
          <EditComponentHeader>
            <EditComponentTitle>Editar Perfil</EditComponentTitle>
          </EditComponentHeader>
          
          <div className={isMobile ? "px-4 pt-2" : ""}>
            <Button 
              variant="outline" 
              className="mb-6 flex gap-2 items-center w-full"
              onClick={() => setPasswordDialogOpen(true)}
            >
              <LockKeyhole size={16} />
              <span>Alterar Senha</span>
            </Button>
            
            <ProfileForm
              profile={profile}
              onProfileUpdated={onProfileUpdated}
              onCancel={() => setOpen(false)}
              isMobile={isMobile}
            />
          </div>
        </EditComponentContent>
      </EditComponent>

      <PasswordChangeDialog 
        open={passwordDialogOpen} 
        onOpenChange={setPasswordDialogOpen} 
        isMobile={isMobile} 
      />
    </>
  );
};
