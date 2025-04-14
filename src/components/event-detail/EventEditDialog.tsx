
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EventEditData {
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "public" | "private" | "group";
  includeEstimatedBudget: boolean;
  estimatedBudget: string;
}

interface EventEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEventData: EventEditData;
  onEventDataChange: (data: Partial<EventEditData>) => void;
  onSave: () => void;
}

const EventEditDialog = ({
  open,
  onOpenChange,
  editEventData,
  onEventDataChange,
  onSave,
}: EventEditDialogProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onEventDataChange({ [name]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-card dark:border-[#2C2C2C]">
        <DialogHeader>
          <DialogTitle className="dark:text-[#EDEDED]">Editar Evento</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="dark:text-[#EDEDED]">Título</Label>
            <Input 
              id="title" 
              name="title"
              value={editEventData.title}
              onChange={handleInputChange}
              className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="dark:text-[#EDEDED]">Descrição</Label>
            <textarea 
              id="description" 
              name="description"
              value={editEventData.description}
              onChange={handleInputChange}
              rows={3}
              className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="dark:text-[#EDEDED]">Data</Label>
              <Input 
                id="date" 
                name="date"
                type="date"
                value={editEventData.date}
                onChange={handleInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="startTime" className="dark:text-[#EDEDED]">Hora de início</Label>
              <Input 
                id="startTime" 
                name="startTime"
                type="time"
                value={editEventData.startTime}
                onChange={handleInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="endTime" className="dark:text-[#EDEDED]">Hora de término</Label>
              <Input 
                id="endTime" 
                name="endTime"
                type="time"
                value={editEventData.endTime}
                onChange={handleInputChange}
                className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="dark:text-[#EDEDED]">Tipo de evento</Label>
              <RadioGroup
                name="type"
                value={editEventData.type}
                onValueChange={(value) => onEventDataChange({ type: value as "public" | "private" | "group" })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="public" value="public" className="dark:border-[#2C2C2C]" />
                  <Label htmlFor="public" className="dark:text-[#EDEDED]">Público</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="private" value="private" className="dark:border-[#2C2C2C]" />
                  <Label htmlFor="private" className="dark:text-[#EDEDED]">Privado</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location" className="dark:text-[#EDEDED]">Local</Label>
            <Input 
              id="location" 
              name="location"
              value={editEventData.location}
              onChange={handleInputChange}
              className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address" className="dark:text-[#EDEDED]">Endereço</Label>
            <Input 
              id="address" 
              name="address"
              value={editEventData.address}
              onChange={handleInputChange}
              className="dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
            />
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="includeEstimatedBudget"
              checked={editEventData.includeEstimatedBudget}
              onCheckedChange={(checked) => {
                onEventDataChange({
                  includeEstimatedBudget: checked === true
                });
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="includeEstimatedBudget"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Incluir orçamento estimado para o evento
              </Label>
            </div>
          </div>
          
          {editEventData.includeEstimatedBudget && (
            <div className="grid gap-2">
              <Label htmlFor="estimatedBudget" className="dark:text-[#EDEDED]">
                Valor do orçamento estimado
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input 
                  id="estimatedBudget" 
                  name="estimatedBudget"
                  type="text"
                  value={editEventData.estimatedBudget}
                  onChange={(e) => {
                    // Allow only numbers and dot
                    const value = e.target.value.replace(/[^\d.,]/g, '');
                    onEventDataChange({
                      estimatedBudget: value
                    });
                  }}
                  placeholder="500,00"
                  className="pl-9 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED]"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
