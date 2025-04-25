
import { useState } from "react";
import { Copy, Send, Check } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InviteDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string) => Promise<boolean>;
}

export const InviteDialog = ({ groupId, open, onOpenChange, onInvite }: InviteDialogProps) => {
  const [emailInvite, setEmailInvite] = useState("");
  const inviteLink = `https://furou.app/convite/${groupId}/${Date.now()}`;

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleInvite = async () => {
    const success = await onInvite(emailInvite);
    if (success) {
      setEmailInvite("");
      onOpenChange(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Convidar para o grupo</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Convidar por e-mail</p>
            <div className="flex gap-2">
              <Input 
                placeholder="email@exemplo.com" 
                value={emailInvite}
                onChange={e => setEmailInvite(e.target.value)}
              />
              <Button 
                onClick={handleInvite}
                disabled={!emailInvite || !validateEmail(emailInvite)}
              >
                <Send className="h-4 w-4 mr-2" /> 
                Enviar
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Ou compartilhe o link</p>
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly />
              <Button variant="outline" onClick={copyInviteLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            <Check className="mr-2 h-4 w-4" />
            Concluído
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
