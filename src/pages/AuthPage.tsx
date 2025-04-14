
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import EmailAuthForm from "@/components/auth/EmailAuthForm";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";

const AuthPage = () => {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleEmailAuth = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = isSignUp 
        ? await AuthService.signUpWithEmail(email, password)
        : await AuthService.signInWithEmail(email, password);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(isSignUp 
          ? "Conta criada com sucesso! Verifique seu e-mail para confirmar." 
          : "Login realizado com sucesso!");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro durante a autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await AuthService.signInWithGoogle();
      if (error) toast.error(error.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await AuthService.signInWithApple();
      if (error) toast.error(error.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {showEmailAuth 
              ? (isSignUp ? "Criar Conta" : "Entrar")
              : "Bem-vindo ao Furou?!"}
          </CardTitle>
          <CardDescription>
            {showEmailAuth
              ? "Digite suas credenciais para continuar"
              : "Escolha como deseja continuar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showEmailAuth ? (
            <EmailAuthForm
              isSignUp={isSignUp}
              setIsSignUp={setIsSignUp}
              onBackClick={() => setShowEmailAuth(false)}
              onSubmit={handleEmailAuth}
              isLoading={isLoading}
            />
          ) : (
            <SocialAuthButtons
              onGoogleClick={handleGoogleAuth}
              onAppleClick={handleAppleAuth}
              onEmailClick={() => setShowEmailAuth(true)}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
