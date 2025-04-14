
import { MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  user: {
    name: string;
    bio: string | null;
    avatar: string;
  };
}

const UserHeader = ({ user }: UserHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <Avatar className="h-24 w-24 mb-4 border-4 border-background dark:border-[#121212]">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
          {user.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-bold dark:text-[#EDEDED]">{user.name}</h2>
      
      {user.bio && (
        <p className="text-sm text-muted-foreground mt-2 max-w-md dark:text-[#B3B3B3]">
          {user.bio}
        </p>
      )}
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => alert('Função de mensagem em breve!')}
          className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Mensagem
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => alert('Função de compartilhar em breve!')}
          className="dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:hover:bg-[#262626]"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
