-- ============================================
-- UPDATE SYSTEM TO USE NEW USER
-- ============================================
-- New user: luwe.ato@gmail.com
-- New UID: c939f4bb-592a-49ef-9b02-369958ef5be
-- ============================================

-- Step 1: Delete old admin record
DELETE FROM admins WHERE email = 'louise.ato@urios.edu.ph';

-- Step 2: Create new admin record with new User ID
INSERT INTO admins (id, email, full_name, role)
VALUES (
  'c939f4bb-592a-49ef-9b02-369958ef5be',
  'luwe.ato@gmail.com',
  'Louise Ato',
  'admin'
);

-- Step 3: Verify it worked
SELECT 
  a.id as admin_id,
  u.id as auth_id,
  a.email,
  CASE 
    WHEN a.id = u.id THEN '✅ READY TO LOGIN!'
    ELSE '❌ STILL MISMATCH'
  END as status
FROM admins a
JOIN auth.users u ON a.email = u.email
WHERE a.email = 'luwe.ato@gmail.com';
