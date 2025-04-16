
import { useState, useEffect } from "react";
import { Image as ImageIcon, X, Plus, Download } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OptimizedImage from "../OptimizedImage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

type GalleryImage = {
  id: string;
  src: string;
  user_id: string;
  event_id: string;
  filename: string;
  created_at: string;
  user?: {
    fullName: string | null;
    avatarUrl: string | null;
  };
};

interface EventGalleryProps {
  eventId: string;
}

const EventGallery = ({ eventId }: EventGalleryProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Fetch images from storage
  useEffect(() => {
    fetchEventImages();
  }, [eventId]);
  
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
        
      if (error) {
        throw error;
      }
      
      if (!files || files.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }
      
      // Get metadata and URLs for each image
      const imageList = await Promise.all(
        files.map(async (file) => {
          // Extract user_id from filename (format: event_id/user_id-uuid.ext)
          const filePath = `${eventId}/${file.name}`;
          const userId = file.name.split('-')[0];
          
          // Get image URL
          const { data: urlData } = supabase.storage
            .from('event-gallery')
            .getPublicUrl(filePath);
            
          // Get user info
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
  
  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    
    setUploading(true);
    
    try {
      // Check if event-gallery bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'event-gallery')) {
        await supabase.storage.createBucket('event-gallery', { public: true });
      }
      
      const files = Array.from(e.target.files);
      const uploadPromises = files.map(async (file) => {
        // Create filename with format: user_id-uuid.ext
        const fileExt = file.name.split('.').pop();
        const fileName = `${eventId}/${user.id}-${uuidv4()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-gallery')
          .upload(fileName, file, { upsert: true });
          
        if (uploadError) {
          throw uploadError;
        }
        
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
  
  const handleDownloadImage = async (image: GalleryImage) => {
    try {
      const { data, error } = await supabase.storage
        .from('event-gallery')
        .download(`${eventId}/${image.filename}`);
        
      if (error) {
        throw error;
      }
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename.split('-').slice(1).join('-'); // Remove user_id prefix
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
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-2 dark:text-[#EDEDED]">Galeria</h3>
      
      {user && (
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            disabled={uploading}
          >
            {uploading ? (
              <span>Enviando...</span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Adicionar fotos
              </>
            )}
            <input 
              type="file" 
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleAddPhotos}
              disabled={uploading}
            />
          </Button>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse" />
          ))}
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="aspect-square bg-muted cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(image)}
            >
              <OptimizedImage 
                src={image.src} 
                alt="Event gallery" 
                className="w-full h-full object-cover"
                aspectRatio="1/1"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/20 rounded-xl">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1 dark:text-[#EDEDED]">Sem fotos</h3>
          <p className="text-sm text-muted-foreground">
            Compartilhe momentos do evento adicionando fotos
          </p>
        </div>
      )}
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-screen-md p-0 overflow-hidden" aria-describedby="gallery-image-description">
          {selectedImage && (
            <div className="relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-black/50 text-white border-none hover:bg-black/70"
                  onClick={() => handleDownloadImage(selectedImage)}
                >
                  <Download size={20} />
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  className="bg-black/50 text-white border-none hover:bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={20} />
                </Button>
              </div>
              <OptimizedImage 
                src={selectedImage.src} 
                alt="Gallery fullscreen" 
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="p-4 bg-background">
                <p className="font-medium">{selectedImage.user?.fullName || "Usuário"}</p>
                <p className="text-xs text-muted-foreground" id="gallery-image-description">
                  {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventGallery;
