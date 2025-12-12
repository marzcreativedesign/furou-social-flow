
import { useState, useMemo, useCallback } from "react";
import { getEventGallery } from "@/data/mockData";
import { GalleryImage } from "@/components/event-detail/gallery/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useEventGallery = (eventId: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<GalleryImage[]>([]);

  // Get mock gallery images
  const mockImages = useMemo(() => {
    return getEventGallery(eventId) as GalleryImage[];
  }, [eventId]);

  // Combine mock and additional images
  const images = useMemo(() => {
    return [...mockImages, ...additionalImages];
  }, [mockImages, additionalImages]);

  const handleUpload = useCallback(async (files: File[]) => {
    if (!user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para adicionar fotos ao evento",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mock uploaded images
    const newImages: GalleryImage[] = files.map((file, index) => ({
      id: `uploaded-${Date.now()}-${index}`,
      src: URL.createObjectURL(file),
      user_id: user.id,
      event_id: eventId,
      filename: `${user.id}-${file.name}`,
      created_at: new Date().toISOString(),
      user: {
        fullName: user.user_metadata?.full_name || "Você",
        avatarUrl: user.user_metadata?.avatar_url || null
      }
    }));

    setAdditionalImages(prev => [...prev, ...newImages]);
    setUploading(false);

    toast({
      title: "Imagens enviadas",
      description: `${files.length} foto(s) adicionada(s) à galeria`
    });
  }, [eventId, user, toast]);

  const handleDownload = useCallback(async (image: GalleryImage) => {
    try {
      // For mock images, just open in new tab
      window.open(image.src, '_blank');
      
      toast({
        title: "Download iniciado",
        description: "A imagem será baixada em instantes"
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Erro ao baixar imagem",
        description: "Não foi possível baixar a foto",
        variant: "destructive"
      });
    }
  }, [toast]);

  const refreshGallery = useCallback(() => {
    // Mock refresh - nothing to do since data is static
  }, []);

  return {
    images,
    loading: false,
    uploading,
    handleUpload,
    handleDownload,
    refreshGallery
  };
};
