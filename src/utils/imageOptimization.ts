/**
 * Image optimization utilities to improve performance
 */

/**
 * Loads an image and returns a promise that resolves when the image is loaded
 * @param src Image source URL
 * @returns Promise that resolves with the image element when loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Optimizes image loading by setting width and height to prevent layout shift
 * @param imgElement Image element to optimize
 * @param src Image source URL
 */
export const setupImageWithPlaceholder = (
  imgElement: HTMLImageElement,
  src: string,
  width?: number,
  height?: number
): void => {
  if (!imgElement) return;
  
  // Add placeholder class while image loads
  imgElement.classList.add('opacity-0');
  
  const parent = imgElement.parentElement;
  if (parent) {
    parent.classList.add('img-placeholder');
  }
  
  // Set explicit dimensions if provided
  if (width) imgElement.width = width;
  if (height) imgElement.height = height;
  
  // Load the image in the background
  preloadImage(src)
    .then(() => {
      imgElement.src = src;
      imgElement.classList.remove('opacity-0');
      imgElement.classList.add('opacity-100');
      
      if (parent) {
        parent.classList.remove('img-placeholder');
      }
    })
    .catch((error) => {
      console.error('Failed to load image:', error);
      // Keep placeholder visible on error
    });
};

/**
 * Creates a responsive lazy-loaded image component that prevents layout shift
 * @param container Container element to add the image to
 * @param src Image source URL
 * @param alt Alt text for the image
 * @param aspectRatio Desired aspect ratio (e.g., "16/9")
 */
export const createLazyImage = (
  container: HTMLElement,
  src: string,
  alt: string,
  aspectRatio?: string
): void => {
  if (!container) return;
  
  // Create wrapper with proper aspect ratio to prevent layout shift
  container.style.position = 'relative';
  if (aspectRatio) {
    container.style.aspectRatio = aspectRatio;
  }
  
  // Create image element
  const img = document.createElement('img');
  img.alt = alt;
  img.classList.add('w-full', 'h-full', 'object-cover', 'transition-opacity', 'duration-300', 'opacity-0');
  container.appendChild(img);
  
  // Set up intersection observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setupImageWithPlaceholder(img, src);
        observer.unobserve(container);
      }
    });
  });
  
  observer.observe(container);
};

export default {
  preloadImage,
  setupImageWithPlaceholder,
  createLazyImage
};
