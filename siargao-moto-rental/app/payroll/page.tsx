"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Download,
  Filter,
  Calendar,
  Users,
  Loader2,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { format } from "date-fns"
import { PesoIcon } from "@/components/icons/PesoIcon"
import { StatusDropdown } from "@/components/StatusDropdown"
import { ActionsColumn } from "@/components/ActionsColumn"
import { EditPayrollModal } from "@/components/modals/EditPayrollModal"
import { DeleteConfirmationDialog } from "@/components/modals/DeleteConfirmationDialog"

interface PayrollRecord {
  id: string
  employee_id: string
  employee_name?: string
  period_start: string
  period_end: string
  base_amount: number
  bonuses: number
  deductions: number
  total_amount: number
  payment_date: string
  status: "paid" | "pending"
  hours_worked?: number
  employees?: {
    full_name: string
  }
}

interface Employee {
  id: string
  full_name: string
  hourly_rate?: number
  monthly_salary?: number
  is_active: boolean
}

export default function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [generating, setGenerating] = useState(false)
  const [payrollData, setPayrollData] = useState<any[]>([])
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [hoursWorked, setHoursWorked] = useState<Record<string, number>>({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null)

  // Delete Dialog State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingRecord, setDeletingRecord] = useState<PayrollRecord | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchPayroll()
  }, [])

  // Helper function to calculate days between two dates (inclusive)
  const calculateDaysBetween = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0
    
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      // Check for invalid dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
      
      // If end is before start, return 0
      if (end < start) return 0
      
      // Calculate difference in milliseconds
      const diffTime = Math.abs(end.getTime() - start.getTime())
      // Convert to days and add 1 to make it inclusive (Jan 1 - Jan 1 = 1 day)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      
      return diffDays
    } catch (error) {
      console.error('Error calculating days between dates:', error)
      return 0
    }
  }

  // Auto-calculate hours and salary when dates change - DISABLED
  // Calculation now only happens when user manually changes hours field
  // useEffect removed to keep totals at ₱0 when dates change

  const fetchPayroll = async () => {
    try {
      const response = await fetch("/api/payroll")
      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch payroll")
      }
      
      setPayroll(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch payroll")
      console.error(error)
      setPayroll([])
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch employees")
      }
      
      const activeEmployees = Array.isArray(data) ? data.filter((e: Employee) => e.is_active) : []
      setEmployees(activeEmployees)
      
      // Initialize payroll data - all values start at 0
      // Calculation will happen automatically via useEffect when dates are set
      const initialData = activeEmployees.map((emp: Employee) => ({
        employee_id: emp.id,
        employee_name: emp.full_name,
        hourly_rate: emp.hourly_rate || 200, // Default ₱200/hour if not set
        hours_worked: 0,
        base_amount: 0, // Always start at 0
        bonuses: 0,
        deductions: 0,
        total_amount: 0, // Always start at 0
        has_monthly_salary: !!emp.monthly_salary, // Track if employee has monthly salary
        monthly_salary_amount: emp.monthly_salary || 0, // Store monthly salary for reference
      }))
      setPayrollData(initialData)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch employees")
      console.error(error)
    }
  }

  const handleOpenGenerateModal = () => {
    // Set default period (current month)
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setPeriodStart(firstDay.toISOString().split('T')[0])
    setPeriodEnd(lastDay.toISOString().split('T')[0])
    
    setShowGenerateModal(true)
    fetchEmployees()
  }

  const updatePayrollItem = (employeeId: string, field: string, value: number) => {
    setPayrollData(prev => prev.map(item => {
      if (item.employee_id === employeeId) {
        const updated = { ...item, [field]: value }
        
        // When hours change, recalculate base amount
        if (field === 'hours_worked') {
          // Base = Hourly Rate × Hours Worked
          updated.base_amount = updated.hourly_rate * value
        }
        
        // When hourly rate changes, recalculate base amount
        if (field === 'hourly_rate') {
          // Base = Hourly Rate × Hours Worked
          updated.base_amount = value * updated.hours_worked
        }
        
        // Always recalculate total: Base + Bonuses - Deductions
        updated.total_amount = updated.base_amount + updated.bonuses - updated.deductions
        
        return updated
      }
      return item
    }))
  }

  const handleGeneratePayroll = async () => {
    if (!periodStart || !periodEnd) {
      toast.error("Please select pay period dates")
      return
    }

    setGenerating(true)
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
      const paymentDate = today.toISOString().split('T')[0]
      
      // Determine status based on period end date
      const periodEndDate = new Date(periodEnd)
      periodEndDate.setHours(0, 0, 0, 0)
      
      // If period end is today or in the past, mark as paid (completed)
      // This includes 1-day periods like May 13 - May 14
      const status = periodEndDate <= today ? "paid" : "pending"
      
      // Create payroll records for each employee
      const promises = payrollData.map(async (item) => {
        const response = await fetch("/api/payroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: item.employee_id,
            period_start: periodStart,
            period_end: periodEnd,
            hours_worked: item.hours_worked || undefined,
            base_amount: item.base_amount,
            bonuses: item.bonuses,
            deductions: item.deductions,
            total_amount: item.total_amount,
            payment_date: paymentDate,
            status: status, // Auto-determined: paid if period ended, pending if ongoing
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create payroll record")
        }

        return response.json()
      })

      await Promise.all(promises)
      
      const statusMessage = status === "paid" ? "completed and marked as paid" : "created as pending"
      toast.success(`Payroll generated for ${payrollData.length} employees (${statusMessage})`)
      setShowGenerateModal(false)
      fetchPayroll()
    } catch (error: any) {
      toast.error(error.message || "Failed to generate payroll")
      console.error(error)
    } finally {
      setGenerating(false)
    }
  }

  const filteredPayroll = Array.isArray(payroll) ? payroll.filter((p: any) => {
    // Search filter
    const matchesSearch = p.employees?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    
    // Date filter
    const matchesDate = !dateFilter || p.payment_date?.startsWith(dateFilter)
    
    return matchesSearch && matchesStatus && matchesDate
  }) : []

  const handleExportCSV = () => {
    if (filteredPayroll.length === 0) {
      toast.error("No data to export")
      return
    }

    // Create CSV content
    const headers = ["Employee", "Period Start", "Period End", "Hours", "Base Amount", "Bonuses", "Deductions", "Total Amount", "Payment Date", "Status"]
    const rows = filteredPayroll.map((record: any) => [
      record.employees?.full_name || "N/A",
      format(new Date(record.period_start), "MMM dd, yyyy"),
      format(new Date(record.period_end), "MMM dd, yyyy"),
      record.hours_worked || "-",
      record.base_amount,
      record.bonuses,
      record.deductions,
      record.total_amount,
      format(new Date(record.payment_date), "MMM dd, yyyy"),
      record.status
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payroll-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success("Payroll data exported successfully")
  }

  const handleClearFilters = () => {
    setStatusFilter("all")
    setDateFilter("")
    setSearchQuery("")
  }

  const totalPayroll = Array.isArray(payroll) ? payroll.reduce((sum, p) => sum + p.total_amount, 0) : 0
  const pendingPayroll = Array.isArray(payroll) ? payroll.filter((p) => p.status === "pending").length : 0
  const paidPayroll = Array.isArray(payroll) ? payroll.filter((p) => p.status === "paid").length : 0
  const paidPayrollTotal = Array.isArray(payroll) ? payroll.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.total_amount, 0) : 0
  const pendingPayrollTotal = Array.isArray(payroll) ? payroll.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.total_amount, 0) : 0

  const handleStatusChange = async (recordId: string, newStatus: "paid" | "pending") => {
    try {
      const response = await fetch(`/api/payroll/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update status")
      }

      toast.success(`Status updated to ${newStatus}`)
      fetchPayroll() // Refresh data to update stats
    } catch (error: any) {
      toast.error(error.message || "Failed to update status")
      throw error // Re-throw to let StatusDropdown handle revert
    }
  }

  const handleEdit = (record: PayrollRecord) => {
    setEditingRecord(record)
    setShowEditModal(true)
  }

  const handleDelete = (record: PayrollRecord) => {
    setDeletingRecord(record)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingRecord) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/payroll/${deletingRecord.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete payroll record")
      }

      toast.success("Payroll record deleted successfully")
      setShowDeleteDialog(false)
      setDeletingRecord(null)
      fetchPayroll() // Refresh data to update stats and remove row
    } catch (error: any) {
      toast.error(error.message || "Failed to delete payroll record")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <DashboardLayout
      title="Payroll"
      subtitle="Manage employee payroll and compensation"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <PesoIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  `₱${totalPayroll.toLocaleString()}`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total disbursed this period
              </p>
              {!loading && (
                <div className="mt-2 text-xs">
                  <span className="text-emerald-600">Paid: ₱{paidPayrollTotal.toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <span className="text-amber-600">Pending: ₱{pendingPayrollTotal.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : pendingPayroll}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting processing
              </p>
              {!loading && pendingPayrollTotal > 0 && (
                <div className="mt-2 text-xs text-amber-600">
                  ₱{pendingPayrollTotal.toLocaleString()} pending
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : payroll.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                On current payroll
              </p>
              {!loading && (
                <div className="mt-2 text-xs">
                  <span className="text-emerald-600">{paidPayroll} paid</span>
                  <span className="mx-2">•</span>
                  <span className="text-amber-600">{pendingPayroll} pending</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payroll records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowFilterModal(true)}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2" onClick={handleOpenGenerateModal}>
              <Plus className="h-4 w-4" />
              Generate Payroll
            </Button>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-border bg-card shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Base Amount</TableHead>
                  <TableHead>Bonuses</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredPayroll.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="text-muted-foreground">
                        {searchQuery
                          ? "No payroll records found matching your search."
                          : "No payroll records yet. Generate payroll to get started."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayroll.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {(record as any).employees?.full_name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(record.period_start), "MMM dd")} -{" "}
                          {format(new Date(record.period_end), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(record as any).hours_worked ? (
                          <span>{(record as any).hours_worked} hrs</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>₱{record.base_amount.toLocaleString()}</TableCell>
                      <TableCell className="text-emerald-600">
                        +₱{record.bonuses.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-destructive">
                        -₱{record.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₱{record.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.payment_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <StatusDropdown
                          recordId={record.id}
                          currentStatus={record.status as "paid" | "pending"}
                          onStatusChange={(newStatus) => handleStatusChange(record.id, newStatus)}
                        />
                      </TableCell>
                      <TableCell>
                        <ActionsColumn
                          record={record as any}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Summary */}
        {!loading && payroll.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredPayroll.length} of {payroll.length} records
            </div>
            <div className="flex gap-4">
              <span>
                Paid:{" "}
                <strong className="text-foreground">
                  {payroll.filter((p) => p.status === "paid").length}
                </strong>
              </span>
              <span>
                Pending:{" "}
                <strong className="text-foreground">{pendingPayroll}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Generate Payroll Modal */}
        <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Payroll</DialogTitle>
              <DialogDescription>
                Create payroll records for all active employees for the selected period
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Pay Period */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period_start">Period Start</Label>
                  <Input
                    id="period_start"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period_end">Period End</Label>
                  <Input
                    id="period_end"
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                  />
                </div>
              </div>

              {/* Employee Payroll Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Rate/Hr</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Base</TableHead>
                      <TableHead>Bonuses</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollData.map((item) => (
                      <TableRow key={item.employee_id}>
                        <TableCell className="font-medium">
                          {item.employee_name}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="10"
                            value={item.hourly_rate}
                            onChange={(e) =>
                              updatePayrollItem(
                                item.employee_id,
                                "hourly_rate",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24"
                            placeholder="200"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={item.hours_worked}
                            onChange={(e) =>
                              updatePayrollItem(
                                item.employee_id,
                                "hours_worked",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-20"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            ₱{item.base_amount.toLocaleString()}
                          </div>
                          {item.hours_worked > 0 && (
                            <div className="text-xs text-muted-foreground">
                              ₱{item.hourly_rate} × {item.hours_worked}h
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={item.bonuses}
                            onChange={(e) =>
                              updatePayrollItem(
                                item.employee_id,
                                "bonuses",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={item.deductions}
                            onChange={(e) =>
                              updatePayrollItem(
                                item.employee_id,
                                "deductions",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₱{item.total_amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Total Payroll for {payrollData.length} employees
                </div>
                <div className="text-2xl font-bold">
                  ₱
                  {payrollData
                    .reduce((sum, item) => sum + item.total_amount, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowGenerateModal(false)}
                disabled={generating}
              >
                Cancel
              </Button>
              <Button onClick={handleGeneratePayroll} disabled={generating}>
                {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Payroll
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filter Modal */}
        <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Filter Payroll</DialogTitle>
              <DialogDescription>
                Filter payroll records by status and date
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Payment Month</Label>
                <Input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
                <div className="text-sm text-muted-foreground">
                  {filteredPayroll.length} records found
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Payroll Modal */}
        <EditPayrollModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          record={editingRecord}
          onSuccess={fetchPayroll}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          record={deletingRecord}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      </div>
    </DashboardLayout>
  )
}
