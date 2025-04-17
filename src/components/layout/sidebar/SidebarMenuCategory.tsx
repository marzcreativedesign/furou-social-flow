
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
    <div className="mb-2">
      {!isMainMenu && (
        <Button
          variant="ghost"
          className="w-full justify-between font-semibold"
          onClick={onToggle}
        >
          {title}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      )}
      
      {isExpanded && (
        <div className={isMainMenu ? '' : 'pl-2 border-l border-gray-300 dark:border-gray-700 ml-2 mt-1'}>
          {items.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => navigate(item.href)}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuCategory;
