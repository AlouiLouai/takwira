import type { PointerEvent as ReactPointerEvent } from "react";
import type { PlayerCoordinate } from "@/hooks/use-player-drag";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function calculatePosition(
  event: ReactPointerEvent<HTMLButtonElement>,
  pitchRect: DOMRect
): PlayerCoordinate | null {
  if (!pitchRect || pitchRect.width === 0 || pitchRect.height === 0) {
    return null;
  }

  const relativeX = ((event.clientX - pitchRect.left) / pitchRect.width) * 100;
  const relativeY = ((event.clientY - pitchRect.top) / pitchRect.height) * 100;

  return {
    x: clamp(relativeX, 4, 96),
    y: clamp(relativeY, 4, 96),
  };
}
