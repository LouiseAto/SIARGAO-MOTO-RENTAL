-- Add status column to employees table
-- This replaces the is_active boolean with a more flexible status enum

-- Create enum type for employee status
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'on_leave');

-- Add status column with default value
ALTER TABLE employees 
ADD COLUMN status employee_status DEFAULT 'active';

-- Migrate existing data: convert is_active to status
UPDATE employees 
SET status = CASE 
  WHEN is_active = true THEN 'active'::employee_status
  ELSE 'inactive'::employee_status
END;

-- Drop the old is_active column
ALTER TABLE employees 
DROP COLUMN is_active;

-- Add index for better query performance
CREATE INDEX idx_employees_status ON employees(status);
