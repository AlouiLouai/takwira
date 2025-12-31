import { supabase } from './client'

export type SetupStatus = {
  isReady: boolean
  error?: string
  message?: string
}

/**
 * Check if the database is properly set up
 */
export async function checkDatabaseSetup(): Promise<SetupStatus> {
  try {
    // Try to query the players table
    const { error } = await supabase
      .from('players')
      .select('id')
      .limit(1)

    if (error) {
      // Check if it's a "table not found" error
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        return {
          isReady: false,
          error: 'DATABASE_NOT_SETUP',
          message: 'Database table not created yet. Please run the SQL schema in Supabase.'
        }
      }

      // Other error (permissions, network, etc.)
      return {
        isReady: false,
        error: 'DATABASE_ERROR',
        message: error.message
      }
    }

    // Success - table exists
    return {
      isReady: true,
      message: 'Database is ready!'
    }
  } catch (err) {
    return {
      isReady: false,
      error: 'CONNECTION_ERROR',
      message: 'Failed to connect to database. Check your environment variables.'
    }
  }
}
