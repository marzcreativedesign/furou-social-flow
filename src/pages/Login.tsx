
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthFooter from "@/components/auth/AuthFooter";
import EmailAuthForm from "@/components/auth/EmailAuthForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

const Login = () => {
  const { user, signIn, signUp, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const location = useLocation();

  // Handle social logins (placeholder functions)
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Implement Google login logic
      toast.info("Login com Google não está disponível no momento");
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      // Implement Apple login logic
      toast.info("Login com Apple não está disponível no momento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailFormShow = () => {
    setShowEmailForm(true);
  };

  // Handle login form submission
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

  // Handle signup form submission
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
      } else {
        toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Instruções de recuperação enviadas para seu email");
        setShowResetForm(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If the user is already logged in, redirect to home
  if (user) {
    const returnPath = location.state?.from || '/';
    return <Navigate to={returnPath} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {showResetForm 
              ? "Recuperar Senha"
              : showEmailForm 
                ? (activeTab === "login" ? "Entrar" : "Cadastrar")
                : "Entrar ou Cadastrar"}
          </CardTitle>
          <CardDescription>
            {showResetForm 
              ? "Digite seu email para receber as instruções de recuperação"
              : showEmailForm 
                ? (activeTab === "login" 
                    ? "Acesse sua conta para continuar" 
                    : "Crie uma nova conta para continuar")
                : "Escolha como deseja continuar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showResetForm ? (
            <ResetPasswordForm 
              onSubmit={handleResetPassword}
              onBackToLogin={() => setShowResetForm(false)}
              isLoading={isLoading}
            />
          ) : showEmailForm ? (
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <EmailAuthForm 
                  isSignUp={false}
                  setIsSignUp={() => setActiveTab("signup")}
                  onBackClick={() => setShowEmailForm(false)}
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  onForgotPassword={() => setShowResetForm(true)}
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <EmailAuthForm 
                  isSignUp={true}
                  setIsSignUp={() => setActiveTab("login")}
                  onBackClick={() => setShowEmailForm(false)}
                  onSubmit={handleSignUp}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <>
              <SocialAuthButtons 
                onGoogleClick={handleGoogleLogin}
                onAppleClick={handleAppleLogin}
                onEmailClick={handleEmailFormShow}
                isLoading={isLoading}
              />
            </>
          )}
          
          {!showEmailForm && !showResetForm && <AuthFooter />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
