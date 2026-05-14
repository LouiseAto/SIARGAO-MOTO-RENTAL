"use client"

import { Loader2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface PayrollRecord {
  id: string
  employee_id: string
  employee_name?: string
  period_start: string
  period_end: string
  total_amount: number
  status: "paid" | "pending"
  employees?: {
    full_name: string
  }
}

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: PayrollRecord | null
  onConfirm: () => Promise<void>
  loading: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  record,
  onConfirm,
  loading,
}: DeleteConfirmationDialogProps) {
  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false)
    }
  }

  const handleConfirm = async () => {
    await onConfirm()
  }

  if (!record) return null

  const employeeName = record.employees?.full_name || record.employee_name || "N/A"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Payroll Record
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payroll record for{" "}
            <strong>{employeeName}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Employee:</span>
              <span className="font-medium">{employeeName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Period:</span>
              <span className="font-medium">
                {format(new Date(record.period_start), "MMM dd")} -{" "}
                {format(new Date(record.period_end), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-medium">
                ₱{record.total_amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge
                variant={record.status === "paid" ? "default" : "secondary"}
                className="capitalize"
              >
                {record.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Warning:</strong> This action cannot be undone. The payroll
              record will be permanently removed from the database.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
