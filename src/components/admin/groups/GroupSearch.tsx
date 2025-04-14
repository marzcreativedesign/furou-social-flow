
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GroupSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const GroupSearch = ({ searchQuery, onSearchChange }: GroupSearchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou descrição..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default GroupSearch;
