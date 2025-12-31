"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type PlayerSlotProps = {
  label: string;
  name?: string | null;
  avatarSeed?: string | null;
  onSelect: () => void;
  accentColor: string;
  onDragStart?: (startX: number, startY: number) => void;
  onPointerMove?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onDragEnd?: (event: ReactPointerEvent<HTMLButtonElement>, moved: boolean) => void;
};

const avatarUrlFor = (seed: string) =>
  `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;

export function PlayerSlot({
  label,
  name,
  avatarSeed,
  onSelect,
  accentColor,
  onDragStart,
  onPointerMove,
  onDragEnd,
}: PlayerSlotProps) {
  const hasPlayer = Boolean(name);
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  const avatarUrl = avatarSeed ? avatarUrlFor(avatarSeed) : null;
  const isDragging = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const pointerMovedRef = useRef(false);

  return (
    <div className="flex flex-col items-center text-center">
      <button
        type="button"
        aria-label={hasPlayer && initials ? `${label} - ${initials}` : `Add player to ${label}`}
        onClick={(event) => {
          if (isDragging.current || pointerMovedRef.current) {
            event.preventDefault();
            return;
          }
          onSelect();
        }}
        onPointerDown={(event) => {
          if (!hasPlayer) return;
          pointerIdRef.current = event.pointerId;
          pointerMovedRef.current = false;
          isDragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          onDragStart?.(event.clientX, event.clientY);
          event.preventDefault();
        }}
        onPointerMove={(event) => {
          if (pointerIdRef.current === null || event.pointerId !== pointerIdRef.current) return;
          pointerMovedRef.current = true;
          onPointerMove?.(event);
          event.preventDefault();
        }}
        onPointerUp={(event) => {
          if (pointerIdRef.current === null || event.pointerId !== pointerIdRef.current) return;
          event.currentTarget.releasePointerCapture(pointerIdRef.current);
          pointerIdRef.current = null;
          isDragging.current = false;
          const moved = pointerMovedRef.current;
          pointerMovedRef.current = false;
          const pointerEvent = event as ReactPointerEvent<HTMLButtonElement>;
          onDragEnd?.(pointerEvent, moved);
        }}
        onPointerCancel={(event) => {
          if (pointerIdRef.current === null || event.pointerId !== pointerIdRef.current) return;
          event.currentTarget.releasePointerCapture(pointerIdRef.current);
          pointerIdRef.current = null;
          isDragging.current = false;
          const moved = pointerMovedRef.current;
          pointerMovedRef.current = false;
          const pointerEvent = event as ReactPointerEvent<HTMLButtonElement>;
          onDragEnd?.(pointerEvent, moved);
        }}
        className={`group flex h-14 w-14 items-center justify-center rounded-full border bg-white/5 text-lg font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.4)] backdrop-blur transition group-hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${hasPlayer ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
        style={{
          minWidth: 56,
          minHeight: 56,
          borderColor: accentColor,
          color: accentColor,
          outlineColor: accentColor,
          touchAction: 'none', // Prevent browser default touch behaviors
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name ?? "Player placeholder"}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span>+</span>
        )}
        {!avatarUrl && initials ? (
          <span className="absolute text-base text-white">{initials}</span>
        ) : null}
      </button>
      {name ? (
        <p className="mt-1 max-w-[80px] truncate text-[11px] font-medium text-white/85">{name}</p>
      ) : (
        <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/50">Empty</span>
      )}
    </div>
  );
}
