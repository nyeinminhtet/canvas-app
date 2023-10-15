"use client";

import { useCanvasStore } from "@/store/canvasStore";
import { Label } from "./ui/ui/label";
import { Slider } from "./ui/ui/slider";

export default function StrokeWidthSlider() {
  const [strokeWidth, setStrokeWidth] = useCanvasStore((state) => [
    state.strokeWidth,
    state.setStrokeWidth,
  ]);

  return (
    <div>
      <div className="mb-4 flex select-none items-center justify-between">
        <Label htmlFor="strokeWidth">Stroke Width</Label>

        <span className="px-2 py-0.5 text-sm text-muted-foreground">
          {strokeWidth[0]}
        </span>
      </div>

      <Slider
        id="strokeWidth"
        min={1}
        max={50}
        step={1}
        value={strokeWidth}
        onValueChange={setStrokeWidth}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="Stroke width"
      />
    </div>
  );
}
