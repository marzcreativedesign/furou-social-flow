import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { processImages } from '@/utils/image/compress';

export const StorageService = {
  /**
   * Upload an image to Supabase Storage
   */
  async uploadImage(
    file: File,
    bucket: string,
    folder: string = '',
    options = { compress: true }
  ): Promise<{ url: string; path: string } | null> {
    try {
      // Check if the bucket exists and create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucket);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucket, { public: true });
      }
      
      // Process image if compression is enabled
      let processedFile = file;
      if (options.compress && file.type.startsWith('image/')) {
        const processed = await processImages([file]);
        processedFile = processed[0];
      }
      
      // Generate a unique filename
      const fileExt = processedFile.name.split('.').pop();
      const fileName = `${folder ? `${folder}/` : ''}${uuidv4()}.${fileExt}`;
      
      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, processedFile, { upsert: true });
        
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
        
      return {
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  },
  
  /**
   * Upload multiple images to Supabase Storage
   */
  async uploadImages(
    files: FileList | File[],
    bucket: string,
    folder: string = '',
    options = { compress: true }
  ): Promise<Array<{ url: string; path: string }>> {
    try {
      // Check if the bucket exists and create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucket);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucket, { public: true });
      }
      
      // Process images if compression is enabled
      let filesToUpload: File[] = Array.from(files);
      if (options.compress) {
        filesToUpload = await processImages(filesToUpload);
      }
      
      // Upload all files
      const results = await Promise.all(
        filesToUpload.map(async (file) => {
          // Generate a unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${folder ? `${folder}/` : ''}${uuidv4()}.${fileExt}`;
          
          // Upload file
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, { upsert: true });
            
          if (error) throw error;
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);
            
          return {
            url: urlData.publicUrl,
            path: data.path
          };
        })
      );
      
      return results;
    } catch (error) {
      console.error('Error uploading images:', error);
      return [];
    }
  }
};

/**
 * Envia uma imagem de evento para o storage
 */
export const uploadEventImage = async (file: File) => {
  return await uploadImage(file, 'events');
};
