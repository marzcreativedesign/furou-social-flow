
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"; // Added this import
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";

interface ProfileEditorDialogProps {
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    bio: string | null;
    avatar_url: string | null;
  };
  onProfileUpdated: (formData: { full_name: string; bio: string; avatar_url: string | null }) => void;
}

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

export const ProfileEditorDialog = ({ 
  profile, 
  onProfileUpdated
}: ProfileEditorDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile.full_name || '',
      bio: profile.bio || '',
      avatar_url: profile.avatar_url || null,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Reset form when profile changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile, open, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setAvatarFile(file);
    
    // Create preview
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
      // Check if avatars bucket exists, if not, create it
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'avatars')) {
        await supabase.storage.createBucket('avatars', { public: true });
      }

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${profile.id}/${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });
      
      if (uploadError) {
        throw uploadError;
      }
      
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

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso"
      });
      
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Erro ao atualizar senha",
        description: "Verifique se a senha atual está correta",
        variant: "destructive"
      });
      return false;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Update avatar if changed
    let avatarUrl = profile.avatar_url;
    if (avatarFile) {
      avatarUrl = await uploadAvatar();
    }

    // Update password if fields are filled
    if (values.currentPassword && values.newPassword) {
      const passwordUpdated = await updatePassword(values.currentPassword, values.newPassword);
      if (!passwordUpdated) return;
    }

    // Update profile data
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

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="w-full"
      >
        Editar Perfil
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark:bg-card dark:border-[#2C2C2C] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#EDEDED]">Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-background dark:border-[#1E1E1E]">
                    <AvatarImage src={avatarPreview || undefined} alt={profile.full_name || ''} />
                    <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                      {profile.full_name?.substring(0, 2).toUpperCase() || profile.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="avatar-upload" className="bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors cursor-pointer">
                      <Camera size={14} />
                    </label>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#EDEDED]">Nome</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="dark:text-[#EDEDED]">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3]"
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#EDEDED]">Biografia</FormLabel>
                    <FormControl>
                      <textarea 
                        {...field}
                        rows={3}
                        className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3] dark:focus:border-primary dark:focus:ring-primary/20 resize-none w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-4" />
              
              <h3 className="font-medium dark:text-[#EDEDED]">Alterar Senha</h3>
              
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#EDEDED]">Senha Atual</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="password"
                        className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#EDEDED]">Nova Senha</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="password"
                        className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#EDEDED]">Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="password"
                        className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="dark:bg-primary dark:text-white dark:hover:bg-accent"
                  disabled={uploading || form.formState.isSubmitting}
                >
                  {uploading || form.formState.isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
