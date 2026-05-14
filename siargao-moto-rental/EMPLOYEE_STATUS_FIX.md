# Employee Status Update Fix

## Problem
Employee status changes (Active → Inactive → On Leave) were not persisting to the database.

## Root Cause
1. **Database Schema Mismatch**: The database had `is_active` (boolean) column
2. **UI Sending Wrong Field**: The form was sending `status` (string: "active", "inactive", "on_leave")
3. **Validator Rejecting Field**: The Zod schema only accepted `is_active` (boolean), so `status` was being stripped out

## Solution

### 1. Updated Validator Schema (`lib/utils/validators.ts`)
- Changed from `is_active: z.boolean()` to `status: z.enum(['active', 'inactive', 'on_leave'])`
- Added 'manager' to the role enum

### 2. Created Database Migration (`supabase/migrations/002_add_employee_status.sql`)
- Creates `employee_status` enum type
- Adds `status` column to employees table
- Migrates existing `is_active` data to `status`
- Drops the old `is_active` column
- Adds index for performance

### 3. How to Apply the Fix

#### Option A: Using Supabase CLI (Recommended)
```bash
cd siargao-moto-rental
npx supabase db push
```

#### Option B: Manual SQL Execution
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/002_add_employee_status.sql`
4. Run the migration

#### Option C: Using psql
```bash
psql "your-database-connection-string" < supabase/migrations/002_add_employee_status.sql
```

### 4. Verify the Fix
After running the migration:
1. Refresh your app
2. Edit an employee's status
3. Check that the status persists after saving
4. Verify the badge colors:
   - Active → Blue
   - Inactive → Gray
   - On Leave → Red

## Files Modified
- ✅ `lib/utils/validators.ts` - Updated employee schema
- ✅ `supabase/migrations/002_add_employee_status.sql` - Database migration
- ✅ `components/modals/EmployeeModal.tsx` - Already correct (sends `status`)
- ✅ `app/api/employees/[id]/route.ts` - Already correct (uses validated data)
- ✅ `app/employees/page.tsx` - Already correct (displays status)

## Testing Checklist
- [ ] Run the database migration
- [ ] Add a new employee with status "Active"
- [ ] Edit employee status to "Inactive" - verify it persists
- [ ] Edit employee status to "On Leave" - verify it persists
- [ ] Check that the Active counter updates correctly
- [ ] Verify badge colors are correct
- [ ] Check that no console errors appear
