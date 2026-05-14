"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Filter,
  Mail,
  Phone,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EmployeeModal } from "@/components/modals/EmployeeModal"
import { toast } from "sonner"
import { format } from "date-fns"

interface Employee {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  hire_date: string
  monthly_salary: number
  status: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>()

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      // Add cache-busting with timestamp to ensure fresh data
      const timestamp = new Date().getTime()
      console.log("=== FETCHING EMPLOYEES ===")
      console.log("Timestamp:", timestamp)
      
      const response = await fetch(`/api/employees?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      })
      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch employees")
      }
      
      console.log("Fetched employees count:", data.length)
      console.log("Employee statuses:", data.map((e: any) => ({ 
        name: e.full_name, 
        status: e.status,
        is_active: e.is_active,
        raw: e
      })))
      console.log("First employee full object:", data[0])
      
      // Force state update by creating new array
      setEmployees([...data])
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch employees")
      console.error(error)
      setEmployees([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast.success("Employee deleted successfully")
      fetchEmployees()
    } catch (error) {
      toast.error("Failed to delete employee")
      console.error(error)
    }
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedEmployee(undefined)
    setModalOpen(true)
  }

  const filteredEmployees = Array.isArray(employees) ? employees.filter(
    (e) =>
      e.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const getStatusBadge = (status: string) => {
    console.log("getStatusBadge called with:", status, "type:", typeof status)
    
    const variants: Record<string, { variant: any; label: string }> = {
      active: { variant: "default", label: "Active" },
      inactive: { variant: "secondary", label: "Inactive" },
      on_leave: { variant: "destructive", label: "On Leave" },
    }
    
    // If status is undefined or not in variants, default to active
    const config = variants[status] || variants.active
    console.log("Using config:", config)
    
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <DashboardLayout title="Employees" subtitle="Manage your team members">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-border bg-card shadow-sm"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Monthly Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-muted-foreground">
                      {searchQuery
                        ? "No employees found matching your search."
                        : "No employees yet. Add your first employee to get started."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{employee.full_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{employee.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{employee.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(employee.hire_date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>₱{employee.monthly_salary.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(employee)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(employee.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Stats */}
        {!loading && employees.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
            <div className="flex gap-4">
              <span>
                Active:{" "}
                <strong className="text-foreground">
                  {employees.filter((e) => e.status === "active").length}
                </strong>
              </span>
              <span>
                Total Payroll:{" "}
                <strong className="text-foreground">
                  ₱
                  {employees
                    .reduce((sum, e) => sum + e.monthly_salary, 0)
                    .toLocaleString()}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      <EmployeeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />
    </DashboardLayout>
  )
}
