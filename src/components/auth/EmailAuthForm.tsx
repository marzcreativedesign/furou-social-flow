
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface EmailAuthFormProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  onBackClick: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const emailSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});

const EmailAuthForm = ({
  isSignUp,
  setIsSignUp,
  onBackClick,
  onSubmit,
  isLoading
}: EmailAuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      await onSubmit(values.email, values.password);
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>E-mail</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Senha</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  }
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSignUp && (
          <div className="flex justify-end">
            <Link to="/resetar-senha" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white rounded-full h-12"
        >
          {isLoading ? "Processando..." : isSignUp ? "Cadastrar" : "Entrar"}
        </Button>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp ? "Já tem uma conta? Entrar" : "Não tem conta? Cadastre-se"}
          </button>
        </div>

        <button
          onClick={onBackClick}
          type="button"
          className="w-full text-center text-sm text-primary hover:underline mt-4"
        >
          Voltar para outras opções de login
        </button>
      </form>
    </Form>
  );
};

export default EmailAuthForm;
