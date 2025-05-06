
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  lazyLoad?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  aspectRatio = "16/9",
  lazyLoad = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const fallbackImage = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3";
  
  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Handle image loading
  const handleLoad = () => setIsLoaded(true);
  const handleError = () => {
    console.error(`Error loading image: ${src}`);
    setError(true);
  };

  const imgSrc = (error || !src) ? fallbackImage : src;
  
  return (
    <div className={`relative ${!isLoaded ? 'bg-muted/30 animate-pulse' : ''}`} style={{ aspectRatio }}>
      <img
        src={imgSrc}
        alt={alt}
        loading={lazyLoad ? "lazy" : "eager"}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;
