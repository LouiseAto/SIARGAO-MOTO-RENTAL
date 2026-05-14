-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE rental_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE motorbike_status AS ENUM ('available', 'rented', 'maintenance');
CREATE TYPE employee_role AS ENUM ('admin', 'staff', 'mechanic');

-- Admins table (extends Supabase auth.users)
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role employee_role DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Motorbikes table
CREATE TABLE motorbikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate_number TEXT UNIQUE NOT NULL,
  color TEXT,
  daily_rate DECIMAL(10, 2) NOT NULL,
  status motorbike_status DEFAULT 'available',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  last_maintenance_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  id_number TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rentals table
CREATE TABLE rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  motorbike_id UUID NOT NULL REFERENCES motorbikes(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  actual_return_date DATE,
  daily_rate DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  status rental_status DEFAULT 'active',
  notes TEXT,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL,
  role employee_role DEFAULT 'staff',
  hire_date DATE NOT NULL,
  hourly_rate DECIMAL(10, 2),
  monthly_salary DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll table
CREATE TABLE payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  hours_worked DECIMAL(10, 2),
  base_amount DECIMAL(10, 2) NOT NULL,
  bonuses DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE,
  notes TEXT,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_motorbikes_status ON motorbikes(status);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX idx_rentals_motorbike ON rentals(motorbike_id);
CREATE INDEX idx_rentals_customer ON rentals(customer_id);
CREATE INDEX idx_employees_active ON employees(is_active);
CREATE INDEX idx_payroll_employee ON payroll(employee_id);
CREATE INDEX idx_payroll_period ON payroll(period_start, period_end);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_motorbikes_updated_at BEFORE UPDATE ON motorbikes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON payroll
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorbikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- Admin policies (only authenticated admins can access)
CREATE POLICY "Admins can view all admins" ON admins
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert admins" ON admins
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update admins" ON admins
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Motorbikes policies
CREATE POLICY "Admins can view all motorbikes" ON motorbikes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert motorbikes" ON motorbikes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update motorbikes" ON motorbikes
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete motorbikes" ON motorbikes
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Customers policies
CREATE POLICY "Admins can view all customers" ON customers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update customers" ON customers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete customers" ON customers
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Rentals policies
CREATE POLICY "Admins can view all rentals" ON rentals
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert rentals" ON rentals
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update rentals" ON rentals
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete rentals" ON rentals
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Employees policies
CREATE POLICY "Admins can view all employees" ON employees
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert employees" ON employees
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update employees" ON employees
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete employees" ON employees
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Payroll policies
CREATE POLICY "Admins can view all payroll" ON payroll
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert payroll" ON payroll
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update payroll" ON payroll
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete payroll" ON payroll
  FOR DELETE USING (auth.uid() IS NOT NULL);
