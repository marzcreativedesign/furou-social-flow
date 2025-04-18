
import { ImageCompressionOptions } from './types';
import { MAX_IMAGE_SIZE } from './constants';
import { resizeImageIfNeeded } from './resize';
import { determineOutputFormat } from './format';

export const compressImage = async (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<Blob> => {
  const { 
    maxSize = MAX_IMAGE_SIZE,
    quality = 0.8
  } = options;
  
  if (file.size <= maxSize) {
    console.log('Image already small enough, skipping compression');
    return file;
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      resizeImageIfNeeded(canvas, ctx, img);
      
      const mimeType = await determineOutputFormat(file.type, options);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          console.log(`Image compressed: Original size: ${file.size / 1024}KB, New size: ${blob.size / 1024}KB`);
          resolve(blob);
        },
        mimeType,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Error loading image for compression'));
    img.src = URL.createObjectURL(file);
  });
};
