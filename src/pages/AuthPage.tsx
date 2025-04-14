
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Esquema de validação para o formulário de login
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});

// Esquema de validação para o formulário de cadastro
const signupSchema = z.object({
  fullName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});

// Esquema de validação para o perfil
const profileSchema = z.object({
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
  bio: z.string().optional()
});

const AuthPage = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [completingProfile, setCompletingProfile] = useState(false);
  
  // Formulário de login
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  // Formulário de cadastro
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });
  
  // Formulário de perfil
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      bio: ""
    }
  });

  // Se o usuário já estiver logado e não estiver completando o perfil, redireciona para a página inicial
  if (user && !completingProfile) {
    return <Navigate to="/home" />;
  }

  // Função para lidar com o login
  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/home");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com o cadastro
  const handleSignUp = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Cadastro realizado com sucesso!");
        // Após o cadastro, o usuário já estará logado e precisamos salvar seu nome
        if (user) {
          // Aqui já podemos salvar o nome completo no perfil
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: data.fullName })
            .eq('id', user.id);
            
          if (profileError) {
            console.error("Erro ao salvar o nome completo:", profileError);
          }
          
          // Avança para a etapa de completar o perfil
          setCompletingProfile(true);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao fazer o cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para completar o perfil
  const handleProfileCompletion = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          bio: data.bio || "",
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) {
        toast.error("Erro ao salvar perfil: " + error.message);
      } else {
        toast.success("Perfil criado com sucesso!");
        setCompletingProfile(false);
        navigate('/home');
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao salvar o perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {completingProfile ? "Complete seu perfil" : 
             isSignUp ? "Criar uma conta" : "Bem-vindo de volta!"}
          </CardTitle>
          <CardDescription>
            {completingProfile ? "Adicione mais detalhes ao seu perfil" : 
             isSignUp ? "Preencha seus dados para criar sua conta" : "Entre com seu email e senha para continuar"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {completingProfile ? (
            // Formulário de conclusão do perfil
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleProfileCompletion)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Nome de usuário</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="seu_username"
                            className="pl-10"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Bio (opcional)</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Conte um pouco sobre você..."
                          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white rounded-full h-12 mt-6"
                >
                  {isLoading ? "Salvando..." : "Concluir cadastro"}
                </Button>
              </form>
            </Form>
          ) : isSignUp ? (
            // Formulário de cadastro
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignUp)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Nome completo</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="Seu nome completo"
                            className="pl-10"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
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
                  control={signupForm.control}
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
                          onClick={() => setShowPassword(!showPassword)}
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white rounded-full h-12 mt-6"
                >
                  {isLoading ? "Cadastrando..." : "Criar conta"}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="text-primary hover:underline"
                    >
                      Fazer login
                    </button>
                  </p>
                </div>
              </form>
            </Form>
          ) : (
            // Formulário de login
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
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
                  control={loginForm.control}
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
                          onClick={() => setShowPassword(!showPassword)}
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
                
                <div className="flex justify-end">
                  <Link to="/resetar-senha" className="text-sm text-primary hover:underline">
                    Esqueci minha senha
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white rounded-full h-12"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Ainda não tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-primary hover:underline"
                    >
                      Criar agora
                    </button>
                  </p>
                </div>
              </form>
            </Form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link to="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link to="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
