import { drawWithDataURL } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

type AppTouchEvent = TouchEvent;

interface Point {
  x: number;
  y: number;
}

export interface DrawProps {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
}

export const useDraw = (onDraw: (draw: DrawProps) => void) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPointRef = useRef<null | Point>(null);

  const onInteractStart = useCallback(() => {
    setMouseDown(true);
  }, []);

  const undo = useCallback((undoPoint: string) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const ctx = canvasElement.getContext("2d");
    if (!ctx) return;

    drawWithDataURL(undoPoint, ctx, canvasElement);
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const computePointInCanvas = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      return { x, y };
    };

    const handleMove = (e: MouseEvent | AppTouchEvent) => {
      if (!mouseDown) return;
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;
      const ctx = canvasElement.getContext("2d");
      let currentPoint;

      if (e instanceof MouseEvent) {
        currentPoint = computePointInCanvas(e.clientX, e.clientY);
      } else {
        const { clientX, clientY } = e.touches[0];
        currentPoint = computePointInCanvas(clientX, clientY);
      }

      if (!ctx || !currentPoint) return;
      onDraw({ ctx, currentPoint, prevPoint: prevPointRef.current });
      prevPointRef.current = currentPoint;
    };

    const handleInteractEnd = () => {
      setMouseDown(false);
      prevPointRef.current = null;
    };

    //Add event listeners
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleInteractEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleInteractEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleInteractEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleInteractEnd);
    };
  }, [onDraw, mouseDown]);

  return { canvasRef, clear, onInteractStart, undo };
};
