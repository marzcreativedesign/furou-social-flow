
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const AuthPage = () => {
  const [email, setEmail] = useState("teste@furou.com");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("Usuário de Teste");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Usuário criado com sucesso!");
      // Automatic login after signup
      await handleLogin();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
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
          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input 
                  id="fullName"
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo" 
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={mode === "login" ? handleLogin : handleSignUp} 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading 
                  ? (mode === "login" ? "Entrando..." : "Cadastrando...") 
                  : (mode === "login" ? "Entrar" : "Cadastrar")}
              </Button>
              <Button 
                onClick={() => setMode(mode === "login" ? "signup" : "login")} 
                variant="ghost"
                className="w-full"
              >
                {mode === "login" 
                  ? "Não tem conta? Cadastre-se" 
                  : "Já tem uma conta? Faça login"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
