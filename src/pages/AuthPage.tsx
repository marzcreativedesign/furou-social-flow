import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailAuthForm from "@/components/auth/EmailAuthForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const AuthPage = () => {
  const { signIn, signUp, resetPassword, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isReset = searchParams.get("reset") === "true";
  const location = useLocation();

  useEffect(() => {
    if (isReset) {
      setShowResetForm(true);
    }
  }, [isReset]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const returnPath = location.state?.from || '/home';
      navigate(returnPath);
    }
  }, [user, navigate, location]);

  // Check if we need to show login or signup tab based on URL
  useEffect(() => {
    if (location.pathname.includes("login")) {
      setActiveTab("login");
    } else if (location.pathname.includes("signup")) {
      setActiveTab("signup");
    }
  }, [location]);

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    if (!fullName) {
      toast.error("Nome completo é obrigatório");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{showResetForm ? "Recuperar Senha" : "Entrar ou Cadastrar"}</CardTitle>
          <CardDescription>
            {showResetForm 
              ? "Digite seu email para receber as instruções de recuperação"
              : "Acesse sua conta ou crie uma nova para continuar"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showResetForm ? (
            <ResetPasswordForm 
              onSubmit={handleResetPassword}
              onBackToLogin={() => setShowResetForm(false)}
              isLoading={isLoading}
            />
          ) : (
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <EmailAuthForm 
                  isSignUp={false}
                  setIsSignUp={() => setActiveTab("signup")}
                  onBackClick={() => {}}
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  onForgotPassword={() => setShowResetForm(true)}
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <EmailAuthForm 
                  isSignUp={true}
                  setIsSignUp={() => setActiveTab("login")}
                  onBackClick={() => {}}
                  onSubmit={handleSignUp}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
