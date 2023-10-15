"use client";

import React, { useEffect } from "react";

import { Button } from "./ui/ui/button";
import { Kbd } from "./ui/ui/kbd";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/ui/tooltip";
import { useParams } from "next/navigation";
import { socket } from "@/lib/socket";
import { useHotkeys } from "react-hotkeys-hook";

interface ClearButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  clear: () => void;
}

const ClearButton = ({ canvasRef, clear }: ClearButtonProps) => {
  const { roomId } = useParams();

  const clearCanvas = () => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    socket.emit("add-undo-point", {
      roomId,
      undoPoint: canvasElement.toDataURL(),
    });
    clear();
    socket.emit("clear-canvas", roomId);
  };

  useHotkeys("c", clearCanvas);

  useEffect(() => {
    socket.on("clear-canvas", clear);

    return () => {
      socket.off("clear-canvas");
    };
  }, [clear]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="rounded-none rounded-tr-[2.8px] border-0 border-b border-l focus-within:z-10 dark:bg-slate-700"
            onClick={clearCanvas}
          >
            Clear
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <Kbd className="bg-slate-900">C</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ClearButton;
