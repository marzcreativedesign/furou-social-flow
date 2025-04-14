
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthPage = () => {
  const [email, setEmail] = useState("teste@furou.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Usuário de Teste"
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Update profile with full name
        await supabase
          .from('profiles')
          .update({ full_name: "Usuário de Teste" })
          .eq('id', data.user.id);

        toast.success("Usuário criado com sucesso!");
        navigate('/home');
      }
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
          <CardTitle>Login / Cadastro de Teste</CardTitle>
          <CardDescription>
            Utilize este formulário para criar ou logar com o usuário de teste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teste@furou.com" 
              />
            </div>
            <div>
              <Label>Senha</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
              />
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={handleLogin} 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <Button 
                onClick={handleSignUp} 
                variant="outline"
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? "Criando..." : "Cadastrar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
