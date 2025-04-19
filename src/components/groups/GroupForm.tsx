
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StorageService } from "@/services/storage.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GroupImageUpload from "./GroupImageUpload";
import { GroupFormValues, groupFormSchema } from "./types";

interface GroupFormProps {
  onSubmit: (values: GroupFormValues) => Promise<void>;
  isLoading: boolean;
}

const GroupForm = ({ onSubmit, isLoading }: GroupFormProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const result = await StorageService.uploadImage(files[0], 'group-images');
      
      if (result) {
        setImageUrl(result.url);
        form.setValue("image_url", result.url);
        toast({
          title: "Imagem carregada",
          description: "Sua imagem foi carregada com sucesso.",
        });
      } else {
        throw new Error("Falha ao carregar imagem");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do grupo</FormLabel>
              <FormControl>
                <Input placeholder="Meu grupo incrível" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva seu grupo..."
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <GroupImageUpload
          imageUrl={imageUrl}
          uploadingImage={uploadingImage}
          onImageSelected={handleImageUpload}
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Criando...</span>
            </>
          ) : (
            "Criar grupo"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default GroupForm;
