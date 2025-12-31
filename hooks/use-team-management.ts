import { useState, useEffect, useCallback } from "react";
import type { PlayerSlotData } from "@/types/player";
import type { TeamId } from "@/types/team";
import {
  fetchAllPlayers,
  upsertPlayer,
  deletePlayer,
  subscribeToPlayers,
  type PlayerData,
} from "@/lib/supabase/players-service";
import { checkDatabaseSetup, type SetupStatus } from "@/lib/supabase/setup-checker";

type TeamsState = Record<TeamId, (PlayerSlotData | null)[]>;

const SLOT_COUNT = 7;

const createEmptyTeam = () =>
  Array.from({ length: SLOT_COUNT }, () => null as PlayerSlotData | null);

const createInitialTeams = (): TeamsState => ({
  A: createEmptyTeam(),
  B: createEmptyTeam(),
});

const generateSeed = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function useTeamManagement() {
  const [teams, setTeams] = useState<TeamsState>(() => createInitialTeams());
  const [selection, setSelection] = useState<{ team: TeamId; index: number } | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);

  // Check database setup and load players
  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if database is set up
      const status = await checkDatabaseSetup();
      setSetupStatus(status);

      if (status.isReady) {
        // Database is ready, load players
        await loadPlayers();
      } else {
        // Database not ready
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      setError('Failed to connect to database');
      setIsLoading(false);
    }
  }, []);

  // Subscribe to real-time updates (only if database is ready)
  useEffect(() => {
    if (!setupStatus?.isReady) return;

    const channel = subscribeToPlayers((payload) => {
      // Reload all players when changes occur
      loadPlayers();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [setupStatus]);

  const loadPlayers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const players = await fetchAllPlayers();

      // Convert database players to teams state
      const newTeams: TeamsState = createInitialTeams();

      players.forEach((player) => {
        newTeams[player.teamId][player.slotIndex] = {
          name: player.name,
          avatarSeed: player.avatarSeed,
        };
      });

      setTeams(newTeams);
    } catch (err) {
      console.error('Error loading players:', err);
      setError('Failed to load players');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openSheet = (team: TeamId, index: number) => {
    const roster = teams[team];
    setSelection({ team, index });
    setNameInput(roster[index]?.name ?? "");
  };

  const closeSheet = () => {
    setSelection(null);
    setNameInput("");
  };

  const persistEntry = async () => {
    if (!selection) return;
    const trimmed = nameInput.trim();

    try {
      setError(null);

      if (trimmed) {
        // Create or update player in database
        const existing = teams[selection.team][selection.index];
        const playerData: PlayerData = {
          name: trimmed,
          avatarSeed: existing?.avatarSeed ?? generateSeed(),
          teamId: selection.team,
          slotIndex: selection.index,
          positionX: 50, // Default position, will be updated by drag
          positionY: 50,
        };

        await upsertPlayer(playerData);

        // Update local state optimistically
        setTeams((prev) => {
          const next: TeamsState = {
            A: [...prev.A],
            B: [...prev.B],
          };
          next[selection.team][selection.index] = {
            name: trimmed,
            avatarSeed: playerData.avatarSeed,
          };
          return next;
        });
      } else {
        // Delete player if name is empty
        await deletePlayer(selection.team, selection.index);

        // Update local state
        setTeams((prev) => {
          const next: TeamsState = {
            A: [...prev.A],
            B: [...prev.B],
          };
          next[selection.team][selection.index] = null;
          return next;
        });
      }

      closeSheet();
    } catch (err) {
      console.error('Error persisting player:', err);
      setError('Failed to save player');
    }
  };

  const removeEntry = async () => {
    if (!selection) return;

    try {
      setError(null);

      await deletePlayer(selection.team, selection.index);

      // Update local state
      setTeams((prev) => {
        const next: TeamsState = {
          A: [...prev.A],
          B: [...prev.B],
        };
        next[selection.team][selection.index] = null;
        return next;
      });

      closeSheet();
    } catch (err) {
      console.error('Error removing player:', err);
      setError('Failed to remove player');
    }
  };

  return {
    teams,
    selection,
    nameInput,
    setNameInput,
    openSheet,
    closeSheet,
    persistEntry,
    removeEntry,
    isLoading,
    error,
    setupStatus,
  };
}
