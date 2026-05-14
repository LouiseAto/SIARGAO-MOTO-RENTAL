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

interface RentalFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  motorbike_id: string
  start_date: string
  end_date: string
  total_cost: number
  status: string
}

interface RentalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rental?: any
  onSuccess: () => void
}

export function RentalModal({
  open,
  onOpenChange,
  rental,
  onSuccess,
}: RentalModalProps) {
  const [loading, setLoading] = useState(false)
  const [motorbikes, setMotorbikes] = useState<any[]>([])
  const isEdit = !!rental

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RentalFormData>({
    defaultValues: {
      status: "active",
    },
  })

  const status = watch("status")
  const motorbikeId = watch("motorbike_id")
  const startDate = watch("start_date")
  const endDate = watch("end_date")

  useEffect(() => {
    if (open) {
      fetchMotorbikes()
    }
  }, [open, rental])

  useEffect(() => {
    if (rental) {
      // Extract customer data from nested structure
      const customerName = rental.customers?.full_name || rental.customer_name || ""
      const customerEmail = rental.customers?.email || rental.customer_email || ""
      const customerPhone = rental.customers?.phone || rental.customer_phone || ""
      
      reset({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        motorbike_id: rental.motorbike_id,
        start_date: rental.start_date,
        end_date: rental.end_date,
        total_cost: rental.total_cost,
        status: rental.status,
      })
    } else {
      reset({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        motorbike_id: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        total_cost: 0,
        status: "active",
      })
    }
  }, [rental, reset])

  useEffect(() => {
    if (motorbikeId && startDate && endDate) {
      calculateTotalCost()
    }
  }, [motorbikeId, startDate, endDate])

  // Auto-complete rental if current date has passed the end date
  useEffect(() => {
    if (endDate && status === "active" && isEdit && rental) {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      
      const rentalEndDate = new Date(endDate)
      rentalEndDate.setHours(0, 0, 0, 0)
      
      // If today is on or after the end date, auto-complete
      if (today >= rentalEndDate) {
        setValue("status", "completed")
        
        // Automatically update the rental in the database
        const autoCompleteRental = async () => {
          try {
            const response = await fetch(`/api/rentals/${rental.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "completed",
              }),
            })

            if (response.ok) {
              toast.success("Rental period ended. Status automatically updated to Completed.")
              // Refresh the rentals list
              onSuccess()
            }
          } catch (error) {
            console.error("Failed to auto-complete rental:", error)
          }
        }
        
        autoCompleteRental()
      }
    }
  }, [endDate, status, setValue, isEdit, rental, onSuccess])

  const fetchMotorbikes = async () => {
    try {
      // Fetch all motorbikes
      const motorbikesResponse = await fetch("/api/motorbikes")
      const motorbikesData = await motorbikesResponse.json()
      
      if (!motorbikesResponse.ok || motorbikesData.error) {
        throw new Error(motorbikesData.error || "Failed to fetch motorbikes")
      }
      
      // Fetch all active rentals
      const rentalsResponse = await fetch("/api/rentals")
      const rentalsData = await rentalsResponse.json()
      
      if (!rentalsResponse.ok || rentalsData.error) {
        throw new Error(rentalsData.error || "Failed to fetch rentals")
      }
      
      const motorbikesArray = Array.isArray(motorbikesData) ? motorbikesData : []
      const rentalsArray = Array.isArray(rentalsData) ? rentalsData : []
      
      // Get IDs of motorcycles that are currently rented (active status)
      // Exclude the current rental being edited
      const rentedMotorbikeIds = rentalsArray
        .filter((r: any) => r.status === "active" && (!rental || r.id !== rental.id))
        .map((r: any) => r.motorbike_id)
      
      console.log("All motorcycles:", motorbikesArray.length)
      console.log("Active rentals:", rentalsArray.filter((r: any) => r.status === "active").length)
      console.log("Rented motorcycle IDs:", rentedMotorbikeIds)
      
      // Filter motorcycles: exclude any that are in active rentals
      // If editing, always include the current rental's motorcycle
      const availableMotorbikes = motorbikesArray.filter((m: any) => {
        const isCurrentRentalBike = rental && m.id === rental.motorbike_id
        if (isCurrentRentalBike) return true // Always include current rental's bike when editing
        
        // For new rentals, exclude motorcycles that are in active rentals
        const isNotRented = !rentedMotorbikeIds.includes(m.id)
        
        return isNotRented
      })
      
      console.log("Available motorcycles:", availableMotorbikes.length)
      
      setMotorbikes(availableMotorbikes)
    } catch (error: any) {
      console.error("Failed to fetch motorbikes:", error)
      setMotorbikes([])
    }
  }

  const calculateTotalCost = () => {
    const motorbike = motorbikes.find((m) => m.id === motorbikeId)
    if (!motorbike || !startDate || !endDate) return

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days > 0) {
      setValue("total_cost", days * motorbike.daily_rate)
    }
  }

  const onSubmit = async (data: RentalFormData) => {
    // Validate: Cannot mark as completed if end date hasn't been reached
    if (data.status === "completed") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const rentalEndDate = new Date(data.end_date)
      rentalEndDate.setHours(0, 0, 0, 0)
      
      if (today < rentalEndDate) {
        toast.error(
          `Cannot mark rental as completed. End date is ${new Date(data.end_date).toLocaleDateString()}. Please wait until the rental period ends.`
        )
        return
      }
    }

    setLoading(true)
    try {
      if (isEdit) {
        // For edit, update customer information first if it exists
        if (rental.customer_id) {
          const customerResponse = await fetch(`/api/customers/${rental.customer_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: data.customer_name,
              email: data.customer_email,
              phone: data.customer_phone,
            }),
          })

          if (!customerResponse.ok) {
            console.warn("Failed to update customer information")
          }
        }

        // Get motorbike daily rate for recalculation if needed
        const motorbike = motorbikes.find((m) => m.id === data.motorbike_id)
        
        // Update rental with proper structure
        const response = await fetch(`/api/rentals/${rental.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            motorbike_id: data.motorbike_id,
            start_date: data.start_date,
            end_date: data.end_date,
            daily_rate: motorbike?.daily_rate || rental.daily_rate,
            total_cost: data.total_cost,
            status: data.status,
          }),
        })

        if (!response.ok) throw new Error("Failed to update rental")

        toast.success("Rental updated successfully")
      } else {
        // For new rental, create customer first
        const customerResponse = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: data.customer_name,
            email: data.customer_email,
            phone: data.customer_phone,
          }),
        })

        if (!customerResponse.ok) {
          const errorData = await customerResponse.json()
          throw new Error(errorData.error || "Failed to create customer")
        }

        const customer = await customerResponse.json()

        // Get motorbike daily rate
        const motorbike = motorbikes.find((m) => m.id === data.motorbike_id)
        if (!motorbike) throw new Error("Motorbike not found")

        // Now create the rental with proper IDs
        const rentalResponse = await fetch("/api/rentals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: customer.id,
            motorbike_id: data.motorbike_id,
            start_date: data.start_date,
            end_date: data.end_date,
            daily_rate: motorbike.daily_rate,
            total_cost: data.total_cost,
            status: data.status,
          }),
        })

        if (!rentalResponse.ok) {
          const errorData = await rentalResponse.json()
          throw new Error(errorData.error || "Failed to create rental")
        }

        toast.success("Rental created successfully")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save rental")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Rental" : "Create New Rental"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the rental details below."
              : "Fill in the details to create a new rental."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Customer Information</h3>
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                {...register("customer_name", {
                  required: "Customer name is required",
                })}
                placeholder="Juan Dela Cruz"
              />
              {errors.customer_name && (
                <p className="text-sm text-destructive">
                  {errors.customer_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  {...register("customer_email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email",
                    },
                  })}
                  placeholder="juan@example.com"
                />
                {errors.customer_email && (
                  <p className="text-sm text-destructive">
                    {errors.customer_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone *</Label>
                <Input
                  id="customer_phone"
                  {...register("customer_phone", {
                    required: "Phone is required",
                  })}
                  placeholder="+63-XXX-XXX-XXXX"
                />
                {errors.customer_phone && (
                  <p className="text-sm text-destructive">
                    {errors.customer_phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Rental Details</h3>
            <div className="space-y-2">
              <Label htmlFor="motorbike_id">Motorcycle *</Label>
              <Select
                value={motorbikeId}
                onValueChange={(value) => setValue("motorbike_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a motorcycle" />
                </SelectTrigger>
                <SelectContent>
                  {motorbikes.map((bike) => (
                    <SelectItem key={bike.id} value={bike.id}>
                      {bike.brand} {bike.model} - {bike.plate_number} (₱
                      {bike.daily_rate}/day)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.motorbike_id && (
                <p className="text-sm text-destructive">
                  {errors.motorbike_id.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register("start_date", {
                    required: "Start date is required",
                  })}
                />
                {errors.start_date && (
                  <p className="text-sm text-destructive">
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register("end_date", { required: "End date is required" })}
                />
                {errors.end_date && (
                  <p className="text-sm text-destructive">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_cost">Total Cost (₱) *</Label>
                <Input
                  id="total_cost"
                  type="number"
                  step="0.01"
                  {...register("total_cost", {
                    required: "Total cost is required",
                    min: { value: 0, message: "Cost must be positive" },
                    valueAsNumber: true,
                  })}
                  readOnly
                  className="bg-muted"
                />
                {errors.total_cost && (
                  <p className="text-sm text-destructive">
                    {errors.total_cost.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {endDate && status === "completed" && (() => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const rentalEndDate = new Date(endDate)
                  rentalEndDate.setHours(0, 0, 0, 0)
                  
                  if (today < rentalEndDate) {
                    return (
                      <p className="text-sm text-destructive">
                        ⚠️ Cannot complete rental before end date ({new Date(endDate).toLocaleDateString()})
                      </p>
                    )
                  }
                  return null
                })()}
              </div>
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
              {isEdit ? "Update" : "Create"} Rental
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
