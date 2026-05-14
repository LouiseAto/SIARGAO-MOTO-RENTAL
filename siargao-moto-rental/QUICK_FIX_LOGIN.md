# 🚀 Quick Fix: Login Issue

**Problem:** You're being redirected back to login page  
**Time to Fix:** 2-3 minutes  
**Difficulty:** Easy

---

## 🎯 What You Need to Do

You need to create your admin user account in Supabase. The database record exists, but the authentication user doesn't.

Think of it like this:
- ✅ Your office desk is ready (database record)
- ❌ You don't have a key card yet (authentication user)

---

## ⚡ Quick Fix Steps

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm

### Step 2: Create Your User
1. Click **"Authentication"** (left sidebar)
2. Click **"Users"** tab
3. Click **"Add user"** button (top right)
4. Select **"Create new user"**
5. Fill in:
   - **Email:** `louise.ato@urios.edu.ph`
   - **Password:** Choose a secure password (e.g., `Admin123!`)
6. Click **"Create user"**

### Step 3: Confirm Email (if needed)
1. Find your user in the list
2. If it shows "Email not confirmed":
   - Click on the user
   - Click **"Confirm email"** button

### Step 4: Link User ID
1. Go to **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy and paste this:

```sql
-- Update admin record to match the auth user
UPDATE admins 
SET id = (
  SELECT id FROM auth.users 
  WHERE email = 'louise.ato@urios.edu.ph'
)
WHERE email = 'louise.ato@urios.edu.ph';

-- Verify it worked
SELECT 
  a.id as admin_id,
  u.id as auth_id,
  CASE 
    WHEN a.id = u.id THEN '✅ READY TO LOGIN!' 
    ELSE '❌ STILL MISMATCH' 
  END as status
FROM admins a
JOIN auth.users u ON a.email = u.email
WHERE a.email = 'louise.ato@urios.edu.ph';
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see: `✅ READY TO LOGIN!`

### Step 5: Test Login
1. Go to: http://localhost:3000/login
2. Enter:
   - **Email:** louise.ato@urios.edu.ph
   - **Password:** [The password you just set]
3. Click **"Sign In"**
4. You should see the dashboard! 🎉

---

## 🔍 Check Your Setup Status

Want to see what's missing? Run this diagnostic:

1. Go to **SQL Editor** in Supabase
2. Copy and paste the contents of: `supabase/check_admin_setup.sql`
3. Click **"Run"**
4. It will show you exactly what's set up and what's missing

---

## ❓ Common Issues

### "Invalid login credentials"
- **Fix:** Double-check your password or reset it in Supabase

### "Email not confirmed"
- **Fix:** Go to Authentication → Users → Click your user → Confirm email

### Still redirects to login
- **Fix:** Run the diagnostic SQL script to check if User IDs match

---

## 📚 More Help

- **Detailed Guide:** See `LOGIN_DIAGNOSTIC.md`
- **Troubleshooting:** See `FIX_LOGIN_ISSUE.md`
- **Check Setup:** Run `supabase/check_admin_setup.sql`

---

## ✅ Success Checklist

- [ ] User created in Supabase Authentication
- [ ] Email confirmed
- [ ] User ID linked to admin record
- [ ] Can log in successfully
- [ ] Dashboard loads

---

**Your Credentials:**
- **Email:** louise.ato@urios.edu.ph
- **Password:** [Set by you in Supabase]

**Quick Links:**
- [Supabase Dashboard](https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm)
- [Authentication Users](https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm/auth/users)
- [SQL Editor](https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm/sql)
- [Login Page](http://localhost:3000/login)

---

**Status:** Ready to create user  
**Next:** Follow Step 1 above
