
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import ProfileAvatar from "./ProfileAvatar";

const formSchema = z.object({
  full_name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres"),
  bio: z.string().optional(),
  avatar_url: z.string().optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  const hasPasswordChange = data.currentPassword || data.newPassword || data.confirmPassword;
  if (!hasPasswordChange) return true;
  return !!data.currentPassword && !!data.newPassword && !!data.confirmPassword;
}, {
  message: "Todos os campos de senha devem ser preenchidos para alterar a senha",
  path: ["newPassword"],
}).refine((data) => {
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
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const ProfileForm = ({ 
  profile, 
  onSubmit, 
  onCancel, 
  avatarPreview,
  onAvatarChange,
  isSubmitting 
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfileAvatar
          avatarPreview={avatarPreview}
          fullName={profile.full_name}
          email={profile.email}
          onAvatarChange={onAvatarChange}
        />
        
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
            onClick={onCancel}
            className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="dark:bg-primary dark:text-white dark:hover:bg-accent"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProfileForm;
