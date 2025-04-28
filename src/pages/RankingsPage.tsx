
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trophy, Award, Clock, Users } from "lucide-react";
import { useEventRankings } from "@/hooks/useEventRankings";
import { ScrollArea } from "@/components/ui/scroll-area";

const RankingsPage = () => {
  const { type = "confirmados" } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(type === "furoes" ? "missed" : "confirmed");
  
  const {
    confirmedRanking,
    missedRanking,
    loadingConfirmed,
    loadingMissed,
    loadMore,
    limit
  } = useEventRankings();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/rankings/${value === "missed" ? "furoes" : "confirmados"}`);
  };

  // Função para obter as iniciais do nome
  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout title="Rankings" showDock>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 p-0 w-8 h-8"
            onClick={() => navigate("/grupos")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Rankings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="confirmed">
              <Trophy className="mr-2 h-4 w-4 text-amber-500" />
              Top Confirmados
            </TabsTrigger>
            <TabsTrigger value="missed">
              <Clock className="mr-2 h-4 w-4 text-red-500" />
              Top Furões
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="confirmed">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                    <h2 className="text-xl font-bold">Top Confirmados</h2>
                  </div>
                  <Button variant="ghost" onClick={() => navigate("/grupos")}>
                    <Users className="mr-2 h-4 w-4" />
                    Ver Grupos
                  </Button>
                </div>
                
                <ScrollArea className="h-[500px]">
                  {loadingConfirmed ? (
                    <div className="space-y-6">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="text-xl font-bold text-muted-foreground w-6 text-right">
                            {i + 1}.
                          </div>
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : confirmedRanking?.length > 0 ? (
                    <div className="space-y-6">
                      {confirmedRanking.map((user, index) => (
                        <div key={user.id} className="flex items-center space-x-4">
                          <div 
                            className={`text-xl font-bold w-6 text-right ${
                              index === 0 ? "text-amber-500" :
                              index === 1 ? "text-slate-400" :
                              index === 2 ? "text-amber-700" : "text-muted-foreground"
                            }`}
                          >
                            {index + 1}.
                          </div>
                          
                          <Avatar className={`h-12 w-12 ${
                            index === 0 ? "ring-2 ring-amber-500" :
                            index === 1 ? "ring-2 ring-slate-400" :
                            index === 2 ? "ring-2 ring-amber-700" : ""
                          }`}>
                            {user.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt={user.full_name || "Usuário"} />
                            ) : (
                              <AvatarFallback className="text-lg">
                                {getInitials(user.full_name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          <div className="flex-1">
                            <p className="font-medium">{user.full_name || "Usuário"}</p>
                            {index < 3 && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Award className="h-3 w-3 mr-1" />
                                {index === 0 ? "Ouro" : index === 1 ? "Prata" : "Bronze"}
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-primary/10 text-primary rounded-full py-1 px-3 font-medium">
                            {user.count} {user.count === 1 ? "presença" : "presenças"}
                          </div>
                        </div>
                      ))}
                      
                      {confirmedRanking.length >= limit && (
                        <div className="flex justify-center pt-4">
                          <Button variant="outline" onClick={loadMore}>
                            Carregar mais
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">Nenhum dado disponível</h3>
                      <p className="text-muted-foreground mb-4">
                        Ainda não há dados suficientes para gerar este ranking.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="missed">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-red-500 mr-2" />
                    <h2 className="text-xl font-bold">Top Furões</h2>
                  </div>
                  <Button variant="ghost" onClick={() => navigate("/grupos")}>
                    <Users className="mr-2 h-4 w-4" />
                    Ver Grupos
                  </Button>
                </div>
                
                <ScrollArea className="h-[500px]">
                  {loadingMissed ? (
                    <div className="space-y-6">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="text-xl font-bold text-muted-foreground w-6 text-right">
                            {i + 1}.
                          </div>
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : missedRanking?.length > 0 ? (
                    <div className="space-y-6">
                      {missedRanking.map((user, index) => (
                        <div key={user.id} className="flex items-center space-x-4">
                          <div 
                            className={`text-xl font-bold w-6 text-right ${
                              index === 0 ? "text-red-500" :
                              index === 1 ? "text-red-400" :
                              index === 2 ? "text-red-300" : "text-muted-foreground"
                            }`}
                          >
                            {index + 1}.
                          </div>
                          
                          <Avatar className={`h-12 w-12 ${
                            index === 0 ? "ring-2 ring-red-500" :
                            index === 1 ? "ring-2 ring-red-400" :
                            index === 2 ? "ring-2 ring-red-300" : ""
                          }`}>
                            {user.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt={user.full_name || "Usuário"} />
                            ) : (
                              <AvatarFallback className="text-lg">
                                {getInitials(user.full_name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          <div className="flex-1">
                            <p className="font-medium">{user.full_name || "Usuário"}</p>
                            {index < 3 && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {index === 0 ? "Rei dos Furões" : index === 1 ? "Vice-Furão" : "Quase-Furão"}
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full py-1 px-3 font-medium">
                            {user.count} {user.count === 1 ? "ausência" : "ausências"}
                          </div>
                        </div>
                      ))}
                      
                      {missedRanking.length >= limit && (
                        <div className="flex justify-center pt-4">
                          <Button variant="outline" onClick={loadMore}>
                            Carregar mais
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">Nenhum dado disponível</h3>
                      <p className="text-muted-foreground mb-4">
                        Ainda não há dados suficientes para gerar este ranking.
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default RankingsPage;
