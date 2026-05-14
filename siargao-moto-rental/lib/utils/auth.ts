import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const supabase = createServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function getUser() {
  const supabase = createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  return user
}

export async function isAuthenticated() {
  const supabase = createServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  return !!session
}
