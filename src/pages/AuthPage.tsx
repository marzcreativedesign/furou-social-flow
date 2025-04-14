
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Create a schema for signup validation
const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Nome completo é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
});

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "Usuário de Teste",
      email: "teste@furou.com",
      password: "password123"
    }
  });

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Usuário criado com sucesso!");
      await handleLogin(values.email, values.password);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const credentials = email && password 
        ? { email, password } 
        : form.getValues();

      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate('/home');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Login" : "Cadastro"}</CardTitle>
          <CardDescription>
            {mode === "login" 
              ? "Entre com seu email e senha para acessar sua conta" 
              : "Crie sua conta para começar a usar o app"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input 
                  id="fullName"
                  type="text" 
                  {...form.register("fullName")}
                  placeholder="Seu nome completo" 
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                {...form.register("email")}
                placeholder="seu@email.com" 
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password"
                type="password" 
                {...form.register("password")}
                placeholder="••••••••" 
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                type="submit"
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading 
                  ? (mode === "login" ? "Entrando..." : "Cadastrando...") 
                  : (mode === "login" ? "Entrar" : "Cadastrar")}
              </Button>
              <Button 
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")} 
                variant="ghost"
                className="w-full"
              >
                {mode === "login" 
                  ? "Não tem conta? Cadastre-se" 
                  : "Já tem uma conta? Faça login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
