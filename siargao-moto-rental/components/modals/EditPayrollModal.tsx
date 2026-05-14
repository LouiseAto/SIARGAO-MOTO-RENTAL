"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

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

interface EditPayrollModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: PayrollRecord | null
  onSuccess: () => void
}

interface EditFormData {
  period_start: string
  period_end: string
  hourly_rate: number
  hours_worked: number
  base_amount: number
  bonuses: number
  deductions: number
  total_amount: number
  status: "paid" | "pending"
  payment_date: string
}

export function EditPayrollModal({
  open,
  onOpenChange,
  record,
  onSuccess,
}: EditPayrollModalProps) {
  const [formData, setFormData] = useState<EditFormData>({
    period_start: "",
    period_end: "",
    hourly_rate: 200,
    hours_worked: 0,
    base_amount: 0,
    bonuses: 0,
    deductions: 0,
    total_amount: 0,
    status: "pending",
    payment_date: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill form when record changes
  useEffect(() => {
    if (record) {
      const hourlyRate = record.hours_worked && record.hours_worked > 0
        ? record.base_amount / record.hours_worked
        : 200

      setFormData({
        period_start: record.period_start,
        period_end: record.period_end,
        hourly_rate: hourlyRate,
        hours_worked: record.hours_worked || 0,
        base_amount: record.base_amount,
        bonuses: record.bonuses,
        deductions: record.deductions,
        total_amount: record.total_amount,
        status: record.status,
        payment_date: record.payment_date,
      })
      setErrors({})
    }
  }, [record])

  const updateField = (field: keyof EditFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-calculate base amount when hours or rate changes
      if (field === "hours_worked" || field === "hourly_rate") {
        updated.base_amount = updated.hourly_rate * updated.hours_worked
      }

      // Auto-calculate total amount
      updated.total_amount =
        updated.base_amount + updated.bonuses - updated.deductions

      return updated
    })

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.hours_worked < 0) {
      newErrors.hours_worked = "Hours worked must be non-negative"
    }
    if (formData.hourly_rate <= 0) {
      newErrors.hourly_rate = "Hourly rate must be greater than zero"
    }
    if (formData.base_amount < 0) {
      newErrors.base_amount = "Base amount must be non-negative"
    }
    if (formData.bonuses < 0) {
      newErrors.bonuses = "Bonuses must be non-negative"
    }
    if (formData.deductions < 0) {
      newErrors.deductions = "Deductions must be non-negative"
    }

    const startDate = new Date(formData.period_start)
    const endDate = new Date(formData.period_end)
    if (endDate < startDate) {
      newErrors.period_end = "Period end must be after or equal to period start"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!record || !validate()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/payroll/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period_start: formData.period_start,
          period_end: formData.period_end,
          hours_worked: formData.hours_worked,
          base_amount: formData.base_amount,
          bonuses: formData.bonuses,
          deductions: formData.deductions,
          total_amount: formData.total_amount,
          status: formData.status,
          payment_date: formData.payment_date,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update payroll record")
      }

      toast.success("Payroll record updated successfully")
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "Failed to update payroll record")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setErrors({})
  }

  const employeeName = record?.employees?.full_name || record?.employee_name || "N/A"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Payroll Record</DialogTitle>
          <DialogDescription>
            Update payroll details for {employeeName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Pay Period */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period_start">Period Start</Label>
              <Input
                id="period_start"
                type="date"
                value={formData.period_start}
                onChange={(e) => updateField("period_start", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period_end">Period End</Label>
              <Input
                id="period_end"
                type="date"
                value={formData.period_end}
                onChange={(e) => updateField("period_end", e.target.value)}
                className={errors.period_end ? "border-red-500" : ""}
              />
              {errors.period_end && (
                <p className="text-xs text-red-500">{errors.period_end}</p>
              )}
            </div>
          </div>

          {/* Employee Name (Read-only) */}
          <div className="space-y-2">
            <Label>Employee</Label>
            <Input value={employeeName} disabled className="bg-muted" />
          </div>

          {/* Hourly Rate and Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate (₱)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="10"
                value={formData.hourly_rate}
                onChange={(e) =>
                  updateField("hourly_rate", parseFloat(e.target.value) || 0)
                }
                className={errors.hourly_rate ? "border-red-500" : ""}
              />
              {errors.hourly_rate && (
                <p className="text-xs text-red-500">{errors.hourly_rate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours_worked">Hours Worked</Label>
              <Input
                id="hours_worked"
                type="number"
                min="0"
                step="0.5"
                value={formData.hours_worked}
                onChange={(e) =>
                  updateField("hours_worked", parseFloat(e.target.value) || 0)
                }
                className={errors.hours_worked ? "border-red-500" : ""}
              />
              {errors.hours_worked && (
                <p className="text-xs text-red-500">{errors.hours_worked}</p>
              )}
            </div>
          </div>

          {/* Base Amount */}
          <div className="space-y-2">
            <Label htmlFor="base_amount">Base Amount (₱)</Label>
            <Input
              id="base_amount"
              type="number"
              min="0"
              value={formData.base_amount}
              onChange={(e) =>
                updateField("base_amount", parseFloat(e.target.value) || 0)
              }
              className={errors.base_amount ? "border-red-500" : ""}
            />
            {formData.hours_worked > 0 && (
              <p className="text-xs text-muted-foreground">
                ₱{formData.hourly_rate} × {formData.hours_worked}h = ₱
                {(formData.hourly_rate * formData.hours_worked).toLocaleString()}
              </p>
            )}
            {errors.base_amount && (
              <p className="text-xs text-red-500">{errors.base_amount}</p>
            )}
          </div>

          {/* Bonuses and Deductions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bonuses">Bonuses (₱)</Label>
              <Input
                id="bonuses"
                type="number"
                min="0"
                value={formData.bonuses}
                onChange={(e) =>
                  updateField("bonuses", parseFloat(e.target.value) || 0)
                }
                className={errors.bonuses ? "border-red-500" : ""}
              />
              {errors.bonuses && (
                <p className="text-xs text-red-500">{errors.bonuses}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions (₱)</Label>
              <Input
                id="deductions"
                type="number"
                min="0"
                value={formData.deductions}
                onChange={(e) =>
                  updateField("deductions", parseFloat(e.target.value) || 0)
                }
                className={errors.deductions ? "border-red-500" : ""}
              />
              {errors.deductions && (
                <p className="text-xs text-red-500">{errors.deductions}</p>
              )}
            </div>
          </div>

          {/* Total Amount (Calculated) */}
          <div className="space-y-2">
            <Label>Total Amount (₱)</Label>
            <div className="text-2xl font-bold">
              ₱{formData.total_amount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ₱{formData.base_amount.toLocaleString()} + ₱
              {formData.bonuses.toLocaleString()} - ₱
              {formData.deductions.toLocaleString()}
            </p>
          </div>

          {/* Status and Payment Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  updateField("status", e.target.value as "paid" | "pending")
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => updateField("payment_date", e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
