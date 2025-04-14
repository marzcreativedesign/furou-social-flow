
import { useState } from "react";
import { Image as ImageIcon, X, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OptimizedImage from "./OptimizedImage";

type GalleryImageType = {
  id: string;
  src: string;
  userId: string;
  userName: string;
  timestamp: string;
};

type EventGalleryProps = {
  eventId: string;
  initialImages?: GalleryImageType[];
};

const EventGallery = ({ eventId, initialImages = [] }: EventGalleryProps) => {
  const [images, setImages] = useState<GalleryImageType[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImageType | null>(null);
  
  const handleAddPhotos = () => {
    // In a real app, this would open a file picker
    const mockNewImages: GalleryImageType[] = [
      {
        id: `img-${Date.now()}-1`,
        src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        userId: "1",
        userName: "Carlos Oliveira",
        timestamp: new Date().toISOString()
      },
      {
        id: `img-${Date.now()}-2`,
        src: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        userId: "1",
        userName: "Carlos Oliveira",
        timestamp: new Date().toISOString()
      }
    ];
    
    setImages([...images, ...mockNewImages]);
  };
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={handleAddPhotos}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar fotos
      </Button>
      
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="aspect-square bg-muted cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(image)}
            >
              <OptimizedImage 
                src={image.src} 
                alt="Event gallery" 
                className="w-full h-full object-cover"
                aspectRatio="1/1"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/20 rounded-xl">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">Sem fotos</h3>
          <p className="text-sm text-muted-foreground">
            Compartilhe momentos do evento adicionando fotos
          </p>
        </div>
      )}
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-screen-md p-0 overflow-hidden" aria-describedby="gallery-image-description">
          {selectedImage && (
            <div className="relative">
              <button 
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X size={20} />
              </button>
              <OptimizedImage 
                src={selectedImage.src} 
                alt="Gallery fullscreen" 
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="p-4 bg-background">
                <p className="font-medium">{selectedImage.userName}</p>
                <p className="text-xs text-muted-foreground" id="gallery-image-description">
                  {new Date(selectedImage.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventGallery;
