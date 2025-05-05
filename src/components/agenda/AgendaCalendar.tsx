
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgendaCalendarProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  dateHasEvent: (day: Date) => boolean;
  isPastDate: (day: Date) => boolean;
}

const AgendaCalendar = ({ 
  date, 
  onSelectDate, 
  dateHasEvent, 
  isPastDate 
}: AgendaCalendarProps) => {
  // Function to style past dates and dates with events
  const modifiersStyles = {
    pastDate: {
      color: "rgb(176, 176, 176)", // #B0B0B0
      opacity: 0.6,
    },
    hasEvent: { 
      fontWeight: 'bold', 
      textDecoration: 'underline', 
      color: 'var(--accent)' 
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calendário</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelectDate}
          className="border rounded-md pointer-events-auto"
          modifiers={{
            hasEvent: (day) => dateHasEvent(day),
            pastDate: (day) => isPastDate(day)
          }}
          modifiersStyles={modifiersStyles}
        />
      </CardContent>
    </Card>
  );
};

export default AgendaCalendar;
