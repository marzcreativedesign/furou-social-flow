
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: string;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  aspectRatio
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!src) {
      return;
    }

    // Reset state when src changes
    setLoaded(false);
    
    // Create new image to preload
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setLoaded(true);
    };
    
    return () => {
      img.onload = null;
    };
  }, [src]);

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
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default OptimizedImage;
