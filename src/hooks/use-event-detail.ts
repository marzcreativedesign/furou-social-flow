
import { useState, useMemo } from "react";
import { getEventById, mockComments } from "@/data/mockData";
import type { EventData } from "@/types/event";
import { parseISO, format } from "date-fns";

export const useEventDetail = (id: string | undefined) => {
  const [loading] = useState(false);

  const event = useMemo(() => {
    if (!id) return null;
    const foundEvent = getEventById(id);
    if (!foundEvent) return null;

    // Add comments to the event
    const eventComments = mockComments.filter(c => c.event_id === id);
    return {
      ...foundEvent,
      comments: eventComments
    } as unknown as EventData;
  }, [id]);

  const initialEditEventData = useMemo(() => {
    if (!event) {
      return {
        title: "",
        description: "",
        location: "",
        address: "",
        date: "",
        startTime: "",
        endTime: "",
        type: "public" as "public" | "private",
        includeEstimatedBudget: false,
        estimatedBudget: "",
      };
    }

    const eventDate = parseISO(event.date);
    const formattedDate = format(eventDate, 'yyyy-MM-dd');
    const startTime = format(eventDate, 'HH:mm');
    const endTime = format(new Date(eventDate.getTime() + 3 * 60 * 60 * 1000), 'HH:mm');

    return {
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      address: event.address || "",
      date: formattedDate,
      startTime: startTime,
      endTime: endTime,
      type: event.is_public ? "public" as const : "private" as const,
      includeEstimatedBudget: !!event.estimated_budget,
      estimatedBudget: event.estimated_budget ? event.estimated_budget.toString() : "",
    };
  }, [event]);

  const [editEventData, setEditEventData] = useState(initialEditEventData);

  return {
    loading,
    event,
    editEventData,
    setEditEventData
  };
};
