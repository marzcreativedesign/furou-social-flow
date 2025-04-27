
import React from 'react';
import { Calendar, Info, Users, Badge } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GroupTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const GroupTabs = ({ activeTab, onTabChange }: GroupTabsProps) => {
  return (
    <TabsList className="w-full grid grid-cols-4 mb-4">
      <TabsTrigger value="eventos" onClick={() => onTabChange('eventos')}>
        <Calendar className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Eventos</span>
      </TabsTrigger>
      <TabsTrigger value="membros" onClick={() => onTabChange('membros')}>
        <Users className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Membros</span>
      </TabsTrigger>
      <TabsTrigger value="ranking" onClick={() => onTabChange('ranking')}>
        <Badge className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Ranking</span>
      </TabsTrigger>
      <TabsTrigger value="sobre" onClick={() => onTabChange('sobre')}>
        <Info className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Sobre</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default GroupTabs;
