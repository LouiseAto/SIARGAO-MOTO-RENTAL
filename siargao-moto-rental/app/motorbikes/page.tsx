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
import { MotorbikeModal } from "@/components/modals/MotorbikeModal"
import { toast } from "sonner"

interface Motorbike {
  id: string
  brand: string
  model: string
  year: number
  plate_number: string
  color: string
  daily_rate: number
  status: string
}

export default function MotorbikesPage() {
  const [motorbikes, setMotorbikes] = useState<Motorbike[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMotorbike, setSelectedMotorbike] = useState<Motorbike | undefined>()

  useEffect(() => {
    fetchMotorbikes()
  }, [])

  const fetchMotorbikes = async () => {
    try {
      const response = await fetch("/api/motorbikes")
      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch motorcycles")
      }
      
      setMotorbikes(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch motorcycles")
      console.error(error)
      setMotorbikes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this motorcycle?")) return

    try {
      const response = await fetch(`/api/motorbikes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast.success("Motorcycle deleted successfully")
      fetchMotorbikes()
    } catch (error) {
      toast.error("Failed to delete motorcycle")
      console.error(error)
    }
  }

  const handleEdit = (motorbike: Motorbike) => {
    setSelectedMotorbike(motorbike)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedMotorbike(undefined)
    setModalOpen(true)
  }

  const filteredMotorbikes = Array.isArray(motorbikes) ? motorbikes.filter(
    (m) =>
      m.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.plate_number?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      available: { variant: "default", label: "Available" },
      rented: { variant: "secondary", label: "Rented" },
      maintenance: { variant: "destructive", label: "Maintenance" },
    }
    const config = variants[status] || variants.available
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    )
  }

  return (
    <DashboardLayout
      title="Motorcycles"
      subtitle="Manage your motorcycle fleet"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search motorcycles..."
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
              Add Motorcycle
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
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredMotorbikes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="text-muted-foreground">
                      {searchQuery
                        ? "No motorcycles found matching your search."
                        : "No motorcycles yet. Add your first motorcycle to get started."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMotorbikes.map((motorbike, index) => (
                  <motion.tr
                    key={motorbike.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{motorbike.brand}</TableCell>
                    <TableCell>{motorbike.model}</TableCell>
                    <TableCell>{motorbike.year}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 rounded bg-muted text-sm">
                        {motorbike.plate_number}
                      </code>
                    </TableCell>
                    <TableCell>{motorbike.color}</TableCell>
                    <TableCell>₱{motorbike.daily_rate.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(motorbike.status)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(motorbike)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(motorbike.id)}
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
        {!loading && motorbikes.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredMotorbikes.length} of {motorbikes.length} motorcycles
            </div>
            <div className="flex gap-4">
              <span>
                Available:{" "}
                <strong className="text-foreground">
                  {Array.isArray(motorbikes) ? motorbikes.filter((m) => m.status === "available").length : 0}
                </strong>
              </span>
              <span>
                Rented:{" "}
                <strong className="text-foreground">
                  {Array.isArray(motorbikes) ? motorbikes.filter((m) => m.status === "rented").length : 0}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      <MotorbikeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        motorbike={selectedMotorbike}
        onSuccess={fetchMotorbikes}
      />
    </DashboardLayout>
  )
}
