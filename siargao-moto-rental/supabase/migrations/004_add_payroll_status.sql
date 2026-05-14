-- Add status column to payroll table
ALTER TABLE payroll 
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled'));

-- Add index for status
CREATE INDEX idx_payroll_status ON payroll(status);

-- Update existing records to have 'paid' status
UPDATE payroll SET status = 'paid' WHERE status IS NULL;
