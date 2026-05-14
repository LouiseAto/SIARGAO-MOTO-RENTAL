"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bike,
  Users,
  TrendingUp,
  Activity,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { PesoIcon } from "@/components/icons/PesoIcon"

interface DashboardStats {
  totalMotorbikes: number
  availableMotorbikes: number
  activeRentals: number
  totalRevenue: number
  activeEmployees: number
  pendingPayroll: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch motorbikes
      const motorbikesRes = await fetch("/api/motorbikes")
      const motorbikesData = await motorbikesRes.json()
      const motorbikes = Array.isArray(motorbikesData) ? motorbikesData : []

      // Fetch rentals
      const rentalsRes = await fetch("/api/rentals")
      const rentalsData = await rentalsRes.json()
      const rentals = Array.isArray(rentalsData) ? rentalsData : []

      // Fetch employees
      const employeesRes = await fetch("/api/employees")
      const employeesData = await employeesRes.json()
      const employees = Array.isArray(employeesData) ? employeesData : []

      const availableCount = motorbikes.filter(
        (m: any) => m.status === "available"
      ).length
      const activeRentalsCount = rentals.filter(
        (r: any) => r.status === "active"
      ).length
      const totalRevenue = rentals.reduce(
        (sum: number, r: any) => sum + (r.total_cost || 0),
        0
      )
      const activeEmployeesCount = employees.filter(
        (e: any) => e.status === "Active"
      ).length

      setStats({
        totalMotorbikes: motorbikes.length,
        availableMotorbikes: availableCount,
        activeRentals: activeRentalsCount,
        totalRevenue,
        activeEmployees: activeEmployeesCount,
        pendingPayroll: 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      // Set default stats on error
      setStats({
        totalMotorbikes: 0,
        availableMotorbikes: 0,
        activeRentals: 0,
        totalRevenue: 0,
        activeEmployees: 0,
        pendingPayroll: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Fleet",
      value: stats?.totalMotorbikes || 0,
      icon: Bike,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Available",
      value: stats?.availableMotorbikes || 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      change: "+5%",
      changeType: "positive" as const,
    },
    {
      title: "Active Rentals",
      value: stats?.activeRentals || 0,
      icon: Activity,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Total Revenue",
      value: `₱${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: PesoIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+23%",
      changeType: "positive" as const,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "rental",
      message: "New rental started - Honda Click 160i",
      time: "5 minutes ago",
      icon: Bike,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "return",
      message: "Motorcycle returned - Yamaha NMAX",
      time: "1 hour ago",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      id: 3,
      type: "maintenance",
      message: "Maintenance scheduled - Suzuki Raider 150",
      time: "2 hours ago",
      icon: AlertCircle,
      color: "text-amber-500",
    },
    {
      id: 4,
      type: "employee",
      message: "New employee added - Maria Santos",
      time: "3 hours ago",
      icon: Users,
      color: "text-purple-500",
    },
  ]

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening with your business today."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                        >
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <Badge
                          variant={
                            stat.changeType === "positive" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <div className="text-3xl font-bold">{stat.value}</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}
                      >
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Employees</span>
                    </div>
                    <div className="text-lg font-bold">
                      {loading ? (
                        <Skeleton className="h-6 w-8" />
                      ) : (
                        stats?.activeEmployees || 0
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium">Tracked Units</span>
                    </div>
                    <div className="text-lg font-bold">
                      {loading ? (
                        <Skeleton className="h-6 w-8" />
                      ) : (
                        stats?.totalMotorbikes || 0
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <PesoIcon className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-medium">Avg. Daily</span>
                    </div>
                    <div className="text-lg font-bold">
                      {loading ? (
                        <Skeleton className="h-6 w-16" />
                      ) : (
                        `₱${Math.round((stats?.totalRevenue || 0) / 30).toLocaleString()}`
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Fleet Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bike className="w-5 h-5" />
                Fleet Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Available
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      stats?.availableMotorbikes || 0
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Rented
                    </span>
                    <Activity className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      stats?.activeRentals || 0
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">
                      Maintenance
                    </span>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold">
                    {loading ? <Skeleton className="h-8 w-12" /> : 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
