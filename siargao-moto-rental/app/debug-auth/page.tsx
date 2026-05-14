"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      
      // Get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      // Get user
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      // Check admin record
      let adminData = null
      if (userData.user?.email) {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('email', userData.user.email)
          .single()
        
        adminData = { data, error: error?.message }
      }
      
      setAuthState({
        session: {
          exists: !!sessionData.session,
          data: sessionData.session,
          error: sessionError?.message
        },
        user: {
          exists: !!userData.user,
          data: userData.user,
          error: userError?.message
        },
        admin: adminData,
        cookies: document.cookie
      })
    } catch (error: any) {
      setAuthState({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    const supabase = createClient()
    const email = prompt("Enter email:")
    const password = prompt("Enter password:")
    
    if (!email || !password) return
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    alert(error ? `Error: ${error.message}` : "Login successful!")
    checkAuth()
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    checkAuth()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Authentication Debug Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={checkAuth}>Refresh</Button>
              <Button onClick={testLogin}>Test Login</Button>
              <Button onClick={logout} variant="destructive">Logout</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(authState?.session, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(authState?.user, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Record</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(authState?.admin, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {authState?.cookies || "No cookies"}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify({
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
