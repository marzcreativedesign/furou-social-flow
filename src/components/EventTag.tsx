
import React from 'react';

interface EventTagProps {
  type: "public" | "private";
  label: string;
}

const EventTag: React.FC<EventTagProps> = ({ type, label }) => {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      type === "public" 
        ? "bg-green-100 text-green-800 border border-green-200" 
        : "bg-blue-100 text-blue-800 border border-blue-200"
    }`}>
      {label}
    </span>
  );
};

export default EventTag;
