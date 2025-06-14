
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

export const PasswordChangeDialog = ({ open, onOpenChange, isMobile = false }: PasswordChangeDialogProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const Component = isMobile ? Drawer : Dialog;
  const ComponentContent = isMobile ? DrawerContent : DialogContent;
  const ComponentHeader = isMobile ? DrawerHeader : DialogHeader;
  const ComponentTitle = isMobile ? DrawerTitle : DialogTitle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso"
      });
      
      setPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Component open={open} onOpenChange={onOpenChange}>
      <ComponentContent>
        <ComponentHeader>
          <ComponentTitle>Alterar Senha</ComponentTitle>
        </ComponentHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </ComponentContent>
    </Component>
  );
};
