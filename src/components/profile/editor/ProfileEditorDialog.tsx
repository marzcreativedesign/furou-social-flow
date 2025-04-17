
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import ProfileForm from "./ProfileForm";

// Define the form schema
const formSchema = z.object({
  full_name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres"),
  bio: z.string().optional(),
  avatar_url: z.string().optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // If any password field is filled, all password fields must be filled
  const hasPasswordChange = data.currentPassword || data.newPassword || data.confirmPassword;
  if (!hasPasswordChange) return true;
  
  return !!data.currentPassword && !!data.newPassword && !!data.confirmPassword;
}, {
  message: "Todos os campos de senha devem ser preenchidos para alterar a senha",
  path: ["newPassword"],
}).refine((data) => {
  // New password and confirm password must match
  if (!data.newPassword) return true;
  return data.newPassword === data.confirmPassword;
}, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

interface ProfileEditorDialogProps {
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    bio: string | null;
    avatar_url: string | null;
  };
  onProfileUpdated: (formData: { full_name: string; bio: string; avatar_url: string | null }) => void;
  useResponsiveLayout?: boolean;
}

export const ProfileEditorDialog = ({ 
  profile, 
  onProfileUpdated,
  useResponsiveLayout = false
}: ProfileEditorDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (open) {
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile, open]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setAvatarFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return profile.avatar_url;
    
    setUploading(true);
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'avatars')) {
        await supabase.storage.createBucket('avatars', { public: true });
      }

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${profile.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro ao enviar a imagem",
        description: "Não foi possível enviar sua foto de perfil",
        variant: "destructive"
      });
      return profile.avatar_url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    let avatarUrl = profile.avatar_url;
    if (avatarFile) {
      avatarUrl = await uploadAvatar();
    }

    if (values.currentPassword && values.newPassword) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: values.newPassword
        });
        
        if (error) throw error;
        
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi atualizada com sucesso"
        });
      } catch (error) {
        console.error("Error updating password:", error);
        toast({
          title: "Erro ao atualizar senha",
          description: "Verifique se a senha atual está correta",
          variant: "destructive"
        });
        return;
      }
    }

    const updatedProfile = {
      full_name: values.full_name,
      bio: values.bio || null,
      avatar_url: avatarUrl
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', profile.id);

      if (error) throw error;
      
      onProfileUpdated(updatedProfile);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso"
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    }
  };

  if (useResponsiveLayout) {
    return (
      <>
        <Button 
          onClick={() => setOpen(true)} 
          className="w-full"
        >
          Editar Perfil
        </Button>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="h-[85vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>Editar Perfil</DrawerTitle>
            </DrawerHeader>
            
            <div className="px-4">
              <ProfileForm
                profile={profile}
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                avatarPreview={avatarPreview}
                onAvatarChange={handleAvatarChange}
                isSubmitting={uploading}
                isMobile={true}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="w-full"
      >
        Editar Perfil
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark:bg-card dark:border-[#2C2C2C] overflow-y-auto max-h-[90vh] max-w-xl">
          <DialogHeader>
            <DialogTitle className="dark:text-[#EDEDED]">Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <ProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
            isSubmitting={uploading}
            isMobile={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
