-- ============================================
-- ADMIN SETUP DIAGNOSTIC SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to check your admin setup status
-- Email: louise.ato@urios.edu.ph
-- Expected User ID: 16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1

-- ============================================
-- 1. CHECK IF USER EXISTS IN AUTH.USERS
-- ============================================
SELECT 
  '1. AUTH USER CHECK' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ User exists in auth.users'
    ELSE '❌ User NOT found in auth.users - CREATE USER FIRST!'
  END as status,
  COUNT(*) as user_count
FROM auth.users 
WHERE email = 'louise.ato@urios.edu.ph';

-- ============================================
-- 2. CHECK USER DETAILS
-- ============================================
SELECT 
  '2. USER DETAILS' as check_name,
  id as user_id,
  email,
  CASE 
    WHEN confirmed_at IS NOT NULL THEN '✅ Email confirmed'
    ELSE '❌ Email NOT confirmed - CONFIRM EMAIL!'
  END as email_status,
  confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'louise.ato@urios.edu.ph';

-- ============================================
-- 3. CHECK IF ADMIN RECORD EXISTS
-- ============================================
SELECT 
  '3. ADMIN RECORD CHECK' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin record exists'
    ELSE '❌ Admin record NOT found - RUN MIGRATION!'
  END as status,
  COUNT(*) as admin_count
FROM admins 
WHERE email = 'louise.ato@urios.edu.ph';

-- ============================================
-- 4. CHECK ADMIN RECORD DETAILS
-- ============================================
SELECT 
  '4. ADMIN DETAILS' as check_name,
  id as admin_id,
  email,
  full_name,
  role,
  created_at
FROM admins 
WHERE email = 'louise.ato@urios.edu.ph';

-- ============================================
-- 5. CHECK IF USER IDs MATCH (CRITICAL!)
-- ============================================
SELECT 
  '5. USER ID MATCH CHECK' as check_name,
  a.id as admin_id,
  u.id as auth_id,
  CASE 
    WHEN a.id = u.id THEN '✅ IDs MATCH - READY TO LOGIN!'
    WHEN a.id IS NULL THEN '❌ Admin record missing'
    WHEN u.id IS NULL THEN '❌ Auth user missing'
    ELSE '❌ IDs DO NOT MATCH - FIX REQUIRED!'
  END as status,
  CASE 
    WHEN a.id = u.id THEN 'No action needed'
    WHEN a.id IS NULL THEN 'Run migration: 003_create_admin_user.sql'
    WHEN u.id IS NULL THEN 'Create user in Supabase Authentication'
    ELSE 'Run the fix query below'
  END as action_required
FROM admins a
FULL OUTER JOIN auth.users u ON a.email = u.email
WHERE COALESCE(a.email, u.email) = 'louise.ato@urios.edu.ph';

-- ============================================
-- 6. COMPLETE STATUS SUMMARY
-- ============================================
SELECT 
  '6. COMPLETE STATUS' as check_name,
  CASE 
    WHEN auth_exists AND admin_exists AND ids_match AND email_confirmed THEN '✅ READY TO LOGIN!'
    WHEN NOT auth_exists THEN '❌ CREATE USER IN SUPABASE AUTH'
    WHEN NOT email_confirmed THEN '❌ CONFIRM EMAIL IN SUPABASE'
    WHEN NOT admin_exists THEN '❌ RUN ADMIN MIGRATION'
    WHEN NOT ids_match THEN '❌ FIX USER ID MISMATCH'
    ELSE '⚠️ UNKNOWN ISSUE'
  END as overall_status,
  CASE 
    WHEN auth_exists AND admin_exists AND ids_match AND email_confirmed THEN 'Go to http://localhost:3000/login and sign in!'
    WHEN NOT auth_exists THEN 'Step 1: Create user in Authentication → Users → Add user'
    WHEN NOT email_confirmed THEN 'Step 2: Click user → Confirm email'
    WHEN NOT admin_exists THEN 'Step 3: Run migration 003_create_admin_user.sql'
    WHEN NOT ids_match THEN 'Step 4: Run the FIX QUERY below'
    ELSE 'Check previous results for details'
  END as next_step
FROM (
  SELECT 
    EXISTS(SELECT 1 FROM auth.users WHERE email = 'louise.ato@urios.edu.ph') as auth_exists,
    EXISTS(SELECT 1 FROM admins WHERE email = 'louise.ato@urios.edu.ph') as admin_exists,
    EXISTS(
      SELECT 1 FROM admins a
      JOIN auth.users u ON a.id = u.id
      WHERE a.email = 'louise.ato@urios.edu.ph'
    ) as ids_match,
    EXISTS(
      SELECT 1 FROM auth.users 
      WHERE email = 'louise.ato@urios.edu.ph' 
      AND confirmed_at IS NOT NULL
    ) as email_confirmed
) status;

-- ============================================
-- 7. DETAILED COMPARISON
-- ============================================
SELECT 
  '7. SIDE-BY-SIDE COMPARISON' as check_name,
  'AUTH USER' as source,
  u.id,
  u.email,
  u.confirmed_at::text as confirmed_or_created,
  'N/A' as role
FROM auth.users u
WHERE u.email = 'louise.ato@urios.edu.ph'

UNION ALL

SELECT 
  '7. SIDE-BY-SIDE COMPARISON' as check_name,
  'ADMIN RECORD' as source,
  a.id,
  a.email,
  a.created_at::text as confirmed_or_created,
  a.role
FROM admins a
WHERE a.email = 'louise.ato@urios.edu.ph';

-- ============================================
-- FIX QUERY (Run only if IDs don't match)
-- ============================================
-- Uncomment and run this if check #5 shows IDs don't match:

/*
DO $$
DECLARE
  actual_user_id UUID;
BEGIN
  -- Get the real User ID from auth.users
  SELECT id INTO actual_user_id
  FROM auth.users 
  WHERE email = 'louise.ato@urios.edu.ph';
  
  IF actual_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users. Create user first!';
  END IF;
  
  -- Update the admins table with the correct User ID
  UPDATE admins 
  SET id = actual_user_id
  WHERE email = 'louise.ato@urios.edu.ph';
  
  -- Show the result
  RAISE NOTICE 'Updated admin record to use User ID: %', actual_user_id;
END $$;

-- Verify the fix worked
SELECT 
  a.id as admin_id,
  u.id as auth_id,
  CASE 
    WHEN a.id = u.id THEN '✅ IDs NOW MATCH - READY TO LOGIN!' 
    ELSE '❌ STILL MISMATCH - CONTACT SUPPORT' 
  END as status
FROM admins a
JOIN auth.users u ON a.email = u.email
WHERE a.email = 'louise.ato@urios.edu.ph';
*/

-- ============================================
-- EXPECTED RESULTS FOR SUCCESSFUL SETUP
-- ============================================
-- Check #1: ✅ User exists in auth.users
-- Check #2: Shows user details with confirmed email
-- Check #3: ✅ Admin record exists
-- Check #4: Shows admin details
-- Check #5: ✅ IDs MATCH - READY TO LOGIN!
-- Check #6: ✅ READY TO LOGIN!
-- Check #7: Both records show same ID

-- ============================================
-- TROUBLESHOOTING
-- ============================================
-- If Check #1 fails: Create user in Supabase Dashboard → Authentication → Users
-- If Check #2 shows email not confirmed: Click user → Confirm email
-- If Check #3 fails: Run migration: supabase/migrations/003_create_admin_user.sql
-- If Check #5 shows mismatch: Uncomment and run the FIX QUERY above
