
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-[#B3B3B3]" size={18} />
      <input 
        type="text" 
        placeholder="Buscar eventos..." 
        className="w-full px-10 py-3 rounded-xl border border-input bg-background hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:bg-[#262626] dark:border-[#2C2C2C] dark:text-[#EDEDED] dark:placeholder-[#B3B3B3] dark:focus:border-primary dark:focus:ring-primary/20" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
      />
    </div>
  );
};

export default SearchInput;
