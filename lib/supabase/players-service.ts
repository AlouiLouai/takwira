// @ts-nocheck - Types will be correct once database table is created
import { supabase } from './client'
import type { TeamId } from '@/types/team'

type Player = any
type PlayerInsert = any
type PlayerUpdate = any

export type PlayerData = {
  id?: string
  name: string
  avatarSeed: string
  teamId: TeamId
  slotIndex: number
  positionX: number
  positionY: number
}

/**
 * Fetch all players from the database
 */
export async function fetchAllPlayers(): Promise<PlayerData[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('team_id', { ascending: true })
    .order('slot_index', { ascending: true })

  if (error) {
    console.error('Error fetching players:', error)
    throw error
  }

  return (data || []).map(dbPlayerToPlayerData)
}

/**
 * Create or update a player
 */
export async function upsertPlayer(player: PlayerData): Promise<PlayerData> {
  const dbPlayer: PlayerInsert = {
    name: player.name,
    avatar_seed: player.avatarSeed,
    team_id: player.teamId,
    slot_index: player.slotIndex,
    position_x: player.positionX,
    position_y: player.positionY,
  }

  const { data, error } = await supabase
    .from('players')
    .upsert(dbPlayer, {
      onConflict: 'team_id,slot_index',
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting player:', error)
    throw error
  }

  return dbPlayerToPlayerData(data)
}

/**
 * Delete a player by team and slot
 */
export async function deletePlayer(teamId: TeamId, slotIndex: number): Promise<void> {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('team_id', teamId)
    .eq('slot_index', slotIndex)

  if (error) {
    console.error('Error deleting player:', error)
    throw error
  }
}

/**
 * Update player position
 */
export async function updatePlayerPosition(
  teamId: TeamId,
  slotIndex: number,
  positionX: number,
  positionY: number
): Promise<void> {
  const { error } = await supabase
    .from('players')
    .update({
      position_x: positionX,
      position_y: positionY,
    })
    .eq('team_id', teamId)
    .eq('slot_index', slotIndex)

  if (error) {
    console.error('Error updating player position:', error)
    throw error
  }
}

/**
 * Subscribe to real-time changes
 */
export function subscribeToPlayers(
  callback: (payload: { type: string; new: Player; old: Player }) => void
) {
  return supabase
    .channel('players-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
      },
      callback as any
    )
    .subscribe()
}

/**
 * Helper to convert database player to app player data
 */
function dbPlayerToPlayerData(dbPlayer: Player): PlayerData {
  return {
    id: dbPlayer.id,
    name: dbPlayer.name,
    avatarSeed: dbPlayer.avatar_seed,
    teamId: dbPlayer.team_id,
    slotIndex: dbPlayer.slot_index,
    positionX: dbPlayer.position_x,
    positionY: dbPlayer.position_y,
  }
}
