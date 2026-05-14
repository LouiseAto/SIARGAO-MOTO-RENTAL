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
import { RentalModal } from "@/components/modals/RentalModal"
import { toast } from "sonner"
import { format } from "date-fns"

interface Rental {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  motorbike_id: string
  start_date: string
  end_date: string
  total_cost: number
  status: string
  motorbike?: any
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<Rental | undefined>()

  useEffect(() => {
    fetchRentals()
  }, [])

  // Auto-complete expired rentals on page load
  useEffect(() => {
    const autoCompleteExpiredRentals = async () => {
      if (rentals.length === 0) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Find rentals that are active but past their end date
      const expiredRentals = rentals.filter((rental) => {
        if (rental.status !== "active") return false

        const endDate = new Date(rental.end_date)
        endDate.setHours(0, 0, 0, 0)

        return today >= endDate
      })

      if (expiredRentals.length === 0) return

      console.log(`Found ${expiredRentals.length} expired rental(s), auto-completing...`)

      // Update each expired rental
      const updatePromises = expiredRentals.map((rental) =>
        fetch(`/api/rentals/${rental.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        })
      )

      try {
        await Promise.all(updatePromises)
        
        if (expiredRentals.length > 0) {
          toast.success(
            `${expiredRentals.length} rental(s) automatically completed (rental period ended)`
          )
          // Refresh the list to show updated statuses
          fetchRentals()
        }
      } catch (error) {
        console.error("Failed to auto-complete expired rentals:", error)
      }
    }

    autoCompleteExpiredRentals()
  }, [rentals])

  const fetchRentals = async () => {
    try {
      const response = await fetch("/api/rentals")
      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch rentals")
      }
      
      setRentals(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch rentals")
      console.error(error)
      setRentals([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rental?")) return

    try {
      const response = await fetch(`/api/rentals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast.success("Rental deleted successfully")
      fetchRentals()
    } catch (error) {
      toast.error("Failed to delete rental")
      console.error(error)
    }
  }

  const handleEdit = (rental: Rental) => {
    setSelectedRental(rental)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedRental(undefined)
    setModalOpen(true)
  }

  const filteredRentals = Array.isArray(rentals) ? rentals.filter(
    (r: any) =>
      r.customers?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customers?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.motorbikes?.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.motorbikes?.model?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      active: { variant: "default", label: "Active" },
      completed: { variant: "secondary", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    }
    const config = variants[status] || variants.active
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    )
  }

  return (
    <DashboardLayout title="Rentals" subtitle="Manage motorcycle rentals">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rentals..."
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
              New Rental
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Motorcycle</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Total Cost</TableHead>
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
                ) : filteredRentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="text-muted-foreground">
                        {searchQuery
                          ? "No rentals found matching your search."
                          : "No rentals yet. Create your first rental to get started."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRentals.map((rental, index) => (
                    <motion.tr
                      key={rental.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {(rental as any).customers?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {(rental as any).customers?.email || ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(rental as any).motorbikes ? (
                          <div>
                            <div className="font-medium">
                              {(rental as any).motorbikes.brand} {(rental as any).motorbikes.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {(rental as any).motorbikes.plate_number}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(rental.start_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(rental.end_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₱{rental.total_cost.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(rental.status)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEdit(rental)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(rental.id)}
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
          </div>
        </motion.div>

        {/* Stats */}
        {!loading && rentals.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredRentals.length} of {rentals.length} rentals
            </div>
            <div className="flex gap-4">
              <span>
                Active:{" "}
                <strong className="text-foreground">
                  {Array.isArray(rentals) ? rentals.filter((r) => r.status === "active").length : 0}
                </strong>
              </span>
              <span>
                Total Revenue:{" "}
                <strong className="text-foreground">
                  ₱
                  {rentals
                    .reduce((sum, r) => sum + r.total_cost, 0)
                    .toLocaleString()}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      <RentalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        rental={selectedRental}
        onSuccess={fetchRentals}
      />
    </DashboardLayout>
  )
}
