import { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setIsSearchActive(prev => !prev);
    if (isSearchActive) {
      setSearchQuery("");
      if (onSearch) onSearch("");
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <>
      <button 
        className={`p-2 rounded-full hover:bg-muted ${isSearchActive ? 'bg-muted' : ''}`}
        onClick={handleSearchClick}
        aria-label="Buscar"
      >
        <Search size={20} />
      </button>

      {isSearchActive && (
        <div className="fixed inset-0 z-50 bg-background/95 dark:bg-gray-900/95 backdrop-blur-md">
          <div className="flex items-center p-4">
            <button
              onClick={handleSearchClick}
              className="p-2 mr-2 rounded-full hover:bg-muted"
              aria-label="Voltar"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
