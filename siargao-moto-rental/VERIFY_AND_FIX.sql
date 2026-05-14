-- ============================================
-- VERIFY AND FIX USER ID MATCHING
-- ============================================
-- Your auth user UID: 16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1
-- Email: louise.ato@urios.edu.ph

-- Step 1: Check current state
SELECT 
  '1. CURRENT STATE' as step,
  'AUTH USER' as source,
  id::text as user_id,
  email,
  confirmed_at::text as status
FROM auth.users 
WHERE email = 'louise.ato@urios.edu.ph'

UNION ALL

SELECT 
  '1. CURRENT STATE' as step,
  'ADMIN RECORD' as source,
  id::text as user_id,
  email,
  created_at::text as status
FROM admins 
WHERE email = 'louise.ato@urios.edu.ph';

-- Step 2: Check if IDs match
SELECT 
  '2. ID MATCH CHECK' as step,
  a.id::text as admin_id,
  u.id::text as auth_id,
  CASE 
    WHEN a.id = u.id THEN '✅ IDs MATCH - READY TO LOGIN!'
    ELSE '❌ IDs MISMATCH - NEED TO FIX'
  END as status,
  '' as email,
  '' as extra
FROM admins a
FULL OUTER JOIN auth.users u ON a.email = u.email
WHERE COALESCE(a.email, u.email) = 'louise.ato@urios.edu.ph';

-- Step 3: Fix the mismatch (if needed)
-- This will update the admins table to use the correct User ID from auth.users
UPDATE admins 
SET id = '16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1'
WHERE email = 'louise.ato@urios.edu.ph';

-- Step 4: Verify the fix worked
SELECT 
  '3. VERIFICATION' as step,
  a.id::text as admin_id,
  u.id::text as auth_id,
  CASE 
    WHEN a.id = u.id THEN '✅ FIXED! READY TO LOGIN!'
    ELSE '❌ STILL MISMATCH - CHECK MANUALLY'
  END as status,
  a.email,
  a.full_name as extra
FROM admins a
JOIN auth.users u ON a.email = u.email
WHERE a.email = 'louise.ato@urios.edu.ph';

-- Step 5: Check if email is confirmed
SELECT 
  '4. EMAIL CONFIRMATION' as step,
  id::text as user_id,
  email,
  CASE 
    WHEN confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMED'
    ELSE '❌ EMAIL NOT CONFIRMED - CONFIRM IN SUPABASE UI'
  END as status,
  confirmed_at::text as confirmed_at,
  '' as extra
FROM auth.users 
WHERE email = 'louise.ato@urios.edu.ph';
