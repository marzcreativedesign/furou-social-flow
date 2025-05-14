
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ExploreSearchBarProps {
  searchQuery: string;
  onSearch?: (query: string) => void;
  onSearchChange?: (query: string) => void;
}

const ExploreSearchBar = ({ searchQuery, onSearch, onSearchChange }: ExploreSearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    }
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input 
        placeholder="Buscar eventos, locais, pessoas..." 
        className="pl-10"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
};

export default ExploreSearchBar;
