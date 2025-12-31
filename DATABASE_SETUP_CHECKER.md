# Database Setup Checker

## What It Does

The app now **automatically checks** if your Supabase database is properly configured when it starts. If the database isn't set up yet, you'll see a helpful setup guide instead of cryptic errors.

## User Experience

### ✅ Database Ready
```
⚽ (loading animation)
Loading your squad...
↓
Your app loads normally
```

### ⚠️ Database Not Set Up
```
⚠️
Database Setup Required

Quick Setup Steps:
1. Open Supabase Dashboard
2. Open SQL Editor
3. Run the Schema
4. Refresh This Page
```

## How It Works

### Architecture

```
App Starts
    ↓
Check Database Setup (lib/supabase/setup-checker.ts)
    ↓
┌─────────────┬────────────────┐
│ Ready?      │ Action         │
├─────────────┼────────────────┤
│ ✅ Yes      │ Load players   │
│ ❌ No       │ Show guide     │
│ ⚠️ Error    │ Show error     │
└─────────────┴────────────────┘
```

### Files Created

1. **`lib/supabase/setup-checker.ts`**
   - Checks if `players` table exists
   - Returns setup status
   - Identifies specific error types

2. **`components/setup-guide.tsx`**
   - Beautiful setup guide UI
   - Step-by-step instructions
   - Refresh button
   - Links to documentation

3. **Updated `hooks/use-team-management.ts`**
   - Runs setup check on mount
   - Only loads players if database is ready
   - Stores setup status in state

4. **Updated `app/page.tsx`**
   - Shows setup guide when needed
   - Falls back gracefully
   - Better error messages

## Error Types

### `DATABASE_NOT_SETUP`
**Cause:** Players table doesn't exist
**Solution:** Run the SQL schema in Supabase

### `DATABASE_ERROR`
**Cause:** Other database issues (permissions, etc.)
**Solution:** Check Supabase project status and API keys

### `CONNECTION_ERROR`
**Cause:** Can't connect to Supabase
**Solution:** Verify environment variables are set

## Setup Checker Function

```typescript
export async function checkDatabaseSetup(): Promise<SetupStatus> {
  // Try to query the players table
  const { error } = await supabase
    .from('players')
    .select('id')
    .limit(1)

  if (error) {
    // Identify error type
    if (error.code === 'PGRST205') {
      return { isReady: false, error: 'DATABASE_NOT_SETUP' }
    }
    return { isReady: false, error: 'DATABASE_ERROR' }
  }

  return { isReady: true }
}
```

## Benefits

### For Users
- ✅ No more cryptic error messages
- ✅ Clear instructions on what to do
- ✅ One-click refresh after setup
- ✅ Links to documentation

### For Developers
- ✅ Cleaner error handling
- ✅ Better debugging
- ✅ Prevents partial failures
- ✅ Graceful degradation

## Testing

### Test Setup Guide Display

1. **Don't run the SQL schema yet**
2. Start your app: `npm run dev`
3. You should see the setup guide
4. Click links, test navigation
5. Run the schema in Supabase
6. Click "Refresh Page" button
7. App should load normally

### Test Error States

```typescript
// Simulate DATABASE_NOT_SETUP
// Don't run schema

// Simulate DATABASE_ERROR
// Use invalid API key

// Simulate CONNECTION_ERROR
// Remove environment variables
```

## Customization

### Change Error Messages

Edit `lib/supabase/setup-checker.ts`:

```typescript
return {
  isReady: false,
  error: 'DATABASE_NOT_SETUP',
  message: 'Your custom message here'
}
```

### Modify Setup Guide UI

Edit `components/setup-guide.tsx`:
- Change colors
- Add/remove steps
- Customize branding
- Add animations

### Add More Checks

Extend the setup checker:

```typescript
export async function checkDatabaseSetup(): Promise<SetupStatus> {
  // Check table exists
  const tableCheck = await checkTable()

  // Check RLS policies
  const rlsCheck = await checkRLS()

  // Check indexes
  const indexCheck = await checkIndexes()

  return {
    isReady: tableCheck && rlsCheck && indexCheck,
    // ...
  }
}
```

## Production Considerations

### Caching
The setup check runs on **every app mount**. For production:

```typescript
// Cache the result
const CACHE_KEY = 'db-setup-status'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function checkDatabaseSetup(): Promise<SetupStatus> {
  const cached = getCachedStatus()
  if (cached && !isExpired(cached)) return cached

  const status = await performCheck()
  cacheStatus(status)
  return status
}
```

### Monitoring
Add monitoring to track setup issues:

```typescript
if (!status.isReady) {
  // Log to monitoring service
  logError('Database setup incomplete', {
    error: status.error,
    message: status.message
  })
}
```

## Troubleshooting

### Setup guide keeps showing
- Verify SQL schema ran successfully
- Check for typos in table name
- Ensure API key has permissions
- Try clearing browser cache

### "Connection Error" message
- Verify `.env.local` exists
- Check environment variables are correct
- Restart dev server after adding variables
- Ensure Supabase project is active

### Still seeing errors after setup
- Check browser console for details
- Verify all migration statements succeeded
- Check Supabase project logs
- Ensure RLS policies are correct

## Future Enhancements

- [ ] Add automatic schema migration
- [ ] Implement setup wizard
- [ ] Add database health monitoring
- [ ] Cache setup status
- [ ] Add setup progress indicator
- [ ] Support schema versioning

---

**Note:** This setup checker is designed to help during initial setup and development. In production, consider implementing proper health checks and monitoring.
