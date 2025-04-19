
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/utils/image/compress";

interface GalleryUploadButtonProps {
  onFileSelect: (files: File[]) => Promise<void>;
  uploading: boolean;
  disabled?: boolean;
}

const GalleryUploadButton = ({ onFileSelect, uploading, disabled }: GalleryUploadButtonProps) => {
  const [processingFiles, setProcessingFiles] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Verificando tamanho total
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (totalSize > maxSize) {
      toast({
        title: "Arquivos muito grandes",
        description: "O tamanho total dos arquivos não deve exceder 10MB.",
        variant: "destructive"
      });
      return;
    }
    
    if (files.some(file => !file.type.startsWith('image/'))) {
      toast({
        title: "Formato inválido",
        description: "Apenas imagens são permitidas.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessingFiles(true);
    
    try {
      // Processando e comprimindo imagens
      const processedFiles = await Promise.all(
        files.map(async file => {
          try {
            const compressed = await compressImage(file);
            return new File([compressed], file.name, { type: compressed.type });
          } catch (error) {
            console.error("Error compressing image:", error);
            return file; // Se a compressão falhar, usa o original
          }
        })
      );
      
      await onFileSelect(processedFiles);
      
      // Limpa o input para permitir o mesmo arquivo novamente
      if (e.target) {
        e.target.value = '';
      }
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        title: "Erro ao processar imagens",
        description: "Não foi possível processar suas imagens. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setProcessingFiles(false);
    }
  };
  
  const isProcessing = uploading || processingFiles;

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        disabled={isProcessing || disabled}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            <span>{processingFiles ? "Processando..." : "Enviando..."}</span>
          </>
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
          onChange={handleFileChange}
          disabled={isProcessing || disabled}
        />
      </Button>
    </div>
  );
};

export default GalleryUploadButton;
