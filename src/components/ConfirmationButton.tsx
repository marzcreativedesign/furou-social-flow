
import { useState } from "react";
import { Check, X } from "lucide-react";

interface ConfirmationButtonProps {
  onConfirm: () => void;
  onDecline: () => void;
  initialState?: boolean | null;
}

const ConfirmationButton = ({
  onConfirm,
  onDecline,
  initialState = null,
}: ConfirmationButtonProps) => {
  const [confirmed, setConfirmed] = useState<boolean | null>(initialState);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm();
  };

  const handleDecline = () => {
    setConfirmed(false);
    onDecline();
  };

  return (
    <div className="flex gap-4 my-4 justify-center">
      <button
        onClick={handleDecline}
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full transition-all ${
          confirmed === false
            ? "bg-destructive text-white"
            : "border-2 border-destructive text-destructive hover:bg-destructive/10"
        }`}
      >
        <X size={18} />
        <span className="font-semibold">Furei</span>
      </button>
      <button
        onClick={handleConfirm}
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full transition-all ${
          confirmed === true
            ? "bg-green-500 text-white"
            : "border-2 border-green-500 text-green-700 hover:bg-green-50"
        }`}
      >
        <Check size={18} />
        <span className="font-semibold">Eu vou!</span>
      </button>
    </div>
  );
};

export default ConfirmationButton;
