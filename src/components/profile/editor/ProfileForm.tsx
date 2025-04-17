
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProfileAvatar from "./ProfileAvatar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

type ProfileFormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  profile: {
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    email: string;
  };
  onSubmit: (values: ProfileFormValues) => Promise<void>;
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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || null,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-4">
          <ProfileAvatar 
            url={avatarPreview || ''} 
            email={profile.email} 
            onAvatarChange={onAvatarChange} 
          />
          <p className="text-sm text-muted-foreground mt-2">
            Clique na imagem para alterar
          </p>
        </div>

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobre mim</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Conte um pouco sobre você" 
                  className="resize-none" 
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>Alterar senha</Label>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
        </div>

        {showPassword && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua senha atual" {...field} />
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
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Digite sua nova senha" {...field} />
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
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirme sua nova senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar alterações'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
