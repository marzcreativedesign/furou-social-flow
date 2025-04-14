
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EventSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const EventSearch = ({ searchQuery, onSearchChange }: EventSearchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, descrição ou local..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default EventSearch;
