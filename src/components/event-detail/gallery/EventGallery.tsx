
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GalleryImage } from "./types";
import { useEventGallery } from "@/hooks/useEventGallery";
import GalleryUploadButton from "./GalleryUploadButton";
import GalleryGrid from "./GalleryGrid";
import GalleryImageDialog from "./GalleryImageDialog";

interface EventGalleryProps {
  eventId: string;
}

const EventGallery = ({ eventId }: EventGalleryProps) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const { images, loading, uploading, handleUpload, handleDownload } = useEventGallery(eventId);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await handleUpload(Array.from(e.target.files));
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-2 dark:text-[#EDEDED]">Galeria</h3>
      
      {user && (
        <GalleryUploadButton
          onFileSelect={handleFileSelect}
          uploading={uploading}
        />
      )}
      
      <GalleryGrid
        images={images}
        loading={loading}
        onImageClick={setSelectedImage}
      />
      
      <GalleryImageDialog
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default EventGallery;
