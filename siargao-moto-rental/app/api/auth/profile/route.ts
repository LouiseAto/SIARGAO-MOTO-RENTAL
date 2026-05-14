import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user profile from employees table
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', user.email)
      .single()

    if (error) {
      // If not found in employees, return user data from auth
      return NextResponse.json({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || '',
        avatar: user.user_metadata?.avatar || '',
      })
    }

    return NextResponse.json({
      full_name: employee.full_name,
      email: employee.email,
      phone: employee.phone || '',
      address: employee.address || '',
      avatar: employee.avatar || '',
    })
  } catch (error: any) {
    console.error('GET /api/auth/profile error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    console.log('PUT /api/auth/profile - Request body:', body)
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Update user profile in employees table
    const updateData: any = {
      full_name: body.full_name,
      email: body.email,
    }
    
    // Add optional fields if provided
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.address !== undefined) updateData.address = body.address
    
    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('email', user.email)
      .select()
      .single()

    if (error) {
      console.error('Failed to update employee profile:', error)
      
      // If not found in employees, update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        email: body.email,
        data: {
          full_name: body.full_name,
          phone: body.phone,
          address: body.address,
        },
      })

      if (updateError) throw updateError

      return NextResponse.json({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone || '',
        address: body.address || '',
      })
    }

    console.log('Profile updated successfully:', data)

    return NextResponse.json({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
    })
  } catch (error: any) {
    console.error('PUT /api/auth/profile error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
