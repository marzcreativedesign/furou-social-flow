
import { useState } from "react";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EventShareButtonProps {
  eventId: string;
  eventTitle: string;
  eventUrl: string;
}

const EventShareButton = ({ eventId, eventTitle, eventUrl }: EventShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    
    toast({
      title: "Link copiado",
      description: "O link do evento foi copiado para a área de transferência",
    });
    
    setOpen(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Confira este evento: ${eventTitle}`,
          url: eventUrl,
        });
      } catch (error) {
        // User likely cancelled the share operation
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback to dialog if Web Share API is not available
      setOpen(true);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        <span>Compartilhar</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar evento</DialogTitle>
            <DialogDescription>
              Copie o link abaixo para compartilhar este evento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={eventUrl}
                className="w-full"
              />
            </div>
            <Button type="button" size="sm" onClick={handleCopyLink}>
              Copiar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventShareButton;
