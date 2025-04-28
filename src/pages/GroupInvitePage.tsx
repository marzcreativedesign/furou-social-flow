
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GroupInvite, Group } from "@/types/group";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { GroupsService } from "@/services/groups.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GroupInvitePage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [invite, setInvite] = useState<GroupInvite | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        setLoading(true);
        
        if (!code) {
          throw new Error("Código de convite não encontrado");
        }

        // Verificar se o convite existe e é válido
        const { data, error } = await (supabase
          .from('group_invites') as any)
          .select(`
            *,
            group:group_id(*)
          `)
          .eq("invite_code", code)
          .single();

        if (error) {
          throw error;
        }
        
        // Verificar se o convite já expirou
        if (data.status === "expired" || new Date(data.expires_at) < new Date()) {
          setExpired(true);
          throw new Error("Este convite expirou");
        }
        
        if (data.status === "accepted") {
          throw new Error("Este convite já foi aceito");
        }
        
        setInvite(data as unknown as GroupInvite);
        setGroup(data.group as unknown as Group);

        // Marcar convite como visualizado
        await (supabase
          .from('group_invites') as any)
          .update({ viewed: true })
          .eq("invite_code", code);

      } catch (error: any) {
        console.error("Erro ao buscar convite:", error);
        toast.error(error.message || "Erro ao buscar convite");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvite();
  }, [code]);

  const handleAcceptInvite = async () => {
    if (!user) {
      // Redirecionar para login com redirecionamento de volta para esta página
      localStorage.setItem('redirectAfterLogin', `/convite/${code}`);
      navigate("/login");
      return;
    }
    
    if (!code) return;
    
    try {
      setAccepting(true);
      const { data, error } = await GroupsService.acceptInvite(code);
      
      if (error) {
        throw error;
      }
      
      toast.success("Convite aceito com sucesso!");
      
      // Redirecionar para a página do grupo
      setTimeout(() => {
        if (data && data.group) {
          navigate(`/grupos/${data.group.id}`);
        } else {
          navigate('/grupos');
        }
      }, 1000);
      
    } catch (error: any) {
      console.error("Erro ao aceitar convite:", error);
      toast.error(error.message || "Erro ao aceitar convite");
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="container mx-auto max-w-lg py-12 px-4">
        <Card>
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-2/3 mx-auto mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <Skeleton className="h-16 w-16 rounded-full mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!invite || !group || expired) {
    return (
      <div className="container mx-auto max-w-lg py-12 px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Convite Inválido</CardTitle>
            <CardDescription>
              Este convite não existe, expirou ou já foi utilizado.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-center mb-4">
              Peça a um administrador do grupo para enviar um novo convite.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/grupos")}>
              Ver meus grupos
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Convite para Grupo</CardTitle>
          <CardDescription>
            Você foi convidado para participar de um grupo
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center py-6">
          <div className="p-4 bg-background rounded-full border border-border mb-4">
            <Users className="text-primary w-12 h-12" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{group.name}</h2>
          
          {group.description && (
            <p className="text-center text-muted-foreground mb-6">
              {group.description}
            </p>
          )}
          
          {!user && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Você precisa estar logado para aceitar este convite. Clique no botão abaixo para fazer login.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {user ? (
            <Button 
              onClick={handleAcceptInvite} 
              disabled={accepting}
              size="lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              {accepting ? "Aceitando..." : "Aceitar Convite"}
            </Button>
          ) : (
            <Button 
              onClick={handleAcceptInvite} 
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Fazer Login e Aceitar
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GroupInvitePage;
