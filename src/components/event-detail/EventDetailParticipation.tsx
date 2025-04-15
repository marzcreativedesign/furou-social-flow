
import ConfirmationButton from "@/components/ConfirmationButton";
import EventCostCalculator from "@/components/EventCostCalculator";

interface EventDetailParticipationProps {
  id: string;
  eventType: "public" | "private" | "group";
  confirmedAttendeesCount: number;
}

const EventDetailParticipation = ({ 
  id, 
  eventType, 
  confirmedAttendeesCount 
}: EventDetailParticipationProps) => {
  return (
    <>
      <div className="bg-muted dark:bg-[#262626] p-4 rounded-xl mb-6">
        <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Você vai?</h2>
        <ConfirmationButton 
          onConfirm={() => {}}
          onDecline={() => {}}
          eventId={id}
        />
      </div>
      
      {eventType !== "public" && (
        <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
          <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Calculadora de Custos</h2>
          <EventCostCalculator attendeesCount={confirmedAttendeesCount} />
        </div>
      )}
    </>
  );
};

export default EventDetailParticipation;
