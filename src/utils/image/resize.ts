
import { MAX_IMAGE_DIMENSION } from './constants';
import { ImageDimensions } from './types';

export function calculateResizedDimensions(width: number, height: number): ImageDimensions {
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }
  }
  return { width, height };
}

export function resizeImageIfNeeded(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  image: HTMLImageElement
): boolean {
  const { width, height } = calculateResizedDimensions(
    image.naturalWidth,
    image.naturalHeight
  );

  if (width !== image.naturalWidth || height !== image.naturalHeight) {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0);
  return false;
}
