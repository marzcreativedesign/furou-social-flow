
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { seedDataForEmail } from "@/utils/seedUserData";

interface SeedTestEmailButtonProps {
  email?: string;
}

export const SeedTestEmailButton = ({ email = "teste@furou.com" }: SeedTestEmailButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await seedDataForEmail(email);
      
      if (result.success) {
        toast({
          title: "Dados gerados com sucesso!",
          description: `Foram criados dados de teste para o usuário ${email}.`,
        });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Não foi possível gerar os dados de teste. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error seeding data:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao gerar os dados de teste.",
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
          Gerando dados para {email}...
        </>
      ) : (
        <>
          Gerar dados para {email}
        </>
      )}
    </Button>
  );
};
