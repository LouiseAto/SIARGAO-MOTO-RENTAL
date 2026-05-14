# Manual Migration Guide

Since Supabase doesn't allow direct SQL execution via the API for security reasons, you need to run the migrations manually through the Supabase Dashboard.

## Step-by-Step Instructions

### Step 1: Access Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **ihllxghuehfeqkpqlvpm**
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run Migration 001 (Schema)

1. Click **New Query** button
2. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** button (or press Ctrl+Enter)
5. Wait for "Success. No rows returned" message

### Step 3: Run Migration 002 (Seed Data)

1. Click **New Query** button again
2. Copy the entire contents of `supabase/migrations/002_seed_data.sql`
3. Paste it into the SQL Editor
4. Click **Run** button
5. Wait for success message

### Step 4: Create Admin User

#### 4.1 Create Auth User

1. Go to **Authentication** > **Users** in the left sidebar
2. Click **Add user** button
3. Select **Create new user**
4. Enter:
   - **Email**: `admin@siargao-moto.com`
   - **Password**: `Admin123!` (or your preferred password)
5. Click **Create user**
6. **IMPORTANT**: Copy the **User ID** (UUID) that appears

#### 4.2 Create Admin Record

1. Go back to **SQL Editor**
2. Click **New Query**
3. Paste this SQL (replace `YOUR_USER_ID_HERE` with the copied UUID):

```sql
INSERT INTO admins (id, email, full_name, role)
VALUES ('YOUR_USER_ID_HERE', 'admin@siargao-moto.com', 'Admin User', 'admin');
```

4. Click **Run**
5. You should see "Success. 1 rows affected"

### Step 5: Verify Installation

Run this query to verify everything is set up:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check sample data
SELECT COUNT(*) as motorbike_count FROM motorbikes;
SELECT COUNT(*) as customer_count FROM customers;
SELECT COUNT(*) as employee_count FROM employees;
SELECT COUNT(*) as admin_count FROM admins;
```

Expected results:
- 6 tables (admins, motorbikes, customers, rentals, employees, payroll)
- 5 motorbikes
- 3 customers
- 3 employees
- 1 admin

### Step 6: Test the Application

1. Open your terminal
2. Navigate to the project folder:
   ```bash
   cd siargao-moto-rental
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)
5. Login with:
   - **Email**: `admin@siargao-moto.com`
   - **Password**: `Admin123!` (or what you set)

## Troubleshooting

### Error: "relation already exists"

This means the tables are already created. You can either:

**Option A: Drop and recreate (WARNING: Deletes all data)**
```sql
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS motorbikes CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TYPE IF EXISTS employee_role CASCADE;
DROP TYPE IF EXISTS motorbike_status CASCADE;
DROP TYPE IF EXISTS rental_status CASCADE;
```
Then run migration 001 again.

**Option B: Skip to seed data**
If the schema is already correct, just run migration 002.

### Error: "duplicate key value violates unique constraint"

This means the seed data is already inserted. You can skip migration 002 or delete existing data first:

```sql
DELETE FROM payroll;
DELETE FROM rentals;
DELETE FROM employees;
DELETE FROM customers;
DELETE FROM motorbikes;
```

Then run migration 002 again.

### Error: "permission denied"

Make sure you're using the SQL Editor in the Supabase Dashboard, not trying to run it from the application.

### Can't login after creating admin user

1. Verify the admin record exists:
   ```sql
   SELECT * FROM admins;
   ```

2. Verify the user ID matches:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'admin@siargao-moto.com';
   ```

3. The `id` from `auth.users` should match the `id` in `admins` table.

## Quick Reference

**Your Supabase Project**: https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm

**Migration Files Location**:
- Schema: `siargao-moto-rental/supabase/migrations/001_initial_schema.sql`
- Seed Data: `siargao-moto-rental/supabase/migrations/002_seed_data.sql`

**Default Admin Credentials**:
- Email: `admin@siargao-moto.com`
- Password: `Admin123!` (or what you set)

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify your Supabase project is active
3. Ensure you're using the SQL Editor in the dashboard
4. Check that your .env.local has the correct credentials
5. Try refreshing the Supabase dashboard

---

**Once migrations are complete, you're ready to use the application!** 🎉
