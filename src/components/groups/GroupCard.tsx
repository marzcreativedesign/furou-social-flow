
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupCardProps {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  members?: number;
  created_at?: string;
}

const GroupCard = ({ id, name, description, image_url, members }: GroupCardProps) => {
  return (
    <Link to={`/grupo/${id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={image_url} alt={name} />
              <AvatarFallback>
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <CardDescription className="text-xs">
                {members} {members === 1 ? "membro" : "membros"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {description && (
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </CardContent>
        )}
        <CardFooter className="pt-1">
          <div className="flex items-center gap-1 text-xs text-primary">
            <Users size={12} />
            <span>Ver detalhes</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GroupCard;
