import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { TeamId } from "@/types/team";

export type PlayerCoordinate = {
  x: number;
  y: number;
};

type DragState = {
  team: TeamId;
  index: number;
} | null;

const DRAG_THRESHOLD = 15; // pixels - tuned for mobile experience

export function usePlayerDrag() {
  const [dragging, setDragging] = useState<DragState>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDragThresholdExceededRef = useRef(false);

  const startDrag = (team: TeamId, index: number, startX: number, startY: number) => {
    setDragging({ team, index });
    dragStartPosRef.current = { x: startX, y: startY };
    isDragThresholdExceededRef.current = false;
  };

  const checkThreshold = (clientX: number, clientY: number): boolean => {
    if (!dragStartPosRef.current) return false;

    const deltaX = Math.abs(clientX - dragStartPosRef.current.x);
    const deltaY = Math.abs(clientY - dragStartPosRef.current.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    return distance > DRAG_THRESHOLD;
  };

  const updateDragThreshold = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDragThresholdExceededRef.current) {
      if (checkThreshold(event.clientX, event.clientY)) {
        isDragThresholdExceededRef.current = true;
      }
    }
    return isDragThresholdExceededRef.current;
  };

  const endDrag = () => {
    setDragging(null);
    dragStartPosRef.current = null;
    isDragThresholdExceededRef.current = false;
  };

  const shouldUpdatePosition = () => isDragThresholdExceededRef.current;

  return {
    dragging,
    startDrag,
    updateDragThreshold,
    endDrag,
    shouldUpdatePosition,
  };
}
