import { z } from 'zod'

// Motorbike validation schema
export const motorbikeSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  plate_number: z.string().min(1, 'Plate number is required'),
  color: z.string().optional(),
  daily_rate: z.number().positive('Daily rate must be positive'),
  status: z.enum(['available', 'rented', 'maintenance']).default('available'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  last_maintenance_date: z.string().optional(),
  notes: z.string().optional(),
})

// Customer validation schema
export const customerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone is required'),
  id_number: z.string().optional(),
  address: z.string().optional(),
})

// Rental validation schema
export const rentalSchema = z.object({
  motorbike_id: z.string().uuid('Invalid motorbike ID'),
  customer_id: z.string().uuid('Invalid customer ID'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  actual_return_date: z.string().optional(),
  daily_rate: z.number().positive('Daily rate must be positive'),
  total_cost: z.number().positive('Total cost must be positive'),
  deposit_amount: z.number().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  notes: z.string().optional(),
})

// Employee validation schema
export const employeeSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone is required'),
  role: z.enum(['admin', 'staff', 'mechanic', 'manager']).default('staff'),
  hire_date: z.string().min(1, 'Hire date is required'),
  hourly_rate: z.number().positive().optional(),
  monthly_salary: z.number().positive().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
})

// Payroll validation schema
export const payrollSchema = z.object({
  employee_id: z.string().uuid('Invalid employee ID'),
  period_start: z.string().min(1, 'Period start is required'),
  period_end: z.string().min(1, 'Period end is required'),
  hours_worked: z.number().optional(),
  base_amount: z.number().positive('Base amount must be positive'),
  bonuses: z.number().default(0),
  deductions: z.number().default(0),
  total_amount: z.number().positive('Total amount must be positive'),
  payment_date: z.string().optional(),
  notes: z.string().optional(),
})

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
