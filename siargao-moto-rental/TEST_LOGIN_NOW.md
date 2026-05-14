# 🔍 Debug Login Issue - Step by Step

## Step 1: Check Debug Page

1. Go to: **http://localhost:3000/debug-auth**
2. This page will show you:
   - ✅ If session exists
   - ✅ If user is authenticated
   - ✅ If admin record exists
   - ✅ Cookie information

3. **Take a screenshot** and share what you see

---

## Step 2: Test Login from Debug Page

1. On the debug page, click **"Test Login"**
2. Enter:
   - Email: `luwe.ato@gmail.com`
   - Password: [Your password]
3. Tell me what happens

---

## Step 3: Check Browser Console

1. Go to: http://localhost:3000/login
2. Press **F12** (Developer Tools)
3. Click **"Console"** tab
4. Try to log in
5. **Copy and paste** any error messages you see

---

## Step 4: Check Network Tab

1. Keep Developer Tools open (F12)
2. Click **"Network"** tab
3. Try to log in
4. Look for any failed requests (red)
5. Tell me which requests failed

---

## Step 5: Verify SQL Was Run

Did you run this SQL in Supabase?

```sql
-- Delete old admin record
DELETE FROM admins WHERE email = 'louise.ato@urios.edu.ph';

-- Create new admin record
INSERT INTO admins (id, email, full_name, role)
VALUES (
  'c939f4bb-592a-49ef-9b02-369958ef5be',
  'luwe.ato@gmail.com',
  'Louise Ato',
  'admin'
);
```

If not, **run it now** in Supabase SQL Editor.

---

## Step 6: Verify Email is Confirmed

1. Go to: https://supabase.com/dashboard/project/ihllxghuehfeqkpqlvpm/auth/users
2. Click on **luwe.ato@gmail.com**
3. Check if email is confirmed
4. If not, click **"Confirm email"**

---

## 🎯 What I Need From You

Please do Steps 1-6 and tell me:

1. What you see on the debug page
2. What error appears in the console
3. Did you run the SQL script?
4. Is the email confirmed?

This will help me identify the exact problem! 🔍
