import { differenceInDays, parseISO } from 'date-fns'

/**
 * Calculate rental cost based on daily rate and date range
 */
export function calculateRentalCost(
  startDate: string | Date,
  endDate: string | Date,
  dailyRate: number
): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  
  const days = differenceInDays(end, start) + 1 // Include both start and end day
  
  if (days < 1) {
    throw new Error('End date must be after start date')
  }
  
  return days * dailyRate
}

/**
 * Calculate payroll total amount
 */
export function calculatePayrollTotal(
  baseAmount: number,
  bonuses: number = 0,
  deductions: number = 0
): number {
  return baseAmount + bonuses - deductions
}

/**
 * Calculate employee monthly salary based on hourly rate and hours worked
 */
export function calculateMonthlySalary(
  hourlyRate: number,
  hoursWorked: number
): number {
  return hourlyRate * hoursWorked
}

/**
 * Format currency to Philippine Peso
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
}

/**
 * Calculate late return penalty
 */
export function calculateLatePenalty(
  expectedReturnDate: string | Date,
  actualReturnDate: string | Date,
  dailyRate: number,
  penaltyMultiplier: number = 1.5
): number {
  const expected = typeof expectedReturnDate === 'string' ? parseISO(expectedReturnDate) : expectedReturnDate
  const actual = typeof actualReturnDate === 'string' ? parseISO(actualReturnDate) : actualReturnDate
  
  const lateDays = differenceInDays(actual, expected)
  
  if (lateDays <= 0) {
    return 0
  }
  
  return lateDays * dailyRate * penaltyMultiplier
}
