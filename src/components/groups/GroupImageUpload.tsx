
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Upload, Loader2 } from "lucide-react";

interface GroupImageUploadProps {
  imageUrl: string;
  uploadingImage: boolean;
  onImageSelected: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const GroupImageUpload = ({ imageUrl, uploadingImage, onImageSelected }: GroupImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <FormLabel>Imagem do grupo</FormLabel>
      <div className="mt-2 flex items-center gap-4">
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={onImageSelected}
          disabled={uploadingImage}
        />
        
        {imageUrl ? (
          <div className="relative h-24 w-24 rounded-md overflow-hidden">
            <img
              src={imageUrl}
              alt="Group preview"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute bottom-1 right-1"
              onClick={handleImageClick}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleImageClick}
            className="h-24 w-24"
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupImageUpload;
