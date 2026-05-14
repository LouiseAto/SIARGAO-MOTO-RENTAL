import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createServerClient()
    
    // Sign out the user - this clears the session and cookies
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    // Create response with cleared cookies
    const response = NextResponse.json({ 
      message: 'Logged out successfully',
      success: true 
    })
    
    // Clear any auth cookies
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    
    return response
  } catch (error: any) {
    console.error('Logout exception:', error)
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    )
  }
}
