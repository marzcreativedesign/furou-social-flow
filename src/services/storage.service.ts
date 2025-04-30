
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/utils/image/compress";
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  static async uploadImage(file: File, bucket: string, folder?: string, options = { compress: true }) {
    try {
      let processedFile = file;
      
      if (options.compress) {
        // compressImage returns a Blob, convert it to File
        const compressedBlob = await compressImage(file);
        processedFile = new File(
          [compressedBlob], 
          file.name, 
          { 
            type: compressedBlob.type,
            lastModified: file.lastModified
          }
        );
      }
      
      const fileExt = file.name.split('.').pop();
      const filePath = folder 
        ? `${folder}/${uuidv4()}.${fileExt}` 
        : `${uuidv4()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, processedFile);
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return { url: publicUrl, path: data.path };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
  
  static async uploadImages(files: FileList | File[], bucket: string, folder?: string, options = { compress: true }) {
    try {
      const uploadPromises = Array.from(files).map(file => 
        this.uploadImage(file, bucket, folder, options)
      );
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  }
  
  /**
   * Upload an event image to the appropriate bucket
   */
  static async uploadEventImage(file: File) {
    try {
      const result = await this.uploadImage(file, 'events', 'covers', { compress: true });
      return { publicUrl: result.url, error: null };
    } catch (error) {
      console.error("Error uploading event image:", error);
      return { publicUrl: null, error };
    }
  }
}
