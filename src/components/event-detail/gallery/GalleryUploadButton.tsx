
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GalleryUploadButtonProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  disabled?: boolean;
}

const GalleryUploadButton = ({ onFileSelect, uploading, disabled }: GalleryUploadButtonProps) => {
  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        disabled={uploading || disabled}
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
          onChange={onFileSelect}
          disabled={uploading || disabled}
        />
      </Button>
    </div>
  );
};

export default GalleryUploadButton;
