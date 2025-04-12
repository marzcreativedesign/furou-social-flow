
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import EmailAuthForm from "@/components/auth/EmailAuthForm";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import AuthFooter from "@/components/auth/AuthFooter";

const Login = () => {
  const { signIn, signUp, signInWithGoogle, signInWithApple, isLoading } = useAuth();
  const [emailLogin, setEmailLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailSubmit = async (email: string, password: string) => {
    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);
      
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Por favor, confirme seu e-mail para fazer login");
        } else if (error.message.includes("Invalid login credentials")) {
          toast.error("E-mail ou senha incorretos");
        } else if (error.message.includes("User already registered")) {
          toast.error("Este e-mail já está cadastrado");
          setIsSignUp(false); // Mudar para login
        } else {
          toast.error(`Erro: ${error.message}`);
        }
        return;
      }

      if (isSignUp) {
        toast.success("Registro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.");
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  const handleAuthProvider = async (provider: string) => {
    if (provider === "email") {
      setEmailLogin(true);
      return;
    }

    if (provider === "google") {
      await signInWithGoogle();
      return;
    }

    if (provider === "apple") {
      await signInWithApple();
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-primary">Furou?!</h1>
            <p className="text-muted-foreground">
              Conecte-se para organizar eventos incríveis com seus amigos
            </p>
          </div>

          {emailLogin ? (
            <EmailAuthForm 
              isSignUp={isSignUp}
              setIsSignUp={setIsSignUp}
              onBackClick={() => setEmailLogin(false)}
              onSubmit={handleEmailSubmit}
              isLoading={isLoading}
            />
          ) : (
            <SocialAuthButtons 
              onGoogleClick={() => handleAuthProvider("google")}
              onAppleClick={() => handleAuthProvider("apple")}
              onEmailClick={() => handleAuthProvider("email")}
              isLoading={isLoading}
            />
          )}

          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

export default Login;
