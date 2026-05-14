import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@siargao-moto.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Check if admin user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const adminExists = existingUsers?.users.some(user => user.email === adminEmail)

    if (adminExists) {
      return NextResponse.json(
        { message: 'Admin user already exists', email: adminEmail },
        { status: 200 }
      )
    }

    // Create admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'System Administrator',
        role: 'admin'
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Failed to create user')
    }

    // Create admin profile in admins table
    const { error: profileError } = await supabaseAdmin
      .from('admins')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        full_name: 'System Administrator',
        role: 'admin'
      })

    if (profileError) {
      console.error('Profile error:', profileError)
      // Don't throw error if profile creation fails, user can still login
    }

    return NextResponse.json({
      message: 'Admin user created successfully',
      email: adminEmail,
      userId: authData.user.id
    })
  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
