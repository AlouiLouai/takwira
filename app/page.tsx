"use client";

import { useRef, useState, useEffect } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Pitch } from "@/components/pitch";
import { Team } from "@/components/team";
import { BottomSheet } from "@/components/bottom-sheet";
import { SetupGuide } from "@/components/setup-guide";
import { OnboardingOverlay } from "@/components/onboarding-overlay";
import type { TeamId } from "@/types/team";
import { usePlayerDrag, type PlayerCoordinate } from "@/hooks/use-player-drag";
import { useTeamManagement } from "@/hooks/use-team-management";
import { useOnboarding } from "@/hooks/use-onboarding";
import { calculatePosition } from "@/lib/position-utils";
import { updatePlayerPosition } from "@/lib/supabase/players-service";
const FORMATION_POINTS = [
  { x: 50, y: 6 },
  { x: 14, y: 22 },
  { x: 50, y: 20 },
  { x: 86, y: 22 },
  { x: 30, y: 36 },
  { x: 70, y: 36 },
  { x: 50, y: 42 },
] as const;

const TEAM_COLORS: Record<TeamId, string> = {
  A: "#54d1ff",
  B: "#ff7a7a",
};

type PositionsState = Record<TeamId, PlayerCoordinate[]>;

const createInitialPositions = (): PositionsState => ({
  A: FORMATION_POINTS.map((point) => ({ ...point })),
  B: FORMATION_POINTS.map((point) => ({ x: point.x, y: 100 - point.y })),
});

