"use client";

import { useEffect, useState } from "react";

import { useDraw } from "@/hooks/useDraw";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";
import { drawLine } from "@/utils/drawLine";

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: "string";
};

const socket = io("http://localhost:5000");

export default function Home() {
  const [color, setColor] = useState("#000");

  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on("draw-line", ({ prevPoint, currentPoint, color }: DrawLine) => {
      if (!ctx) return;
      drawLine({ prevPoint, currentPoint, ctx, color });
    });

    socket.on("clear", clear);

    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef, clear]);

  return (
    <div className=" w-screen bg-white h-screen flex gap-5  justify-center items-center">
      <div className="flex flex-col gap-2">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="p-2 rounded-md border border-black text-black hover:opacity-70"
          onClick={() => socket.emit("clear")}
        >
          Clear
        </button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={500}
        height={500}
        className="border border-black rounded-md"
      />
    </div>
  );
}
