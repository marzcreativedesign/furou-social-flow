
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  full_name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres"),
  bio: z.string().optional(),
});

interface ProfileFormProps {
  profile: any;
  onProfileUpdated: (profile: any) => void;
  onCancel: () => void;
  isMobile?: boolean;
}

const ProfileForm = ({ profile, onProfileUpdated, onCancel, isMobile = false }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return profile?.avatar_url;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });
      
      if (error) throw error;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a foto",
        variant: "destructive"
      });
      return profile?.avatar_url;
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const avatarUrl = await uploadAvatar();
      
      const updatedProfile = {
        ...values,
        avatar_url: avatarUrl
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', profile.id);

      if (error) throw error;
      
      onProfileUpdated(updatedProfile);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso"
      });
      
      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>
                {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
              <Camera size={16} />
              <input 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Email</FormLabel>
          <Input value={profile?.email} disabled />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <textarea 
                  {...field}
                  rows={3}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className={`${isMobile ? 'flex flex-col gap-3 pb-10' : 'flex justify-end gap-3'} mt-6`}>
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel}
            className={isMobile ? 'order-2' : ''}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={loading}
            className={isMobile ? 'order-1' : ''}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