export default function Page() {
  const [positions, setPositions] = useState<PositionsState>(() => createInitialPositions());
  const pitchRef = useRef<HTMLDivElement>(null);
  const firstEmptySlotRef = useRef<HTMLDivElement>(null);
  const teamBRef = useRef<HTMLDivElement>(null);

  const { teams, selection, nameInput, setNameInput, openSheet, closeSheet, persistEntry, removeEntry, isLoading, error, setupStatus } =
    useTeamManagement();
  const { dragging, startDrag, updateDragThreshold, endDrag, shouldUpdatePosition } = usePlayerDrag();
  const { currentStep, isOnboardingCompleted, nextStep, skipTutorial, resetTutorial } = useOnboarding();

  const sheetTeamLabel = selection ? (selection.team === "A" ? "Team A" : "Team B") : "";
  const sheetSlotLabel = selection ? `Slot ${selection.index + 1}` : "";
  const activePlayer = selection ? teams[selection.team][selection.index]?.name ?? null : null;

  // Determine spotlight target based on onboarding step
  const [spotlightTarget, setSpotlightTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (currentStep === 0) {
      setSpotlightTarget(firstEmptySlotRef.current);
    } else if (currentStep === 3) {
      setSpotlightTarget(teamBRef.current);
    } else {
      setSpotlightTarget(null);
    }
  }, [currentStep]);

  // Wrapper for openSheet to handle onboarding detection
  const handleSlotSelect = (team: TeamId, index: number) => {
    const hasPlayer = Boolean(teams[team][index]);

    // Onboarding: advance from step 0 (add player) when user taps empty slot
    if (currentStep === 0 && !hasPlayer && !isOnboardingCompleted) {
      nextStep();
    }

    // Onboarding: advance from step 1 (edit player) when user taps filled slot
    if (currentStep === 1 && hasPlayer && !isOnboardingCompleted) {
      nextStep();
    }

    openSheet(team, index);
  };

  const handleDragStart = (team: TeamId, index: number, startX: number, startY: number) => {
    if (!teams[team][index]) return;
    startDrag(team, index, startX, startY);
  };

  const updatePosition = (
    team: TeamId,
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const rect = pitchRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position = calculatePosition(event, rect);
    if (!position) return;

    setPositions((prev) => ({
      A: prev.A.map((point, i) => (team === "A" && i === index ? position : { ...point })),
      B: prev.B.map((point, i) => (team === "B" && i === index ? position : { ...point })),
    }));
  };

  const handlePointerMove = (
    team: TeamId,
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    if (!dragging || dragging.team !== team || dragging.index !== index) return;

    if (updateDragThreshold(event)) {
      updatePosition(team, index, event);
    }
  };

  const handlePointerUp = async (
    team: TeamId,
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>,
    moved: boolean
  ) => {
    if (!dragging) return;

    if (moved && shouldUpdatePosition()) {
      updatePosition(team, index, event);

      // Onboarding: advance from step 2 (drag to move) when user drags
      if (currentStep === 2 && !isOnboardingCompleted) {
        nextStep();
      }

      // Persist position to database
      const rect = pitchRef.current?.getBoundingClientRect();
      if (rect && teams[team][index]) {
        const position = calculatePosition(event, rect);
        if (position) {
          try {
            await updatePlayerPosition(team, index, position.x, position.y);
          } catch (err) {
            console.error('Failed to save position:', err);
          }
        }
      }
    }

    endDrag();
  };

  // Show setup guide if database is not ready
  if (setupStatus && !setupStatus.isReady && !isLoading) {
    return <SetupGuide error={setupStatus.error} message={setupStatus.message} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <main className="flex min-h-screen min-h-svh flex-col items-center justify-center bg-pitch-green text-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚽</div>
          <p className="text-lg text-white/70">Loading your squad...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen min-h-svh flex-col overflow-hidden bg-pitch-green text-white">
      <header className="px-6 pt-[calc(1.5rem+var(--safe-top))] pb-4 relative">
        <h1 className="text-center text-3xl font-bold tracking-wider">
          <span className="font-serif bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
            Haya aad !!
          </span>{" "}
          <span className="inline-block">⚽🔥</span>
        </h1>
        <button
          onClick={resetTutorial}
          className="absolute right-6 top-[calc(1.5rem+var(--safe-top))] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition"
          aria-label="Show tutorial"
          title="Show tutorial"
        >
          ?
        </button>
        {error && (
          <div className="mt-2 text-center text-sm text-red-400">
            {error}
          </div>
        )}
      </header>
      <Pitch>
        <div ref={pitchRef} className="relative flex h-full w-full px-6 pb-8 pt-4">
          <div ref={currentStep === 0 ? firstEmptySlotRef : null}>
            <Team
              teamId="A"
              name="Team A"
              players={teams.A}
              color={TEAM_COLORS.A}
              onSelectSlot={(index) => handleSlotSelect("A", index)}
              onDragStart={handleDragStart}
              onPointerMove={handlePointerMove}
              onDragEnd={handlePointerUp}
              positions={positions.A}
            />
          </div>
          <div ref={currentStep === 3 ? teamBRef : null}>
            <Team
              teamId="B"
              name="Team B"
              players={teams.B}
              color={TEAM_COLORS.B}
              onSelectSlot={(index) => handleSlotSelect("B", index)}
              onDragStart={handleDragStart}
              onPointerMove={handlePointerMove}
              onDragEnd={handlePointerUp}
              positions={positions.B}
            />
          </div>
        </div>
      </Pitch>

      {selection ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0"
            onClick={closeSheet}
            aria-label="Close player sheet"
          />
          <div className="relative z-30">
            <BottomSheet
              teamColor={TEAM_COLORS[selection.team]}
              sheetTeamLabel={sheetTeamLabel}
              sheetSlotLabel={sheetSlotLabel}
              nameInput={nameInput}
              setNameInput={setNameInput}
              persistEntry={persistEntry}
              removeEntry={removeEntry}
              closeSheet={closeSheet}
              activePlayer={activePlayer}
            />
          </div>
        </div>
      ) : null}

      {/* Onboarding overlay */}
      {!isOnboardingCompleted && (
        <OnboardingOverlay
          currentStep={currentStep}
          onNext={nextStep}
          onSkip={skipTutorial}
          spotlightRef={spotlightTarget}
        />
      )}
    </main>
  );
}
