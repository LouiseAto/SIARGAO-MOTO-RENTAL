# 🔐 Fix Login Issue - Complete Guide

## 🎯 Problem

You're being redirected back to the login page after attempting to log in.

## 🔍 Root Cause

The admin user account hasn't been properly set up in Supabase. You need to:
1. Create the user in Supabase Authentication
2. Link the user to the `admins` table in the database

---

## ✅ Solution - Step by Step

### Step 1: Check if User Exists in Supabase Auth

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm
2. Click **Authentication** in the left sidebar
3. Click **Users** tab
4. Look for: **louise.ato@urios.edu.ph**

**If the user EXISTS:**
- Note down the User ID (UUID)
- Go to Step 2

**If the user DOES NOT exist:**
- Go to Step 1B below

---

### Step 1B: Create User in Supabase Auth (If Doesn't Exist)

1. In **Authentication** → **Users**, click **"Add user"**
2. Select **"Create new user"**
3. Fill in:
   ```
   Email: louise.ato@urios.edu.ph
   Password: [Choose a secure password]
   ```
   **Example password:** `Admin123!` or your own secure password

4. Click **"Create user"**
5. **IMPORTANT:** Copy the User ID (UUID) that appears
   - It looks like: `16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1`
   - You'll need this in the next step

---

### Step 2: Link User to Admins Table

1. Go to **SQL Editor**: https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm/sql
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- First, check if admin record already exists
SELECT * FROM admins WHERE email = 'louise.ato@urios.edu.ph';

