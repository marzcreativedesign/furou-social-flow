
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, List, Calendar as GridIcon } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format, addDays, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para gerar eventos fictícios para uma agenda
const generateMockEvents = () => {
  // Data atual para referência
  const today = new Date();
  
  // Eventos para hoje
  const todayEvents = [
    {
      id: "today-1",
      title: "Happy Hour no Bar do Zé",
      time: "19:00",
      location: "Bar do Zé",
      confirmed: true,
    },
    {
      id: "today-2",
      title: "Reunião de trabalho",
      time: "14:30",
      location: "Escritório",
      confirmed: true,
    }
  ];
  
  // Eventos para amanhã
  const tomorrow = addDays(today, 1);
  const tomorrowEvents = [
    {
      id: "tomorrow-1",
      title: "Aniversário do João",
      time: "20:00",
      location: "Casa do João",
      confirmed: false,
    }
  ];
  
  // Eventos para dois dias depois
  const dayAfterTomorrow = addDays(today, 2);
  const dayAfterTomorrowEvents = [
    {
      id: "day-after-1",
      title: "Cinema com amigos",
      time: "19:30",
      location: "Shopping Center",
      confirmed: true,
    },
    {
      id: "day-after-2",
      title: "Jantar em família",
      time: "21:00",
      location: "Restaurante italiano",
      confirmed: true,
    },
    {
      id: "day-after-3",
      title: "Café da manhã de networking",
      time: "08:30",
      location: "Café downtown",
      confirmed: true,
    }
  ];
  
  // Eventos para o fim de semana
  const weekend = addDays(today, 5); // Aproximadamente fim de semana
  const weekendEvents = [
    {
      id: "weekend-1",
      title: "Churrasco com amigos",
      time: "13:00",
      location: "Parque da Cidade",
      confirmed: true,
    },
    {
      id: "weekend-2",
      title: "Festival de Cerveja",
      time: "16:00",
      location: "Expo Center",
      confirmed: true,
    }
  ];
  
  // Eventos para a próxima semana
  const nextWeek = addDays(today, 8);
  const nextWeekEvents = [
    {
      id: "next-week-1",
      title: "Show de Rock",
      time: "21:00",
      location: "Arena",
      confirmed: false,
    }
  ];
  
  // Eventos para o próximo mês
  const nextMonth = addDays(today, 20);
  const nextMonthEvents = [
    {
      id: "next-month-1",
      title: "Feira de Tecnologia",
      time: "10:00",
      location: "Centro de Convenções",
      confirmed: true,
    },
    {
      id: "next-month-2",
      title: "Workshop de Fotografia",
      time: "14:00",
      location: "Estúdio Central",
      confirmed: true,
    }
  ];
  
  return [
    { date: today, events: todayEvents },
    { date: tomorrow, events: tomorrowEvents },
    { date: dayAfterTomorrow, events: dayAfterTomorrowEvents },
    { date: weekend, events: weekendEvents },
    { date: nextWeek, events: nextWeekEvents },
    { date: nextMonth, events: nextMonthEvents }
  ];
};

// Gera mais dias com eventos (alguns dias podem ter muitos eventos para demonstrar a densidade)
const generateCalendarData = () => {
  const today = new Date();
  
  // Função auxiliar para gerar um número aleatório entre min e max
  const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  
  // Gerar eventos para os próximos 60 dias
  const calendarData: Record<string, any[]> = {};
  
  for (let i = -10; i < 60; i++) {
    const date = addDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // 40% de chance de ter eventos neste dia
    if (Math.random() < 0.4) {
      // Gerar entre 1 e 5 eventos
      const eventsCount = randomBetween(1, 5);
      const events = [];
      
      for (let j = 0; j < eventsCount; j++) {
        events.push({
          id: `${dateKey}-${j}`,
          title: `Evento ${j + 1} de ${format(date, 'dd/MM', { locale: ptBR })}`,
          time: `${randomBetween(8, 22)}:${randomBetween(0, 5)}0`,
          location: "Local do evento",
          confirmed: Math.random() > 0.3,
        });
      }
      
      calendarData[dateKey] = events;
    }
  }
  
  return calendarData;
};

const AgendaPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list');
  const [eventsData] = useState(generateMockEvents());
  const [calendarData] = useState(generateCalendarData());
  
  // Lista os eventos para a visualização atual
  const getEventsForCurrentDate = () => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    return calendarData[formattedDate] || [];
  };
  
  // Vai para o dia anterior
  const goToPreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };
  
  // Vai para o próximo dia
  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };
  
  // Vai para hoje
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Lida com a navegação para a página de detalhes do evento
  const handleEventClick = (eventId: string) => {
    navigate(`/evento/${eventId}`);
  };
  
  // Dados para a visualização de calendário
  const calendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = monthStart;
    const endDate = monthEnd;
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Adicionar dias vazios no início para preencher o calendário
    const startDay = getDay(startDate);
    const emptyDaysAtStart = Array.from({ length: startDay }, (_, i) => null);
    
    return [...emptyDaysAtStart, ...days];
  };
  
  // Verifica se um dia tem eventos
  const hasEvents = (date: Date | null) => {
    if (!date) return false;
    const formattedDate = format(date, 'yyyy-MM-dd');
    return calendarData[formattedDate] && calendarData[formattedDate].length > 0;
  };
  
  // Conta o número de eventos em um dia
  const countEvents = (date: Date | null) => {
    if (!date) return 0;
    const formattedDate = format(date, 'yyyy-MM-dd');
    return calendarData[formattedDate]?.length || 0;
  };
  
  // Verifica se uma data é hoje
  const checkIsToday = (date: Date | null) => {
    if (!date) return false;
    return isToday(date);
  };

  return (
    <MainLayout title="Agenda">
      <div className="p-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-[#EDEDED]">Minha Agenda</h1>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/criar")}
              className="flex items-center gap-1 border-[#FF8A1E] text-[#FF8A1E] hover:bg-[#FF8A1E]/10"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Criar Evento</span>
            </Button>
            
            <Tabs
              value={viewType}
              onValueChange={(value) => setViewType(value as 'list' | 'calendar')}
              className="hidden sm:block"
            >
              <TabsList className="bg-muted/30 dark:bg-[#262626]/50 p-1">
                <TabsTrigger value="list" className="text-xs px-2 py-1">
                  <List size={16} className="mr-1" />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="calendar" className="text-xs px-2 py-1">
                  <GridIcon size={16} className="mr-1" />
                  Calendário
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Navegador de datas */}
        <div className="flex items-center justify-between mb-6 bg-muted/30 dark:bg-[#262626]/50 rounded-xl p-3">
          <Button variant="ghost" size="sm" onClick={goToPreviousDay}>
            <ChevronLeft size={16} />
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium dark:text-[#EDEDED]">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <span className="text-lg font-bold dark:text-[#EDEDED]">
              {format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={goToNextDay}>
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="mb-4 dark:border-[#2C2C2C] dark:text-[#EDEDED]"
        >
          <CalendarIcon size={16} className="mr-2" />
          Hoje
        </Button>
        
        {viewType === 'list' ? (
          <>
            {/* Lista de eventos do dia atual */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 dark:text-[#EDEDED]">
                {isToday(currentDate) 
                  ? 'Hoje' 
                  : format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </h2>
              
              {getEventsForCurrentDate().length > 0 ? (
                <div className="space-y-3">
                  {getEventsForCurrentDate().map((event) => (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-[#262626] border border-border dark:border-[#2C2C2C] rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleEventClick(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium dark:text-[#EDEDED]">{event.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground dark:text-[#B3B3B3] mt-1">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>{event.time}</span>
                            <span className="px-1">•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <Badge variant={event.confirmed ? "default" : "secondary"} className={event.confirmed ? "bg-green-500" : "bg-yellow-500"}>
                          {event.confirmed ? 'Confirmado' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/20 dark:bg-[#262626]/50 rounded-lg p-6 text-center">
                  <CalendarIcon size={24} className="mx-auto mb-2 text-muted-foreground dark:text-[#B3B3B3]" />
                  <p className="text-muted-foreground dark:text-[#B3B3B3]">
                    Nenhum evento agendado para este dia
                  </p>
                </div>
              )}
            </div>
            
            {/* Próximos eventos */}
            <div>
              <h2 className="text-lg font-semibold mb-3 dark:text-[#EDEDED]">Próximos eventos</h2>
              
              <div className="space-y-1">
                {eventsData.slice(1, 5).map((dayData) => (
                  <div key={format(dayData.date, 'yyyy-MM-dd')} className="mb-4">
                    <h3 className="text-sm font-medium mb-2 dark:text-[#EDEDED]">
                      {isToday(dayData.date) 
                        ? 'Hoje' 
                        : format(dayData.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </h3>
                    
                    <div className="space-y-2">
                      {dayData.events.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white dark:bg-[#262626] border border-border dark:border-[#2C2C2C] rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow"
                          onClick={() => handleEventClick(event.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium dark:text-[#EDEDED]">{event.title}</h4>
                              <div className="flex items-center text-xs text-muted-foreground dark:text-[#B3B3B3] mt-1">
                                <CalendarIcon size={12} className="mr-1" />
                                <span>{event.time}</span>
                                <span className="px-1">•</span>
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <Badge 
                              variant={event.confirmed ? "default" : "secondary"} 
                              className={event.confirmed ? "bg-green-500 text-xs" : "bg-yellow-500 text-xs"}
                            >
                              {event.confirmed ? 'Confirmado' : 'Pendente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Visualização de calendário */
          <div className="mb-8">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center font-medium text-sm py-1 dark:text-[#EDEDED]">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays().map((day, i) => (
                <div 
                  key={i} 
                  className={`
                    aspect-square p-1 border rounded-md relative
                    ${!day ? 'border-transparent' : 'border-border dark:border-[#2C2C2C] cursor-pointer'}
                    ${day && isSameDay(day, currentDate) ? 'bg-muted/30 dark:bg-[#262626]/70' : ''}
                    ${day && checkIsToday(day) ? 'border-[#FF8A1E]' : ''}
                  `}
                  onClick={() => day && setCurrentDate(day)}
                >
                  {day && (
                    <>
                      <div className="text-center">
                        <span className={`
                          text-sm font-medium
                          ${checkIsToday(day) ? 'text-[#FF8A1E]' : 'dark:text-[#EDEDED]'}
                        `}>
                          {format(day, 'd')}
                        </span>
                      </div>
                      
                      {hasEvents(day) && (
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                          {countEvents(day) > 2 ? (
                            <Badge className="text-[10px] px-1.5 py-0 h-4 bg-[#FF8A1E]">
                              {countEvents(day)}
                            </Badge>
                          ) : (
                            <div className="flex justify-center gap-0.5">
                              {Array.from({ length: countEvents(day) }).map((_, j) => (
                                <div 
                                  key={j} 
                                  className="w-1.5 h-1.5 rounded-full bg-[#FF8A1E]"
                                ></div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 dark:text-[#EDEDED]">
                Eventos para {format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              
              {getEventsForCurrentDate().length > 0 ? (
                <div className="space-y-2">
                  {getEventsForCurrentDate().map((event) => (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-[#262626] border border-border dark:border-[#2C2C2C] rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => handleEventClick(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium dark:text-[#EDEDED]">{event.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground dark:text-[#B3B3B3] mt-1">
                            <CalendarIcon size={12} className="mr-1" />
                            <span>{event.time}</span>
                            <span className="px-1">•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={event.confirmed ? "default" : "secondary"} 
                          className={event.confirmed ? "bg-green-500 text-xs" : "bg-yellow-500 text-xs"}
                        >
                          {event.confirmed ? 'Confirmado' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/20 dark:bg-[#262626]/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
                    Nenhum evento agendado para este dia
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AgendaPage;
