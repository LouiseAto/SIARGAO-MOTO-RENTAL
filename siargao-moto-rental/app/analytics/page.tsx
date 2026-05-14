"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PesoIcon } from "@/components/icons/PesoIcon"

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Business insights and performance metrics"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Revenue Growth", value: "+23%", icon: TrendingUp, color: "text-emerald-500" },
            { title: "Total Revenue", value: "₱125,000", icon: PesoIcon, color: "text-blue-500" },
            { title: "Active Customers", value: "156", icon: Users, color: "text-purple-500" },
            { title: "Avg. Rental", value: "₱2,500", icon: BarChart3, color: "text-amber-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Analytics Dashboard</p>
              <p className="text-sm mt-2">Charts and detailed analytics coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
