
import { useState, useRef } from "react";
import { Share2, Copy, Facebook, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventShareButtonProps {
  eventId: string;
  eventTitle: string;
  eventUrl: string;
  variant?: "default" | "secondary" | "outline" | "prominent";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

const EventShareButton = ({ 
  eventId, 
  eventTitle, 
  eventUrl,
  variant = "secondary",
  size = "sm",
  showText = true
}: EventShareButtonProps) => {
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link do evento foi copiado para sua área de transferência"
      });
    });
  };
  
  const handleShareVia = (platform: string) => {
    const eventURLEncoded = encodeURIComponent(eventUrl);
    let shareURL = '';
    
    switch (platform) {
      case 'facebook':
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${eventURLEncoded}`;
        break;
      case 'twitter':
        shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Junte-se a mim no evento: ${eventTitle} (ID: ${eventId})`)}&url=${eventURLEncoded}`;
        break;
      case 'email':
        shareURL = `mailto:?subject=${encodeURIComponent(`Convite para: ${eventTitle}`)}&body=${encodeURIComponent(`Olá! Venha participar deste evento comigo: ${eventTitle} (ID: ${eventId})\n\n${eventUrl}`)}`;
        break;
      default:
        break;
    }
    
    if (shareURL) {
      window.open(shareURL, '_blank');
    }
  };
  
  if (variant === "prominent") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            size={size}
            className="font-medium bg-gradient-to-r from-[#FF8A1E] to-[#FFA756] hover:from-[#FF7A00] hover:to-[#FF9633] text-white shadow-md flex items-center gap-2"
          >
            <Share2 size={16} />
            {showText && "Compartilhar"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-card dark:border-[#2C2C2C]" align="end">
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer dark:hover:bg-muted">
            <Copy className="mr-2 h-4 w-4" />
            <span className="dark:text-[#EDEDED]">Copiar link</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareVia('facebook')} className="cursor-pointer dark:hover:bg-muted">
            <Facebook className="mr-2 h-4 w-4" />
            <span className="dark:text-[#EDEDED]">Facebook</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareVia('twitter')} className="cursor-pointer dark:hover:bg-muted">
            <Twitter className="mr-2 h-4 w-4" />
            <span className="dark:text-[#EDEDED]">Twitter</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShareVia('email')} className="cursor-pointer dark:hover:bg-muted">
            <Mail className="mr-2 h-4 w-4" />
            <span className="dark:text-[#EDEDED]">Email</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        className="flex items-center gap-1"
        onClick={handleShare}
      >
        <Share2 size={16} />
        {showText && "Compartilhar"}
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
