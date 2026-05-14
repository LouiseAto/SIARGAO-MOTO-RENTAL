"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SimpleTestPage() {
  const [email, setEmail] = useState("luwe.ato@gmail.com")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const testLogin = async () => {
    setMessage("Testing...")
    const supabase = createClient()

    try {
      // Step 1: Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setMessage(`❌ Login failed: ${error.message}`)
        return
      }

      setMessage("✅ Login successful! Checking session...")

      // Step 2: Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 3: Check session
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (sessionData.session) {
        setMessage(`✅ Session exists! User: ${sessionData.session.user.email}`)
        
        // Step 4: Try to redirect
        setTimeout(() => {
          setMessage("🔄 Redirecting to dashboard...")
          window.location.href = "/dashboard"
        }, 2000)
      } else {
        setMessage("❌ No session found after login!")
      }

    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    }
  }

  const checkSession = async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    
    if (data.session) {
      setMessage(`✅ Session exists: ${data.session.user.email}`)
    } else {
      setMessage("❌ No session")
    }
  }

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMessage("✅ Logged out")
  }

  const goDashboard = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Simple Login Test</h1>
        
        <div className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          
          <div className="flex gap-2">
            <Button onClick={testLogin}>Test Login</Button>
            <Button onClick={checkSession} variant="outline">Check Session</Button>
            <Button onClick={logout} variant="destructive">Logout</Button>
          </div>

          <Button onClick={goDashboard} className="w-full" variant="secondary">
            Go to Dashboard
          </Button>
        </div>

        {message && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
