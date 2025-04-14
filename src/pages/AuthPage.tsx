
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import EmailAuthForm from "@/components/auth/EmailAuthForm";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";

const AuthPage = () => {
  const { user } = useAuth();
  const { role, isLoading: roleLoading } = useRole();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState("credentials"); // "credentials", "profile"
  const navigate = useNavigate();

  // Profile data
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // Handle redirection based on user role
  useEffect(() => {
    if (user && !roleLoading) {
      if (authStep === "credentials") {
        // Check if user needs to complete profile
        checkProfileCompletion();
      } else if (authStep === "profile") {
        // User just completed profile setup, redirect based on role
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    }
  }, [user, roleLoading, role, authStep]);

  // Check if user needs to complete profile setup
  const checkProfileCompletion = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // If user has already completed their profile, redirect based on role
      if (profile && (profile.full_name || profile.username || profile.avatar_url)) {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        // User needs to complete profile
        setAuthStep("profile");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      // Default to profile completion step if there's an error
      setAuthStep("profile");
    }
  };

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
          ? "Conta criada com sucesso! Agora complete seu perfil." 
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Upload avatar if selected
      let avatarUrl = null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl;
      }
      
      // Update user profile
      const { error: updateError } = await supabase.from('profiles').update({
        full_name: fullName,
        username,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast.success("Perfil atualizado com sucesso!");
      
      // Check role for redirection
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      toast.error(`Erro ao salvar perfil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {authStep === "credentials" 
              ? (showEmailAuth 
                ? (isSignUp ? "Criar Conta" : "Entrar")
                : "Bem-vindo ao Furou?!")
              : "Complete seu perfil"}
          </CardTitle>
          <CardDescription>
            {authStep === "credentials"
              ? (showEmailAuth
                ? "Digite suas credenciais para continuar"
                : "Escolha como deseja continuar")
              : "Adicione seus dados para personalizar sua experiência"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authStep === "credentials" ? (
            showEmailAuth ? (
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
            )
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-2 border-primary">
                    <AvatarImage src={avatarPreview || ""} />
                    <AvatarFallback className="bg-muted">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Upload avatar</span>
                  </label>
                  <input 
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Clique para adicionar uma foto de perfil</p>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="@seu_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Sobre você</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Concluir cadastro"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
