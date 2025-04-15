
import EventDiscussion from "@/components/EventDiscussion";
import EventGallery from "@/components/EventGallery";

interface EventDetailDiscussionProps {
  eventId: string;
  comments: any[];
}

const EventDetailDiscussion = ({ eventId, comments }: EventDetailDiscussionProps) => {
  return (
    <>
      <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
        <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Discussão</h2>
        <EventDiscussion 
          eventId={eventId} 
          initialComments={comments} 
        />
      </div>
      
      <div className="border-t pt-4 mt-6 border-border dark:border-[#2C2C2C]">
        <h2 className="font-bold mb-3 dark:text-[#EDEDED]">Galeria</h2>
        <EventGallery 
          eventId={eventId}
          initialImages={[]}
        />
      </div>
    </>
  );
};

export default EventDetailDiscussion;
