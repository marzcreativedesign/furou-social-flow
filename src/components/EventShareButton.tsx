
import { useState, useRef } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface EventShareButtonProps {
  eventId: string;
  eventTitle: string;
  eventUrl: string;
}

const EventShareButton = ({ eventId, eventTitle, eventUrl }: EventShareButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const shareTextRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const shareMessage = `Conto com você, não fure esse evento! Id#${eventId} Link para o evento: ${eventUrl}`;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventTitle,
        text: shareMessage,
        url: eventUrl
      })
      .catch((error) => {
        console.log('Erro ao compartilhar:', error);
        setIsDialogOpen(true);
      });
    } else {
      setIsDialogOpen(true);
    }
  };
  
  const copyToClipboard = () => {
    if (shareTextRef.current) {
      shareTextRef.current.select();
      document.execCommand('copy');
      toast({
        title: "Link copiado",
        description: "Texto de convite copiado para a área de transferência"
      });
      setIsDialogOpen(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="secondary" 
        size="sm"
        className="flex items-center gap-1"
        onClick={handleShare}
      >
        <Share2 size={16} />
        Compartilhar
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copie o texto abaixo para convidar seus amigos:
            </p>
            <textarea
              ref={shareTextRef}
              readOnly
              value={shareMessage}
              className="w-full min-h-[100px] p-3 border rounded-md text-sm"
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={copyToClipboard}>Copiar texto</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventShareButton;
