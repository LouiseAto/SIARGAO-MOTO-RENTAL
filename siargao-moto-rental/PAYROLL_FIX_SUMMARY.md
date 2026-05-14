# 🔧 Payroll Hours & Status Fix

## The Problem
- ✅ Hours column exists but shows "-" for all records
- ❌ Status column is missing from the database

## The Solution

### Step 1: Add Status Column to Database ⚠️ **YOU NEED TO DO THIS**

Go to Supabase and run this SQL:

```sql
ALTER TABLE payroll 
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled'));

CREATE INDEX idx_payroll_status ON payroll(status);

UPDATE payroll SET status = 'paid' WHERE status IS NULL;
```

**How to run:**
1. Go to https://supabase.com/dashboard
2. Select project: `ihllxghuehfeqkpqlvpm`
3. Click **SQL Editor** → **New Query**
4. Paste the SQL above
5. Click **Run**

### Step 2: Code Already Updated ✅

The code has been updated to:
- ✅ Display Hours column (shows hours worked or "-")
- ✅ Display Status column (will show after you run the SQL)
- ✅ Save status as "pending" when generating new payroll
- ✅ Filter by status (pending/paid)
- ✅ Export includes hours and status

## After Running the SQL:

Your payroll table will show:
- **Hours**: Actual hours worked for hourly employees
- **Status**: "pending" or "paid" badges

## Why Hours Shows "-"

Hours will show "-" for:
- Salaried employees (they don't track hours)
- Records created before hours tracking was added

To see hours:
1. Generate new payroll
2. Enter hours for hourly employees
3. Hours will display in the table

## Current Status:
- ✅ Code deployed
- ⏳ Waiting for you to run the SQL migration
- ⏳ Then Hours and Status will display correctly
