# 🔧 Add Status Column to Payroll Table

## The Issue
The payroll table is missing the `status` column, so the Status column shows empty in the UI.

## Solution
Run this SQL migration in your Supabase database.

## Steps to Fix:

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: `ihllxghuehfeqkpqlvpm`

### 2. Open SQL Editor
- Click on **SQL Editor** in the left sidebar
- Click **New Query**

### 3. Copy and Paste This SQL:

```sql
-- Add status column to payroll table
ALTER TABLE payroll 
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled'));

-- Add index for status
CREATE INDEX idx_payroll_status ON payroll(status);

-- Update existing records to have 'paid' status
UPDATE payroll SET status = 'paid' WHERE status IS NULL;
```

### 4. Run the Query
- Click **Run** button (or press Ctrl+Enter)
- You should see: "Success. No rows returned"

### 5. Verify
- Go back to your app: https://siargao-moto-rental.vercel.app
- Navigate to Payroll page
- The Status column should now show "pending" or "paid"

## What This Does:
- ✅ Adds `status` column with default value 'pending'
- ✅ Allows only: 'pending', 'paid', or 'cancelled'
- ✅ Updates existing payroll records to 'paid' status
- ✅ Adds database index for better performance

## After Running:
The Hours and Status columns will display correctly in your payroll table!
