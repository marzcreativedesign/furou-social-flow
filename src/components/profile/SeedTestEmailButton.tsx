import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { seedDataForEmail } from "@/utils/seed/seedUserData";

interface SeedTestEmailButtonProps {
  email: string;
}

export const SeedTestEmailButton = ({ email }: SeedTestEmailButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSeedTestData = async () => {
    setLoading(true);
    try {
      const result = await seedDataForEmail(email);
      
      if (result.success) {
        toast({
          title: "Dados de teste gerados com sucesso!",
          description: `Foram criados dados de teste para o usuário ${email}.`,
        });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Não foi possível gerar os dados de teste.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error seeding test data:", error);
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
      onClick={handleSeedTestData}
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
          <Mail className="h-4 w-4" />
          Gerar dados para {email}
        </>
      )}
    </Button>
  );
};
