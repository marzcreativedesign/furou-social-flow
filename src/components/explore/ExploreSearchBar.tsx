
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExploreSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ExploreSearchBar = ({ searchQuery, onSearchChange }: ExploreSearchBarProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input 
        placeholder="Buscar eventos, locais, pessoas..." 
        className="pl-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default ExploreSearchBar;
