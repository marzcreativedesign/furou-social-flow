
import { useState } from "react";
import { Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileEditorDialogProps {
  profile: {
    full_name: string | null;
    email: string;
    bio: string | null;
    avatar_url: string | null;
  };
  onProfileUpdated: (formData: { full_name: string; bio: string }) => void;
}

export const ProfileEditorDialog = ({ 
  profile, 
  onProfileUpdated
}: ProfileEditorDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    email: profile.email,
    bio: profile.bio || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onProfileUpdated(formData);
    setOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="w-full"
      >
        Editar Perfil
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark:bg-card dark:border-[#2C2C2C]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#EDEDED]">Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-background dark:border-[#1E1E1E]">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                  <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                    {profile.full_name?.substring(0, 2).toUpperCase() || profile.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
                  <Camera size={14} />
                </button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="full_name" className="dark:text-[#EDEDED]">Nome</Label>
              <Input 
                id="full_name" 
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="dark:text-[#EDEDED]">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio" className="dark:text-[#EDEDED]">Biografia</Label>
              <textarea 
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3] dark:focus:border-primary dark:focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="dark:bg-primary dark:text-white dark:hover:bg-accent"
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
