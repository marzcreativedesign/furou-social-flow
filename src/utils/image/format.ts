
import { ImageCompressionOptions } from './types';
import { MAX_IMAGE_SIZE } from './constants';

export const supportsWebP = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  });
};

export const determineOutputFormat = async (
  originalFormat: string,
  options?: Pick<ImageCompressionOptions, 'format'>
): Promise<string> => {
  if (options?.format) return `image/${options.format}`;
  if (await supportsWebP()) return 'image/webp';
  return originalFormat || 'image/jpeg';
};
