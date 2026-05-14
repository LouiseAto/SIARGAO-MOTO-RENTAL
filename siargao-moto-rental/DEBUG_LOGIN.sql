-- ============================================
-- COMPLETE LOGIN DIAGNOSTIC
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- It will show you EXACTLY what's wrong
-- ============================================

-- 1. Check if user exists in auth.users
SELECT 
  '1️⃣ AUTH USER EXISTS?' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ YES'
    ELSE '❌ NO - User not found!'
  END as status
FROM auth.users 
WHERE email = 'louise.ato@urios.edu.ph';

-- 2. Check user details
SELECT 
  '2️⃣ USER DETAILS' as check_name,
  id::text as user_id,
  email,
  CASE 
    WHEN confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not confirmed'
  END as email_status,
  confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'louise.ato@urios.edu.ph';

-- 3. Check if admin record exists
SELECT 
  '3️⃣ ADMIN RECORD EXISTS?' as check_name,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ YES'
    ELSE '❌ NO - Admin record missing!'
  END as status
FROM admins 
WHERE email = 'louise.ato@urios.edu.ph';

-- 4. Check admin details
SELECT 
  '4️⃣ ADMIN DETAILS' as check_name,
  id::text as admin_id,
  email,
  full_name,
  role
FROM admins 
WHERE email = 'louise.ato@urios.edu.ph';

-- 5. THE CRITICAL CHECK - Do IDs match?
SELECT 
  '5️⃣ USER IDs MATCH?' as check_name,
  a.id::text as admin_table_id,
  u.id::text as auth_users_id,
  CASE 
    WHEN a.id = u.id THEN '✅ IDs MATCH - Should work!'
    WHEN a.id IS NULL THEN '❌ Admin record missing'
    WHEN u.id IS NULL THEN '❌ Auth user missing'
    ELSE '❌ IDs DO NOT MATCH - THIS IS THE PROBLEM!'
  END as status
FROM admins a
FULL OUTER JOIN auth.users u ON a.email = u.email
WHERE COALESCE(a.email, u.email) = 'louise.ato@urios.edu.ph';

-- 6. Check if there are multiple admin records (shouldn't be)
SELECT 
  '6️⃣ DUPLICATE CHECK' as check_name,
  COUNT(*) as admin_count,
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ Only one record'
    WHEN COUNT(*) > 1 THEN '⚠️ MULTIPLE RECORDS - Problem!'
    ELSE '❌ No records'
  END as status
FROM admins 
WHERE email = 'louise.ato@urios.edu.ph';

-- 7. Show all admin records for this email
SELECT 
  '7️⃣ ALL ADMIN RECORDS' as check_name,
  id::text,
  email,
  full_name,
  role,
  created_at
FROM admins 
WHERE email = 'louise.ato@urios.edu.ph';

-- ============================================
-- IF CHECK #5 SHOWS IDs DON'T MATCH, RUN THIS:
-- ============================================

-- First, delete any wrong admin records
DELETE FROM admins WHERE email = 'louise.ato@urios.edu.ph';

-- Then insert with correct User ID
INSERT INTO admins (id, email, full_name, role)
VALUES (
  '16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1',
  'louise.ato@urios.edu.ph',
  'Louise Ato',
  'admin'
);

-- Verify it worked
SELECT 
  '✅ VERIFICATION' as check_name,
  a.id::text as admin_id,
  u.id::text as auth_id,
  CASE 
    WHEN a.id = u.id THEN '✅✅✅ FIXED! TRY LOGIN NOW!'
    ELSE '❌ Still wrong - check User ID'
  END as status
FROM admins a
JOIN auth.users u ON a.email = u.email
WHERE a.email = 'louise.ato@urios.edu.ph';
