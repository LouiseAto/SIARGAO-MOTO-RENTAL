"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLoginPage() {
  const [email, setEmail] = useState("luwe.ato@gmail.com")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()

      // Test 1: Try to sign in
      console.log("🔐 Step 1: Attempting login...")
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        setResult({
          step: "Authentication",
          status: "❌ FAILED",
          error: authError.message,
          details: authError
        })
        setLoading(false)
        return
      }

      console.log("✅ Step 1: Login successful!")

      // Test 2: Check session
      console.log("🔐 Step 2: Checking session...")
      const { data: sessionData } = await supabase.auth.getSession()

      // Test 3: Check user
      console.log("🔐 Step 3: Checking user...")
      const { data: userData } = await supabase.auth.getUser()

      // Test 4: Check admin record
      console.log("🔐 Step 4: Checking admin record...")
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single()

      setResult({
        step: "Complete",
        status: "✅ SUCCESS",
        auth: {
          user: authData.user?.email,
          userId: authData.user?.id,
          sessionExists: !!authData.session
        },
        session: {
          exists: !!sessionData.session,
          expiresAt: sessionData.session?.expires_at
        },
        user: {
          exists: !!userData.user,
          email: userData.user?.email,
          id: userData.user?.id
        },
        admin: {
          exists: !!adminData,
          data: adminData,
          error: adminError?.message
        }
      })

      console.log("✅ All checks complete!")

    } catch (error: any) {
      setResult({
        step: "Error",
        status: "❌ FAILED",
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAdminRecord = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)

    alert(error ? `Error: ${error.message}` : `Admin records: ${JSON.stringify(data, null, 2)}`)
  }

  const createAdminRecord = async () => {
    const supabase = createClient()
    
    // Get user ID from auth
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData.user) {
      alert("No user logged in!")
      return
    }

    const { data, error } = await supabase
      .from('admins')
      .insert([{
        id: userData.user.id,
        email: userData.user.email || '',
        full_name: 'Louise Ato',
        role: 'admin'
      }] as any)
      .select()

    alert(error ? `Error: ${error.message}` : `Admin created: ${JSON.stringify(data, null, 2)}`)
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Login Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testLogin} disabled={loading}>
                {loading ? "Testing..." : "Test Login"}
              </Button>
              <Button onClick={checkAdminRecord} variant="outline">
                Check Admin Record
              </Button>
              <Button onClick={createAdminRecord} variant="secondary">
                Create Admin Record
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Enter your email and password</p>
            <p>2. Click "Test Login" to see detailed results</p>
            <p>3. Click "Check Admin Record" to see if admin record exists</p>
            <p>4. If admin record doesn't exist, click "Create Admin Record"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
