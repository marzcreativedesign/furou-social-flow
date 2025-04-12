
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Medal, 
  Trophy, 
  ThumbsUp, 
  ThumbsDown,
  UserX
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

type MemberStats = {
  id: string;
  name: string;
  image: string;
  isAdmin: boolean;
  stats: {
    participated: number;
    missed: number;
    pending: number;
  };
};

interface GroupRankingProps {
  members: MemberStats[];
}

const GroupRanking = ({ members }: GroupRankingProps) => {
  const [activeFilter, setActiveFilter] = useState<'participation' | 'missed'>('participation');
  
  // Sort members based on the active filter
  const sortedMembers = [...members].sort((a, b) => {
    if (activeFilter === 'participation') {
      const totalA = a.stats.participated + a.stats.missed + a.stats.pending;
      const totalB = b.stats.participated + b.stats.missed + b.stats.pending;
      const rateA = totalA > 0 ? a.stats.participated / totalA : 0;
      const rateB = totalB > 0 ? b.stats.participated / totalB : 0;
      return rateB - rateA;
    } else {
      const totalA = a.stats.participated + a.stats.missed + a.stats.pending;
      const totalB = b.stats.participated + b.stats.missed + b.stats.pending;
      const rateA = totalA > 0 ? a.stats.missed / totalA : 0;
      const rateB = totalB > 0 ? b.stats.missed / totalB : 0;
      return rateB - rateA;
    }
  });
  
  const getRankingIcon = (index: number) => {
    if (activeFilter === 'participation') {
      if (index === 0) return <Trophy className="text-yellow-500" />;
      if (index === 1) return <Medal className="text-gray-400" />;
      if (index === 2) return <Medal className="text-amber-600" />;
      return <ThumbsUp className="text-green-500" />;
    } else {
      if (index === 0) return <UserX className="text-red-500" />;
      if (index === 1) return <UserX className="text-red-400" />;
      if (index === 2) return <UserX className="text-red-300" />;
      return <ThumbsDown className="text-red-200" />;
    }
  };
  
  const getRankingTitle = (index: number) => {
    if (activeFilter === 'participation') {
      if (index === 0) return "1º Lugar";
      if (index === 1) return "2º Lugar";
      if (index === 2) return "3º Lugar";
      return `${index + 1}º Lugar`;
    } else {
      if (index === 0) return "1º Furador";
      if (index === 1) return "2º Furador";
      if (index === 2) return "3º Furador";
      return `${index + 1}º Furador`;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button 
          variant={activeFilter === 'participation' ? 'default' : 'outline'} 
          onClick={() => setActiveFilter('participation')}
          className="flex-1"
          size="sm"
        >
          <ThumbsUp size={16} className="mr-2" />
          Participação
        </Button>
        <Button 
          variant={activeFilter === 'missed' ? 'default' : 'outline'} 
          onClick={() => setActiveFilter('missed')}
          className="flex-1"
          size="sm"
        >
          <UserX size={16} className="mr-2" />
          Furões
        </Button>
      </div>
      
      <div className="space-y-3">
        {sortedMembers.map((member, index) => {
          const total = member.stats.participated + member.stats.missed + member.stats.pending;
          const participationRate = total > 0 ? (member.stats.participated / total) * 100 : 0;
          const missedRate = total > 0 ? (member.stats.missed / total) * 100 : 0;
          const pendingRate = total > 0 ? (member.stats.pending / total) * 100 : 0;
          
          return (
            <Card key={member.id} className="p-4 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="text-center w-8">
                  <span className="text-lg font-bold">{index + 1}</span>
                </div>
                
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <Link to={`/usuario/${member.id}`} className="font-medium hover:underline">
                    {member.name}
                    {member.isAdmin && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </Link>
                  
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      {member.stats.participated}
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                      {member.stats.missed}
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                      {member.stats.pending}
                    </span>
                  </div>
                  
                  {/* Participation Bar */}
                  <div className="mt-2">
                    <div className="w-full h-2 flex rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${participationRate}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 h-full"
                        style={{ width: `${missedRate}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500 h-full"
                        style={{ width: `${pendingRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="w-8 flex flex-col items-center">
                  {getRankingIcon(index)}
                  <span className="text-xs text-muted-foreground mt-1">
                    {index < 3 ? getRankingTitle(index).split(" ")[0] : ""}
                  </span>
                </div>
              </div>
              
              {index < 3 && (
                <div className="absolute -right-6 -top-3 bg-primary/10 text-primary text-xs px-8 py-1 rotate-45">
                  {getRankingTitle(index)}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GroupRanking;
