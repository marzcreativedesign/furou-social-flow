
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  image: string;
  isAdmin: boolean;
}

interface GroupAboutProps {
  description?: string;
  createdAt?: string;
  admins: GroupMember[];
  isOwner: boolean;
  onSettingsClick: () => void;
}

const GroupAbout = ({ description, createdAt, admins, isOwner, onSettingsClick }: GroupAboutProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2">Sobre o grupo</h3>
        <p className="text-muted-foreground text-sm mb-4">{description || 'Sem descrição'}</p>
        
        <h4 className="font-medium mb-2">Criado em</h4>
        <p className="text-muted-foreground text-sm mb-4">
          {createdAt 
            ? new Date(createdAt).toLocaleDateString('pt-BR') 
            : 'Data desconhecida'}
        </p>
        
        <h4 className="font-medium mb-2">Criado por</h4>
        {admins.length > 0 ? (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={admins[0].image} />
              <AvatarFallback>
                {admins[0].name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{admins[0].name}</span>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Informação não disponível</p>
        )}
      </div>
      
      {isOwner && (
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={onSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Configurações do grupo
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupAbout;
