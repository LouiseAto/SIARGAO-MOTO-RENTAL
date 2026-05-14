-- Create admin user record for louise.ato@urios.edu.ph
-- User ID: 16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1

-- First, delete any existing admin records (if any)
DELETE FROM admins WHERE email = 'louise.ato@urios.edu.ph';
DELETE FROM admins WHERE id = '16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1';

-- Insert the new admin record
INSERT INTO admins (id, email, full_name, role)
VALUES (
  '16d0a0ef-af79-4ae4-b1bd-0e163d7da9a1',
  'louise.ato@urios.edu.ph',
  'Louise Ato',
  'admin'
);

-- Verify the admin was created
SELECT * FROM admins WHERE email = 'louise.ato@urios.edu.ph';
