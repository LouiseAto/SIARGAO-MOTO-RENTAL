-- ============================================
-- FIX USER ID AND TEST LOGIN
-- ============================================
-- Run this in Supabase SQL Editor NOW
-- ============================================

-- Step 1: Check current state
SELECT 
  'BEFORE FIX' as status,
  a.id as admin_table_id,
  u.id as auth_users_id,
  CASE 
    WHEN a.id = u.id THEN '✅ Already matches!'
    ELSE '❌ Needs fixing'
  END as match_status
FROM admins a
FULL OUTER JOIN auth.users u ON a.email = u.email
WHERE COALESCE(a.email, u.email) = 'louise.ato@urios.edu.ph';

-- Step 2: Fix the User ID
UPDATE admins 
SET id = '16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1'
WHERE email = 'louise.ato@urios.edu.ph';

-- Step 3: Verify the fix
SELECT 
  'AFTER FIX' as status,
  a.id as admin_table_id,
  u.id as auth_users_id,
  CASE 
    WHEN a.id = u.id THEN '✅ FIXED! GO LOGIN NOW!'
    ELSE '❌ Still mismatch - contact support'
  END as match_status
FROM admins a
JOIN auth.users u ON a.email = u.email
WHERE a.email = 'louise.ato@urios.edu.ph';
