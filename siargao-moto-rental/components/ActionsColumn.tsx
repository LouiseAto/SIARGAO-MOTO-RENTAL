"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PayrollRecord {
  id: string
  employee_id: string
  employee_name?: string
  period_start: string
  period_end: string
  hours_worked?: number
  base_amount: number
  bonuses: number
  deductions: number
  total_amount: number
  payment_date: string
  status: "paid" | "pending"
  employees?: {
    full_name: string
  }
}

interface ActionsColumnProps {
  record: PayrollRecord
  onEdit: (record: PayrollRecord) => void
  onDelete: (record: PayrollRecord) => void
}

export function ActionsColumn({ record, onEdit, onDelete }: ActionsColumnProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(record)}
        className="h-8 w-8 p-0"
        title="Edit record"
        aria-label="Edit record"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(record)}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        title="Delete record"
        aria-label="Delete record"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
