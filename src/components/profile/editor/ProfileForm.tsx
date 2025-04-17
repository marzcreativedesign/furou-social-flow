
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

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

interface ProfileFormProps {
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    bio: string | null;
    avatar_url: string | null;
  };
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  onCancel: () => void;
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isMobile?: boolean;
}

const ProfileForm = ({ 
  profile, 
  onSubmit, 
  onCancel, 
  avatarPreview,
  onAvatarChange,
  isSubmitting,
  isMobile = false
}: ProfileFormProps) => {
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

  useEffect(() => {
    form.reset({
      full_name: profile.full_name || '',
      bio: profile.bio || '',
      avatar_url: profile.avatar_url || null,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [profile, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background dark:border-[#1E1E1E]">
              <AvatarImage 
                src={avatarPreview || undefined} 
                alt={profile.full_name || ''}
              />
              <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                {profile.full_name?.substring(0, 2).toUpperCase() || profile.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
              <div className="relative inline-block">
                <label htmlFor="avatar-upload" className="bg-primary text-white p-3 rounded-full hover:bg-accent transition-colors cursor-pointer flex items-center justify-center w-10 h-10">
                  <Camera size={20} />
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
              </div>
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
          <FormLabel htmlFor="email" className="dark:text-[#EDEDED]">Email</FormLabel>
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
        
        <div className={`${isMobile ? 'flex flex-col gap-3 pb-10' : 'flex justify-end gap-3'} mt-6`}>
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel}
            className={`${isMobile ? 'order-2' : ''} dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]`}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className={`${isMobile ? 'order-1' : ''} dark:bg-primary dark:text-white dark:hover:bg-accent`}
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            {isSubmitting || form.formState.isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
