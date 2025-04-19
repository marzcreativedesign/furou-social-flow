
import { ImageCompressionOptions } from './types';
import { MAX_IMAGE_SIZE } from './constants';
import { resizeImageIfNeeded } from './resize';
import { determineOutputFormat } from './format';
import { loadImage } from './load';

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
  
  return new Promise(async (resolve, reject) => {
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      // Resize the image if needed
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
    } catch (error) {
      reject(error);
    }
  });
};

// Função para criar um arquivo a partir de um blob
export const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { type: blob.type });
};

// Função para processar várias imagens
export const processImages = async (
  files: FileList | File[],
  options: ImageCompressionOptions = {}
): Promise<File[]> => {
  const fileArray = Array.from(files);
  const processedFiles: File[] = [];
  
  for (const file of fileArray) {
    if (file.type.startsWith('image/')) {
      try {
        const compressedBlob = await compressImage(file, options);
        const compressedFile = blobToFile(compressedBlob, file.name);
        processedFiles.push(compressedFile);
      } catch (error) {
        console.error('Error processing image:', error);
        processedFiles.push(file); // Add original file if compression fails
      }
    } else {
      processedFiles.push(file); // Add non-image files without processing
    }
  }
  
  return processedFiles;
};
