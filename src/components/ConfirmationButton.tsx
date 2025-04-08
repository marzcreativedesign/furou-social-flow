
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
        className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full ${
          confirmed === false
            ? "bg-destructive text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <X size={18} />
        <span>Não vou</span>
      </button>
      <button
        onClick={handleConfirm}
        className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full ${
          confirmed === true
            ? "bg-green-500 text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Check size={18} />
        <span>Vou!</span>
      </button>
    </div>
  );
};

export default ConfirmationButton;
