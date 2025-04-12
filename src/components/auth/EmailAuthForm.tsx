
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface EmailAuthFormProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  onBackClick: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const EmailAuthForm = ({
  isSignUp,
  setIsSignUp,
  onBackClick,
  onSubmit,
  isLoading
}: EmailAuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    // Validação básica
    if (!email.trim() || !password.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    await onSubmit(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
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
      </div>

      {!isSignUp && (
        <div className="flex justify-end">
          <Link to="/resetar-senha" className="text-sm text-primary hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
      )}

      <Button
        onClick={handleSubmit}
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
        className="w-full text-center text-sm text-primary hover:underline mt-4"
      >
        Voltar para outras opções de login
      </button>
    </div>
  );
};

export default EmailAuthForm;
