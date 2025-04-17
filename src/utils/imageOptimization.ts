
/**
 * Image optimization utilities to improve performance and reduce bandwidth usage
 */

// Tamanho máximo para imagens por padrão (em bytes)
const MAX_IMAGE_SIZE = 500 * 1024; // 500KB

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
  img.loading = 'lazy'; // Use native lazy loading
  img.decoding = 'async'; // Use async decoding
  container.appendChild(img);
  
  // Set up intersection observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setupImageWithPlaceholder(img, src);
        observer.unobserve(container);
      }
    });
  }, {
    rootMargin: '200px', // Start loading when image is 200px from viewport
    threshold: 0
  });
  
  observer.observe(container);
};

/**
 * Comprime uma imagem antes de fazer upload
 * @param file Arquivo de imagem a ser comprimido
 * @param options Opções de compressão
 * @returns Promise que resolve para o arquivo comprimido (Blob)
 */
export const compressImage = async (
  file: File,
  options: {
    maxSize?: number;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<Blob> => {
  const { 
    maxSize = MAX_IMAGE_SIZE,
    maxWidth = 1920, 
    maxHeight = 1080,
    quality = 0.8,
    format = 'webp'
  } = options;
  
  // Se a imagem já é menor que o tamanho máximo, retorna o arquivo original
  if (file.size <= maxSize) {
    console.log('Image already small enough, skipping compression');
    return file;
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calcular as dimensões mantendo a proporção
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }
      
      // Criar um canvas para redimensionar a imagem
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Não foi possível criar o contexto do canvas'));
        return;
      }
      
      // Desenhar a imagem no canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Converter para o formato desejado
      let mimeType: string;
      switch (format) {
        case 'webp':
          mimeType = 'image/webp';
          break;
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        default:
          mimeType = 'image/webp';
      }
      
      // Obter o blob comprimido
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao comprimir imagem'));
            return;
          }
          
          console.log(`Image compressed: Original size: ${file.size / 1024}KB, New size: ${blob.size / 1024}KB`);
          resolve(blob);
        },
        mimeType,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Erro ao carregar a imagem para compressão'));
    };
    
    // Carregar a imagem a partir do arquivo
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Verifica se o navegador suporta o formato WebP
 * @returns Promise que resolve para true se o navegador suportar WebP
 */
export const supportsWebP = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  });
};

export default {
  preloadImage,
  setupImageWithPlaceholder,
  createLazyImage,
  compressImage,
  supportsWebP
};
