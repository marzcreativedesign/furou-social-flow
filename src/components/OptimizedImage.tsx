
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: string;
  lazyLoad?: boolean; // Nova propriedade para controlar o lazy loading
  placeholderSrc?: string; // URL para imagem de placeholder
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  aspectRatio,
  lazyLoad = true, // Por padrão, habilita lazy loading
  placeholderSrc = '/placeholder.svg'
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [actualSrc, setActualSrc] = useState(lazyLoad ? placeholderSrc : src);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Se não tiver src, não faz nada
    if (!src) {
      return;
    }

    // Reset state when src changes
    setLoaded(false);
    
    // Se não utilizar lazy loading, carrega a imagem diretamente
    if (!lazyLoad) {
      setActualSrc(src);
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
      return () => { img.onload = null; };
    }
    
    // Configura o IntersectionObserver para lazy loading
    if (wrapperRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Quando o elemento estiver visível, carrega a imagem
          if (entry.isIntersecting) {
            setActualSrc(src);
            
            // Pré-carrega a imagem
            const img = new Image();
            img.src = src;
            img.onload = () => setLoaded(true);
            
            // Para de observar o elemento após carregá-lo
            if (observerRef.current) {
              observerRef.current.unobserve(entry.target);
            }
          }
        });
      }, {
        rootMargin: '200px', // Carrega a imagem quando estiver a 200px de distância da área visível
        threshold: 0
      });
      
      observerRef.current.observe(wrapperRef.current);
    }
    
    return () => {
      // Limpa o observer quando o componente for desmontado
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [src, lazyLoad, placeholderSrc]);

  const wrapperStyle = {
    position: 'relative' as const,
    aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined
  };

  return (
    <div 
      ref={wrapperRef} 
      className={`relative ${!loaded ? 'bg-muted/30 animate-pulse' : ''}`}
      style={wrapperStyle}
    >
      {src && (
        <img
          ref={imgRef}
          src={actualSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            if (actualSrc === src) {
              setLoaded(true);
            }
          }}
          decoding="async" // Hints to browser to decode the image asynchronously
          loading={lazyLoad ? "lazy" : "eager"} // Usa o lazy loading nativo do navegador também
        />
      )}
    </div>
  );
};

export default OptimizedImage;
