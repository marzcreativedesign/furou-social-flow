
import { Image as ImageIcon } from "lucide-react";
import OptimizedImage from "../../OptimizedImage";
import { GalleryImage } from "./types";
import { useEffect, useRef, useState } from "react";

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  loading?: boolean;
}

const GalleryGrid = ({ images, onImageClick, loading }: GalleryGridProps) => {
  // Estado para controlar quais imagens estão visíveis para lazy loading
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Implementa lazy loading para galeria de imagens usando IntersectionObserver
  useEffect(() => {
    // Se não tiver imagens ou estiver carregando, não faz nada
    if (loading || images.length === 0) {
      return;
    }
    
    // Inicialmente, mostra apenas as primeiras 6 imagens
    setVisibleImages(images.slice(0, Math.min(6, images.length)));
    
    // Se não tiver mais imagens, não precisa observar
    if (images.length <= 6) {
      return;
    }
    
    // Configura o observer para detectar quando a galeria está visível e carregar mais imagens
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Quando a galeria estiver visível, carrega todas as imagens
          setVisibleImages(images);
          // Para de observar após carregar todas
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px',  // Começa a carregar quando estiver a 100px da área visível
      threshold: 0.1
    });
    
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    
    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, [images, loading]);

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
    <div className="grid grid-cols-3 gap-1" ref={gridRef}>
      {visibleImages.map((image) => (
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
            lazyLoad={true}
          />
        </div>
      ))}
      {/* Placeholders para imagens que ainda não foram carregadas */}
      {images.length > visibleImages.length && (
        <div className="col-span-3 text-center py-2 text-sm text-muted-foreground">
          Carregando mais imagens...
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
