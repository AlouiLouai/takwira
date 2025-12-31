"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { PlayerSlot } from "@/components/player-slot";
import type { PlayerSlotData } from "@/types/player";
import type { TeamId } from "@/types/team";

type PlayerCoordinate = {
  x: number;
  y: number;
};

type TeamProps = {
  teamId: TeamId;
  name: string;
  players: (PlayerSlotData | null)[];
  color: string;
  onSelectSlot: (index: number) => void;
  onDragStart: (team: TeamId, index: number, startX: number, startY: number) => void;
  onPointerMove: (team: TeamId, index: number, event: ReactPointerEvent<HTMLButtonElement>) => void;
  onDragEnd: (
    team: TeamId,
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>,
    moved: boolean,
  ) => void;
  positions: PlayerCoordinate[];
};

export function Team({
  teamId,
  name,
  players,
  color,
  onSelectSlot,
  onDragStart,
  onPointerMove,
  onDragEnd,
  positions,
}: TeamProps) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-label={`${name} roster`}>
      {positions.map((point, index) => {
        return (
          <div
            key={`${name}-${index}`}
            className="pointer-events-auto absolute"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <PlayerSlot
              label={`${name} slot ${index + 1}`}
              name={players[index]?.name}
              avatarSeed={players[index]?.avatarSeed}
              onSelect={() => onSelectSlot(index)}
              onDragStart={(startX, startY) => onDragStart(teamId, index, startX, startY)}
              onPointerMove={(event) => onPointerMove(teamId, index, event)}
              onDragEnd={(event, moved) => onDragEnd(teamId, index, event, moved)}
              accentColor={color}
            />
          </div>
        );
      })}
    </div>
  );
}
