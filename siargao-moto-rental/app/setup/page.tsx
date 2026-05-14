"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bike, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const createAdminUser = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup/create-admin", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user")
      }

      setSuccess(true)
      toast.success("Admin user created successfully!")
      
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin user")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-mesh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-border/50">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Bike className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Initial Setup</CardTitle>
              <CardDescription className="text-base mt-2">
                Create your admin account to get started
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Setup Complete!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Redirecting to login...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                  <h3 className="font-semibold text-sm">Admin Credentials</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong> admin@siargao-moto.com
                    </p>
                    <p>
                      <strong>Password:</strong> admin123
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Click the button below to create your admin account. This will:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Create an admin user in Supabase Auth</li>
                    <li>Set up the admin profile</li>
                    <li>Enable you to log in to the system</li>
                  </ul>
                </div>

                <Button
                  onClick={createAdminUser}
                  className="w-full h-11 text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Admin User...
                    </>
                  ) : (
                    "Create Admin Account"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2024 Siargao Moto Rental. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
