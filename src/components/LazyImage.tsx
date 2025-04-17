
import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderSrc?: string;
  aspectRatio?: string;
}

const LazyImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSrc = '/placeholder.svg',
  aspectRatio
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Convert image URL to WebP if not already in WebP format
  const optimizeImageUrl = (url: string): string => {
    if (!url) return placeholderSrc;
    
    // If using Supabase Storage, we can use built-in transformations
    // This is a placeholder - adjust according to your actual implementation
    if (url.includes('storage.googleapis.com') || url.includes('storage.supabase.co')) {
      // Add WebP transformation param if your service supports it
      // e.g., return `${url}?format=webp&quality=80`;
    }
    
    return url;
  };

  useEffect(() => {
    // Set up intersection observer to detect when image is in viewport
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
        // Disconnect observer once image is in view
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    }, {
      // Root margin makes image load slightly before it's in view
      rootMargin: '200px 0px',
      threshold: 0.01
    });

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    if (imgRef.current) {
      imgRef.current.src = placeholderSrc;
    }
  };

  const wrapperStyle = {
    position: 'relative' as const,
    aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    backgroundColor: '#f3f4f6',
    overflow: 'hidden' as const
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${!isLoaded ? 'bg-muted/30 animate-pulse' : ''}`}
      style={wrapperStyle}
    >
      {isInView && (
        <img
          src={isInView ? optimizeImageUrl(src) : placeholderSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-cover`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="sr-only">Loading...</span>
          {/* Simple placeholder spinner */}
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