-- If no record exists, insert it
-- Replace 'YOUR_USER_ID_HERE' with the actual User ID from Step 1
INSERT INTO admins (id, email, full_name, role)
VALUES (
  '16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1',  -- Replace with your actual User ID
  'louise.ato@urios.edu.ph',
  'Louise Ato',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Verify the admin record was created
SELECT * FROM admins WHERE email = 'louise.ato@urios.edu.ph';
```

4. **IMPORTANT:** Replace `16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1` with your actual User ID from Step 1
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: ✅ **"Success. 1 rows affected"**

---

### Step 3: Verify Setup

Run this verification query in SQL Editor:

```sql
-- Check if everything is linked correctly
SELECT 
  a.id as admin_id,
  a.email as admin_email,
  a.full_name,
  a.role,
  u.id as auth_id,
  u.email as auth_email,
  u.confirmed_at,
  CASE 
    WHEN a.id = u.id THEN '✅ IDs MATCH' 
    ELSE '❌ IDs DO NOT MATCH' 
  END as status
FROM admins a
LEFT JOIN auth.users u ON a.id = u.id
WHERE a.email = 'louise.ato@urios.edu.ph';
```

**Expected Result:**
```
admin_id: 16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1
admin_email: louise.ato@urios.edu.ph
full_name: Louise Ato
role: admin
auth_id: 16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1
auth_email: louise.ato@urios.edu.ph
confirmed_at: [timestamp]
status: ✅ IDs MATCH
```

---

### Step 4: Test Login

1. Go to: **http://localhost:3000/login**
2. Enter:
   - **Email:** louise.ato@urios.edu.ph
   - **Password:** [The password you set in Step 1B]
3. Click **"Sign In"**
4. You should be redirected to: **http://localhost:3000/dashboard**

---

## 🆘 Troubleshooting

### Issue 1: "Invalid login credentials"

**Possible Causes:**
- Wrong password
- User not confirmed in Supabase
- User doesn't exist

**Solution:**
1. Go to Supabase → Authentication → Users
2. Find louise.ato@urios.edu.ph
3. Check if user is confirmed (green checkmark)
4. If not confirmed, click the user and click "Confirm email"
5. Or reset the password

---

### Issue 2: "User not authorized" or redirects back to login

**Possible Causes:**
- Admin record doesn't exist in `admins` table
- User ID mismatch between auth.users and admins table

**Solution:**
1. Run the verification query from Step 3
2. Check if status shows "✅ IDs MATCH"
3. If not, the IDs don't match - you need to:
   - Get the correct User ID from auth.users
   - Update the admins table with the correct ID

```sql
-- Get the correct User ID
SELECT id, email FROM auth.users WHERE email = 'louise.ato@urios.edu.ph';

-- Delete old admin record
DELETE FROM admins WHERE email = 'louise.ato@urios.edu.ph';

-- Insert with correct User ID (replace with actual ID from above query)
INSERT INTO admins (id, email, full_name, role)
VALUES (
  'CORRECT_USER_ID_FROM_ABOVE',
  'louise.ato@urios.edu.ph',
  'Louise Ato',
  'admin'
);
```

---

### Issue 3: Still redirects to login after successful authentication

**Possible Causes:**
- Cookies not being set properly
- Browser cache issue

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try in incognito/private mode
3. Check browser console (F12) for errors
4. Make sure you're using http://localhost:3000 (not 127.0.0.1)

---

### Issue 4: "Email not confirmed"

**Solution:**
1. Go to Supabase → Authentication → Users
2. Find louise.ato@urios.edu.ph
3. Click on the user
4. Click **"Confirm email"** button
5. Try logging in again

---

## 📋 Quick Checklist

- [ ] User exists in Supabase Authentication
- [ ] User email is confirmed
- [ ] Admin record exists in `admins` table
- [ ] User ID matches in both auth.users and admins table
- [ ] Password is correct
- [ ] Browser cache cleared
- [ ] Using http://localhost:3000
- [ ] No console errors

---

## 🔑 Your Admin Credentials

**Email:** louise.ato@urios.edu.ph  
**User ID:** 16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1  
**Password:** [Set by you in Supabase]

---

## 📝 Complete Setup SQL Script

If you want to start fresh, run this complete script:

```sql
-- 1. Check if user exists in auth
SELECT id, email, confirmed_at FROM auth.users 
WHERE email = 'louise.ato@urios.edu.ph';

-- 2. If user exists, note the ID and use it below
-- If user doesn't exist, create it in Supabase UI first

-- 3. Delete any existing admin record
DELETE FROM admins WHERE email = 'louise.ato@urios.edu.ph';

-- 4. Create admin record with correct User ID
INSERT INTO admins (id, email, full_name, role)
VALUES (
  '16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1',  -- Replace with actual User ID
  'louise.ato@urios.edu.ph',
  'Louise Ato',
  'admin'
);

-- 5. Verify everything is correct
SELECT 
  a.id as admin_id,
  a.email as admin_email,
  a.full_name,
  a.role,
  u.id as auth_id,
  u.email as auth_email,
  u.confirmed_at,
  CASE 
    WHEN a.id = u.id THEN '✅ CORRECT' 
    ELSE '❌ MISMATCH' 
  END as status
FROM admins a
LEFT JOIN auth.users u ON a.id = u.id
WHERE a.email = 'louise.ato@urios.edu.ph';
```

---

## 🎯 Expected Flow

1. **User enters credentials** → Login page
2. **Supabase authenticates** → Checks auth.users table
3. **Session created** → Cookies set
4. **Middleware checks** → Verifies user is authenticated
5. **Redirects to dashboard** → Success!

---

## 🔗 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm
- **SQL Editor:** https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm/sql
- **Authentication:** https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm/auth/users
- **Login Page:** http://localhost:3000/login

---

## ✅ Success Indicators

You'll know it's working when:
1. ✅ You can log in without being redirected back
2. ✅ You see the dashboard after login
3. ✅ Sidebar shows your name or email
4. ✅ You can navigate to all pages
5. ✅ No "unauthorized" errors

---

## 🎉 After Successful Login

Once you're logged in, you should see:
- ✅ Dashboard with stats
- ✅ Sidebar navigation
- ✅ All modules accessible
- ✅ Data from seed migration (if you ran it)

---

**Need more help?** Check the browser console (F12) for specific error messages and share them for more targeted assistance.

**Last Updated:** May 7, 2026  
**Status:** Ready to fix login issue
