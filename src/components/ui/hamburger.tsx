
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

function Hamburger({ onClick }: { onClick?: () => void }) {
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen((prevState) => !prevState);
    if (onClick) onClick();
  };

  return (
    <Button
      className="group"
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <svg
        className="pointer-events-none"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 6H20" />
        <path d="M4 12H20" />
        <path d="M4 18H20" />
      </svg>
    </Button>
  );
};

export { Hamburger };
