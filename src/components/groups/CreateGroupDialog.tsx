
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GroupsService } from "@/services/groups.service";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateGroupDialogProps {
  onGroupCreated: (newGroup: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateGroupDialog = ({ onGroupCreated, open: controlledOpen, onOpenChange: setControlledOpen }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  // Use controlled or uncontrolled state based on props
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const finalValues = {
        name: values.name, // Ensure name is provided as it's required
        description: values.description,
        image_url: imageUrl || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3"
      };
      
      const result = await GroupsService.createGroup(finalValues);
      
      if (Array.isArray(result) && result.length > 0) {
        toast({
          title: "Sucesso",
          description: "Grupo criado com sucesso!",
        });
        
        // Close dialog and reset form
        setIsOpen(false);
        form.reset();
        
        // Pass the new group data to the parent component
        onGroupCreated(result[0]);
      } else {
        console.error("Error creating group: unexpected response format");
        toast({
          title: "Erro",
          description: "Não foi possível criar o grupo. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o grupo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    // In a real app, you would use Supabase Storage or another service
    // For now, we'll just set a placeholder image
    setImageUrl("https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3");
    form.setValue("image_url", "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Criar grupo</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo grupo</DialogTitle>
          <DialogDescription>
            Crie um grupo para organizar eventos com pessoas que compartilham seus interesses.
          </DialogDescription>
        </DialogHeader>
        
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
            
            <div>
              <FormLabel>Imagem do grupo</FormLabel>
              <div className="mt-2 flex items-center gap-4">
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
                      onClick={handleImageUpload}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageUpload}
                    className="h-24 w-24"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  "Criar grupo"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
