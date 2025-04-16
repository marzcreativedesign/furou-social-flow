
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { GalleryImage } from "@/components/event-detail/gallery/types";

export const useEventGallery = (eventId: string) => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEventImages = async () => {
    try {
      setLoading(true);
      
      // Check if event-gallery bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'event-gallery')) {
        // If running first time, create bucket
        await supabase.storage.createBucket('event-gallery', { public: true });
        setLoading(false);
        setImages([]);
        return;
      }
      
      // List all files in the event directory
      const { data: files, error } = await supabase.storage
        .from('event-gallery')
        .list(`${eventId}`, {
          sortBy: { column: 'created_at', order: 'desc' }
        });
        
      if (error) throw error;
      
      if (!files || files.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }
      
      // Get metadata and URLs for each image
      const imageList = await Promise.all(
        files.map(async (file) => {
          const filePath = `${eventId}/${file.name}`;
          const userId = file.name.split('-')[0];
          
          const { data: urlData } = supabase.storage
            .from('event-gallery')
            .getPublicUrl(filePath);
            
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', userId)
            .single();
            
          return {
            id: file.id || uuidv4(),
            filename: file.name,
            src: urlData.publicUrl,
            user_id: userId,
            event_id: eventId,
            created_at: file.created_at || new Date().toISOString(),
            user: {
              fullName: userData?.full_name,
              avatarUrl: userData?.avatar_url
            }
          };
        })
      );
      
      setImages(imageList);
      
    } catch (error) {
      console.error("Error fetching event images:", error);
      toast({
        title: "Erro ao carregar imagens",
        description: "Não foi possível carregar as imagens do evento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    
    try {
      // Check if event-gallery bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'event-gallery')) {
        await supabase.storage.createBucket('event-gallery', { public: true });
      }
      
      const uploadPromises = files.map(async (file) => {
        // Create filename with format: user_id-uuid.ext
        const fileExt = file.name.split('.').pop();
        const fileName = `${eventId}/${uuidv4()}-${uuidv4()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-gallery')
          .upload(fileName, file, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        return fileName;
      });
      
      await Promise.all(uploadPromises);
      
      toast({
        title: "Imagens enviadas",
        description: "Suas fotos foram adicionadas à galeria"
      });
      
      // Refresh gallery
      fetchEventImages();
      
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Erro ao enviar imagens",
        description: "Não foi possível enviar suas fotos",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (image: GalleryImage) => {
    try {
      const { data, error } = await supabase.storage
        .from('event-gallery')
        .download(`${eventId}/${image.filename}`);
        
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename.split('-').slice(1).join('-');
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Erro ao baixar imagem",
        description: "Não foi possível baixar a foto",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventImages();
    }
  }, [eventId]);

  return {
    images,
    loading,
    uploading,
    handleUpload,
    handleDownload,
    refreshGallery: fetchEventImages
  };
};
