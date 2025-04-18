
export interface ImageCompressionOptions {
  maxSize?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export interface ImageDimensions {
  width: number;
  height: number;
}
