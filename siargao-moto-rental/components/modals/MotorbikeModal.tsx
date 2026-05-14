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

interface MotorbikeFormData {
  brand: string
  model: string
  year: number
  plate_number: string
  color: string
  daily_rate: number
  status: string
}

interface MotorbikeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  motorbike?: any
  onSuccess: () => void
}

export function MotorbikeModal({
  open,
  onOpenChange,
  motorbike,
  onSuccess,
}: MotorbikeModalProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!motorbike

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MotorbikeFormData>({
    defaultValues: {
      status: "available",
    },
  })

  const status = watch("status")

  useEffect(() => {
    if (motorbike) {
      reset({
        brand: motorbike.brand,
        model: motorbike.model,
        year: motorbike.year,
        plate_number: motorbike.plate_number,
        color: motorbike.color,
        daily_rate: motorbike.daily_rate,
        status: motorbike.status,
      })
    } else {
      reset({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        plate_number: "",
        color: "",
        daily_rate: 0,
        status: "available",
      })
    }
  }, [motorbike, reset])

  const onSubmit = async (data: MotorbikeFormData) => {
    setLoading(true)
    try {
      const url = isEdit
        ? `/api/motorbikes/${motorbike.id}`
        : "/api/motorbikes"
      const method = isEdit ? "PUT" : "POST"

      // Ensure proper data types
      const payload = {
        brand: data.brand,
        model: data.model,
        year: Number(data.year),
        plate_number: data.plate_number,
        color: data.color,
        daily_rate: Number(data.daily_rate),
        status: data.status,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save motorbike")
      }

      toast.success(
        isEdit
          ? "Motorcycle updated successfully"
          : "Motorcycle added successfully"
      )
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save motorcycle")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Motorcycle" : "Add New Motorcycle"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the motorcycle details below."
              : "Fill in the details to add a new motorcycle to your fleet."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                {...register("brand", { required: "Brand is required" })}
                placeholder="Honda, Yamaha, etc."
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                {...register("model", { required: "Model is required" })}
                placeholder="Click 160i, NMAX, etc."
              />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                {...register("year", {
                  required: "Year is required",
                  valueAsNumber: true,
                  min: { value: 2000, message: "Year must be 2000 or later" },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: "Invalid year",
                  },
                })}
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate_number">Plate Number *</Label>
              <Input
                id="plate_number"
                {...register("plate_number", {
                  required: "Plate number is required",
                })}
                placeholder="ABC-1234"
              />
              {errors.plate_number && (
                <p className="text-sm text-destructive">
                  {errors.plate_number.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                {...register("color", { required: "Color is required" })}
                placeholder="Red, Blue, etc."
              />
              {errors.color && (
                <p className="text-sm text-destructive">{errors.color.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily_rate">Daily Rate (₱) *</Label>
              <Input
                id="daily_rate"
                type="number"
                step="0.01"
                {...register("daily_rate", {
                  required: "Daily rate is required",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "Rate must be positive" },
                })}
              />
              {errors.daily_rate && (
                <p className="text-sm text-destructive">
                  {errors.daily_rate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
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
              {isEdit ? "Update" : "Add"} Motorcycle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
