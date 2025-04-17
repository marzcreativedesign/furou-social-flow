
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users } from "lucide-react";

interface ExploreTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ExploreTabs = ({ activeTab, onTabChange }: ExploreTabsProps) => {
  return (
    <Tabs defaultValue="events" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full">
        <TabsTrigger value="events" className="flex-1">
          <Calendar className="mr-2" size={16} />
          Eventos
        </TabsTrigger>
        <TabsTrigger value="groups" className="flex-1">
          <Users className="mr-2" size={16} />
          Grupos
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ExploreTabs;
