
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  title: string;
  icon: JSX.Element;
  href: string;
}

interface SidebarMenuCategoryProps {
  title: string;
  items: MenuItem[];
  isExpanded: boolean;
  onToggle: () => void;
  isActive: (path: string) => boolean;
}

const SidebarMenuCategory = ({ 
  title, 
  items, 
  isExpanded, 
  onToggle, 
  isActive 
}: SidebarMenuCategoryProps) => {
  const navigate = useNavigate();
  const isMainMenu = title === 'main';

  return (
    <div className="mb-3">
      {!isMainMenu && (
        <Button
          variant="ghost"
          className="w-full justify-between font-medium text-muted-foreground px-3 h-auto py-2"
          onClick={onToggle}
        >
          {title}
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      )}
      
      {isExpanded && (
        <div className={isMainMenu ? '' : 'mt-1'}>
          {items.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={`w-full justify-start mb-1 py-2.5 px-3 h-auto rounded-md ${
                isActive(item.href) 
                  ? "bg-muted font-medium text-foreground" 
                  : "text-muted-foreground font-normal hover:bg-muted/50"
              }`}
              onClick={() => navigate(item.href)}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuCategory;
