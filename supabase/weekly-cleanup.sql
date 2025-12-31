-- Weekly Database Cleanup
-- Runs every Tuesday at 15:00 Tunisian time (14:00 UTC)

-- Step 1: Enable pg_cron extension (only needs to be run once)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 2: Create a function to clear all players
CREATE OR REPLACE FUNCTION clear_all_players()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all players from the table
  DELETE FROM players;

  -- Log the cleanup (optional - for debugging)
  RAISE NOTICE 'Weekly cleanup completed at %', NOW();
END;
$$;

-- Step 3: Schedule the cron job
-- Runs every Tuesday at 14:00 UTC (15:00 Tunisia time)
-- Cron format: 'minute hour day-of-month month day-of-week'
-- day-of-week: 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
SELECT cron.schedule(
  'weekly-player-cleanup',           -- Job name
  '0 14 * * 2',                      -- Every Tuesday at 14:00 UTC (15:00 Tunisia)
  'SELECT clear_all_players();'      -- SQL to execute
);

-- To verify the cron job was created:
-- SELECT * FROM cron.job;

-- To unschedule (if needed):
-- SELECT cron.unschedule('weekly-player-cleanup');
