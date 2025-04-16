
import { Image as ImageIcon } from "lucide-react";
import OptimizedImage from "../../OptimizedImage";
import { GalleryImage } from "./types";

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  loading?: boolean;
}

const GalleryGrid = ({ images, onImageClick, loading }: GalleryGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-xl">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1 dark:text-[#EDEDED]">Sem fotos</h3>
        <p className="text-sm text-muted-foreground">
          Compartilhe momentos do evento adicionando fotos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {images.map((image) => (
        <div 
          key={image.id} 
          className="aspect-square bg-muted cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(image)}
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
  );
};

export default GalleryGrid;
