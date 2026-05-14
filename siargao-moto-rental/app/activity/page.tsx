"use client"

import { motion } from "framer-motion"
import { Activity, Bike, Users, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PesoIcon } from "@/components/icons/PesoIcon"

const activities = [
  {
    id: 1,
    type: "rental",
    message: "New rental created for Honda Click 160i",
    user: "Admin",
    time: "2 minutes ago",
    icon: Bike,
    color: "text-blue-500",
  },
  {
    id: 2,
    type: "employee",
    message: "Employee Maria Santos was added",
    user: "Admin",
    time: "15 minutes ago",
    icon: Users,
    color: "text-purple-500",
  },
  {
    id: 3,
    type: "payment",
    message: "Payment received - ₱2,500",
    user: "System",
    time: "1 hour ago",
    icon: PesoIcon,
    color: "text-emerald-500",
  },
  {
    id: 4,
    type: "maintenance",
    message: "Maintenance scheduled for Yamaha NMAX",
    user: "Admin",
    time: "2 hours ago",
    icon: AlertCircle,
    color: "text-amber-500",
  },
]

export default function ActivityPage() {
  return (
    <DashboardLayout
      title="Activity Logs"
      subtitle="Track all system activities and changes"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.user}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
