"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface EmployeeFormData {
  full_name: string
  email: string
  phone: string
  role: string
  hire_date: string
  monthly_salary: number
  status: string
}

interface EmployeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: any
  onSuccess: () => void
}

export function EmployeeModal({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeModalProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!employee

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "staff",
      hire_date: new Date().toISOString().split("T")[0],
      monthly_salary: 0,
      status: "active",
    },
  })

  const status = watch("status")
  const role = watch("role")

  useEffect(() => {
    if (open) {
      if (employee) {
        console.log("Loading employee data:", employee)
        reset({
          full_name: employee.full_name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          role: employee.role || "staff",
          hire_date: employee.hire_date || new Date().toISOString().split("T")[0],
          monthly_salary: employee.monthly_salary || 0,
          status: employee.status || "active",
        })
      } else {
        console.log("Resetting form for new employee")
        reset({
          full_name: "",
          email: "",
          phone: "",
          role: "staff",
          hire_date: new Date().toISOString().split("T")[0],
          monthly_salary: 0,
          status: "active",
        })
      }
    }
  }, [employee, reset, open])

  const onSubmit = async (data: EmployeeFormData) => {
    setLoading(true)
    try {
      const url = isEdit ? `/api/employees/${employee.id}` : "/api/employees"
      const method = isEdit ? "PUT" : "POST"

      console.log("=== EMPLOYEE MODAL SUBMIT ===")
      console.log("Is Edit:", isEdit)
      console.log("Employee ID:", employee?.id)
      console.log("Submitting data:", data)
      console.log("URL:", url)
      console.log("Method:", method)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      })

      const result = await response.json()
      console.log("API Response:", result)
      console.log("Response OK:", response.ok)

      if (!response.ok) {
        throw new Error(result.error || "Failed to save employee")
      }

      console.log("Employee saved successfully. Updated status:", result.status)

      toast.success(
        isEdit ? "Employee updated successfully" : "Employee added successfully"
      )
      
      // Close modal first
      onOpenChange(false)
      
      // Wait a moment for database to commit, then refresh
      setTimeout(async () => {
        console.log("Triggering employee list refresh after save...")
        await onSuccess()
        console.log("Employee list refresh completed")
      }, 300)
    } catch (error: any) {
      toast.error(error.message || "Failed to save employee")
      console.error("Employee save error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the employee details below."
              : "Fill in the details to add a new employee."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              {...register("full_name", { required: "Full name is required" })}
              placeholder="Juan Dela Cruz"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="juan@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                {...register("phone", { required: "Phone is required" })}
                placeholder="+63-XXX-XXX-XXXX"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={role} 
                onValueChange={(value) => {
                  console.log("Role changing to:", value)
                  setValue("role", value, { shouldValidate: true })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="mechanic">Mechanic</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hire_date">Hire Date *</Label>
              <Input
                id="hire_date"
                type="date"
                {...register("hire_date", { required: "Hire date is required" })}
              />
              {errors.hire_date && (
                <p className="text-sm text-destructive">{errors.hire_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_salary">Monthly Salary (₱) *</Label>
              <Input
                id="monthly_salary"
                type="number"
                step="0.01"
                {...register("monthly_salary", {
                  required: "Monthly salary is required",
                  min: { value: 0.01, message: "Salary must be positive" },
                  valueAsNumber: true,
                })}
              />
              {errors.monthly_salary && (
                <p className="text-sm text-destructive">
                  {errors.monthly_salary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  console.log("Status changing to:", value)
                  setValue("status", value, { shouldValidate: true })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update" : "Add"} Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
