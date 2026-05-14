export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type RentalStatus = 'active' | 'completed' | 'cancelled'
export type MotorbikeStatus = 'available' | 'rented' | 'maintenance'
export type EmployeeRole = 'admin' | 'staff' | 'mechanic'

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          full_name: string
          role: EmployeeRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: EmployeeRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: EmployeeRole
          created_at?: string
          updated_at?: string
        }
      }
      motorbikes: {
        Row: {
          id: string
          brand: string
          model: string
          year: number
          plate_number: string
          color: string | null
          daily_rate: number
          status: MotorbikeStatus
          latitude: number | null
          longitude: number | null
          last_maintenance_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          year: number
          plate_number: string
          color?: string | null
          daily_rate: number
          status?: MotorbikeStatus
          latitude?: number | null
          longitude?: number | null
          last_maintenance_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          year?: number
          plate_number?: string
          color?: string | null
          daily_rate?: number
          status?: MotorbikeStatus
          latitude?: number | null
          longitude?: number | null
          last_maintenance_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string
          id_number: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          phone: string
          id_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string
          id_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rentals: {
        Row: {
          id: string
          motorbike_id: string
          customer_id: string
          start_date: string
          end_date: string
          actual_return_date: string | null
          daily_rate: number
          total_cost: number
          deposit_amount: number | null
          status: RentalStatus
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          motorbike_id: string
          customer_id: string
          start_date: string
          end_date: string
          actual_return_date?: string | null
          daily_rate: number
          total_cost: number
          deposit_amount?: number | null
          status?: RentalStatus
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          motorbike_id?: string
          customer_id?: string
          start_date?: string
          end_date?: string
          actual_return_date?: string | null
          daily_rate?: number
          total_cost?: number
          deposit_amount?: number | null
          status?: RentalStatus
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string
          role: EmployeeRole
          hire_date: string
          hourly_rate: number | null
          monthly_salary: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          phone: string
          role?: EmployeeRole
          hire_date: string
          hourly_rate?: number | null
          monthly_salary?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string
          role?: EmployeeRole
          hire_date?: string
          hourly_rate?: number | null
          monthly_salary?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payroll: {
        Row: {
          id: string
          employee_id: string
          period_start: string
          period_end: string
          hours_worked: number | null
          base_amount: number
          bonuses: number
          deductions: number
          total_amount: number
          payment_date: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          period_start: string
          period_end: string
          hours_worked?: number | null
          base_amount: number
          bonuses?: number
          deductions?: number
          total_amount: number
          payment_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          period_start?: string
          period_end?: string
          hours_worked?: number | null
          base_amount?: number
          bonuses?: number
          deductions?: number
          total_amount?: number
          payment_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      rental_status: RentalStatus
      motorbike_status: MotorbikeStatus
      employee_role: EmployeeRole
    }
  }
}
