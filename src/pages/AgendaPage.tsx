
import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import { useAgendaEvents } from "@/hooks/useAgendaEvents";
import AgendaCalendar from "@/components/agenda/AgendaCalendar";
import AgendaEventsList from "@/components/agenda/AgendaEventsList";
import { Event as EventType } from "@/types/event";

const AgendaPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<EventType[]>([]);
  const navigate = useNavigate();
  
  const { 
    allEvents, 
    loading, 
    getEventsForDate, 
    dateHasEvent, 
    isPastDate,
    getEventTypeBadge
  } = useAgendaEvents();

  // Update selected date events when date changes
  useEffect(() => {
    if (date) {
      setSelectedDateEvents(getEventsForDate(date));
    }
  }, [date, allEvents, getEventsForDate]);

  const navigateToEventDetail = (eventId: string) => {
    navigate(`/eventos/${eventId}`);
  };

  const navigateToCreateEvent = () => {
    navigate('/criar');
  };

  return (
    <MainLayout title="Agenda">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Sua Agenda</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Component */}
          <div className="lg:col-span-1">
            <AgendaCalendar 
              date={date} 
              onSelectDate={setDate} 
              dateHasEvent={dateHasEvent}
              isPastDate={isPastDate}
            />
          </div>
          
          {/* Events List Component */}
          <div className="lg:col-span-2">
            <AgendaEventsList 
              date={date}
              events={selectedDateEvents}
              loading={loading}
              onEventClick={navigateToEventDetail}
              onAddEventClick={navigateToCreateEvent}
              getEventTypeBadge={getEventTypeBadge}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AgendaPage;
