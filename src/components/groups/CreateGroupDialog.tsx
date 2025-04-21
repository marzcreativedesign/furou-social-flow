
import { useState } from "react";
import { GroupsService } from "@/services/groups.service";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GroupForm from "./GroupForm";
import { CreateGroupDialogProps, GroupFormValues } from "./types";

const CreateGroupDialog = ({ onGroupCreated, open: controlledOpen, onOpenChange: setControlledOpen }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use controlled or uncontrolled state based on props
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;

  const handleSubmit = async (values: GroupFormValues) => {
    setIsLoading(true);

    try {
      const finalValues = {
        name: values.name,
        description: values.description,
        image_url: values.image_url || "",
      };

      const result = await GroupsService.createGroup(finalValues);

      if (Array.isArray(result) && result.length > 0) {
        setIsOpen(false);
        onGroupCreated(result[0]);
      }
      // Nenhuma notificação (nem erro).
    } finally {
      setIsLoading(false);
    }
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

        <GroupForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
