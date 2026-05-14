"use client"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bike, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "luwe.ato@gmail.com",
    password: "",
  })

  // Clear any existing session when landing on login page
  useEffect(() => {
    const clearSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      // If there's an active session, sign out
      if (session) {
        await supabase.auth.signOut()
      }
    }
    clearSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      console.log("🔐 Step 1: Attempting login...")
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error("❌ Login failed:", error.message)
        toast.error(error.message)
        setLoading(false)
        return
      }

      if (!data.session) {
        console.error("❌ No session created")
        toast.error("No session created")
        setLoading(false)
        return
      }

      console.log("✅ Step 2: Login successful, session created")
      toast.success("Login successful!")

      // Wait for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log("✅ Step 3: Redirecting...")
      
      // Force page reload to ensure server reads new cookies
      window.location.href = "/dashboard"
      
    } catch (error: any) {
      console.error("❌ Error:", error)
      toast.error(error.message || "Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-mesh">
      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

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
              <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base mt-2">
                Sign in to your Siargao Moto account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="luwe.ato@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Admin Credentials
              </p>
              <div className="space-y-1 text-xs text-center">
                <p>
                  <strong>Email:</strong> luwe.ato@gmail.com
                </p>
                <p>
                  <strong>Password:</strong> [Set in Supabase]
                </p>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Admin-only access
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2024 Siargao Moto Rental. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
