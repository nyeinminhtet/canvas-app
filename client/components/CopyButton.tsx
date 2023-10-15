"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/ui/button";
import { Check, Copy } from "lucide-react";

interface CopyProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
}

function copyBtn(value: string) {
  console.log(value);
  navigator.clipboard.writeText(value);
}

const CopyButton = ({ value }: CopyProps) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-fit rounded-sm p-0 hover:bg-background"
      onClick={() => {
        copyBtn(value);
        setIsCopied(true);
      }}
    >
      <span className=" sr-only">copy</span>
      {isCopied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
};

export default CopyButton;
