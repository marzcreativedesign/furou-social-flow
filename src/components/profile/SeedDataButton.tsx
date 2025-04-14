
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database } from "@/components/ui/database";
import { useToast } from "@/components/ui/use-toast";
import { seedUserData } from "@/utils/seedUserData";
import { useAuth } from "@/contexts/AuthContext";

export const SeedDataButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSeedData = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerar dados de teste.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await seedUserData(user.id);
      
      if (result.success) {
        toast({
          title: "Dados gerados com sucesso!",
          description: `Foram criados ${result.eventCount} eventos, ${result.groupCount} grupos e ${result.notificationCount} notificações.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar os dados de teste. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar os dados de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      onClick={handleSeedData}
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
          Gerando...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Gerar dados de teste
        </>
      )}
    </Button>
  );
};
