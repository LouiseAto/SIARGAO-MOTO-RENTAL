-- ============================================
-- FIX DUPLICATE ADMIN RECORDS
-- ============================================

-- Step 1: Check how many admin records exist
SELECT 
  'DUPLICATE CHECK' as check_type,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 1 THEN '⚠️ MULTIPLE RECORDS - PROBLEM!'
    WHEN COUNT(*) = 1 THEN '✅ Only one record'
    ELSE '❌ No records'
  END as status
FROM admins 
WHERE email = 'luwe.ato@gmail.com';

-- Step 2: Show all duplicate records
SELECT 
  'ALL RECORDS' as check_type,
  id::text,
  email,
  full_name,
  role,
  created_at
FROM admins 
WHERE email = 'luwe.ato@gmail.com'
ORDER BY created_at;

-- Step 3: Delete ALL admin records for this email
DELETE FROM admins WHERE email = 'luwe.ato@gmail.com';

-- Step 4: Insert ONE correct admin record with the correct User ID
INSERT INTO admins (id, email, full_name, role)
VALUES (
  'c938f4bb-592a-49ef-8e20-92699d8ef5be',
  'luwe.ato@gmail.com',
  'Louise Ato',
  'admin'
);

-- Step 5: Verify only one record exists now
SELECT 
  'VERIFICATION' as check_type,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ FIXED! Only one record now'
    ELSE '❌ Still a problem'
  END as status
FROM admins 
WHERE email = 'luwe.ato@gmail.com';

-- Step 6: Show the final record
SELECT 
  'FINAL RECORD' as check_type,
  a.id::text as admin_id,
  u.id::text as auth_id,
  a.email,
  CASE 
    WHEN a.id = u.id THEN '✅ IDs MATCH - READY TO LOGIN!'
    ELSE '❌ IDs MISMATCH'
  END as status
FROM admins a
JOIN auth.users u ON a.email = u.email
WHERE a.email = 'luwe.ato@gmail.com';
