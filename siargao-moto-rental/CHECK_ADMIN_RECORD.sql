-- ============================================
-- CHECK IF ADMIN RECORD EXISTS
-- ============================================

-- Check for new user
SELECT 
  'NEW USER CHECK' as check_type,
  id::text as user_id,
  email,
  'Auth User' as source
FROM auth.users 
WHERE email = 'luwe.ato@gmail.com'

UNION ALL

SELECT 
  'NEW USER CHECK' as check_type,
  id::text as user_id,
  email,
  'Admin Record' as source
FROM admins 
WHERE email = 'luwe.ato@gmail.com';

-- Check if IDs match
SELECT 
  'ID MATCH CHECK' as check_type,
  a.id::text as admin_id,
  u.id::text as auth_id,
  CASE 
    WHEN a.id = u.id THEN '✅ IDs MATCH'
    WHEN a.id IS NULL THEN '❌ NO ADMIN RECORD - RUN INSERT!'
    WHEN u.id IS NULL THEN '❌ NO AUTH USER'
    ELSE '❌ IDs MISMATCH'
  END as status
FROM auth.users u
LEFT JOIN admins a ON u.email = a.email
WHERE u.email = 'luwe.ato@gmail.com';

-- If admin record doesn't exist, create it
INSERT INTO admins (id, email, full_name, role)
SELECT 
  id,
  email,
  'Louise Ato',
  'admin'
FROM auth.users
WHERE email = 'luwe.ato@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Final verification
SELECT 
  'FINAL CHECK' as check_type,
  a.id::text as admin_id,
  u.id::text as auth_id,
  a.email,
  CASE 
    WHEN a.id = u.id THEN '✅ READY TO LOGIN!'
    ELSE '❌ PROBLEM'
  END as status
FROM auth.users u
JOIN admins a ON u.email = a.email
WHERE u.email = 'luwe.ato@gmail.com';
