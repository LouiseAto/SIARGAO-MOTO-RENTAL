"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { MapPin, Bike, Navigation, Layers } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg border border-border bg-muted flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  ),
})

interface Motorbike {
  id: string
  brand: string
  model: string
  plate_number: string
  status: string
  daily_rate?: number
  latitude?: number
  longitude?: number
}

export default function MapPage() {
  const [motorbikes, setMotorbikes] = useState<Motorbike[]>([])
  const [loading, setLoading] = useState(true)

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
      
      const motorbikesArray = Array.isArray(data) ? data : []
      
      // Add mock GPS coordinates for demo
      const withCoordinates = motorbikesArray.map((bike: Motorbike, index: number) => ({
        ...bike,
        latitude: 9.8 + (Math.random() - 0.5) * 0.1,
        longitude: 126.0 + (Math.random() - 0.5) * 0.1,
        daily_rate: bike.daily_rate || 500,
      }))
      
      setMotorbikes(withCoordinates)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch motorcycles")
      console.error(error)
      setMotorbikes([])
    } finally {
      setLoading(false)
    }
  }

  const rentedBikes = Array.isArray(motorbikes) ? motorbikes.filter((m) => m.status === "rented") : []
  const availableBikes = Array.isArray(motorbikes) ? motorbikes.filter((m) => m.status === "available") : []

  return (
    <DashboardLayout
      title="GIS Tracking"
      subtitle="Real-time motorcycle location tracking"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : motorbikes.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Motorcycles tracked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">On Road</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : rentedBikes.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently rented
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : availableBikes.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                At base location
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Live Motorcycle Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border">
                <MapComponent motorbikes={motorbikes.filter(m => m.latitude && m.longitude) as any} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="text-sm">Rented</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-sm">Maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motorcycle List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tracked Motorcycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))
              ) : motorbikes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No motorcycles to track
                </div>
              ) : (
                motorbikes.slice(0, 5).map((bike) => (
                  <div
                    key={bike.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bike className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {bike.brand} {bike.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {bike.plate_number}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        bike.status === "available"
                          ? "default"
                          : bike.status === "rented"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {bike.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
