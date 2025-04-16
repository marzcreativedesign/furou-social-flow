
import { Download, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OptimizedImage from "../../OptimizedImage";
import { GalleryImage } from "./types";

interface GalleryImageDialogProps {
  image: GalleryImage | null;
  onClose: () => void;
  onDownload: (image: GalleryImage) => void;
}

const GalleryImageDialog = ({ image, onClose, onDownload }: GalleryImageDialogProps) => {
  if (!image) return null;

  return (
    <Dialog open={!!image} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-screen-md p-0 overflow-hidden" aria-describedby="gallery-image-description">
        <div className="relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-black/50 text-white border-none hover:bg-black/70"
              onClick={() => onDownload(image)}
            >
              <Download size={20} />
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="bg-black/50 text-white border-none hover:bg-black/70"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
          <OptimizedImage 
            src={image.src} 
            alt="Gallery fullscreen" 
            className="w-full max-h-[80vh] object-contain"
          />
          <div className="p-4 bg-background">
            <p className="font-medium">{image.user?.fullName || "Usuário"}</p>
            <p className="text-xs text-muted-foreground" id="gallery-image-description">
              {new Date(image.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryImageDialog;
