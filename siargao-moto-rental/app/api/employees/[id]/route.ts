import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { employeeSchema } from '@/lib/utils/validators'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    console.log("=== EMPLOYEE API PUT ===")
    console.log("Employee ID:", params.id)
    console.log("Request body:", body)
    
    // Validate input
    const validatedData = employeeSchema.partial().parse(body)
    console.log("Validated data:", validatedData)
    
    // Prepare data for database - map status to is_active
    const dbData: any = { ...validatedData }
    
    // Map status to is_active (database uses is_active boolean)
    if (validatedData.status) {
      dbData.is_active = validatedData.status === 'active'
      delete dbData.status // Remove status field as database doesn't have it
      console.log("Mapped status to is_active:", dbData.is_active)
    }
    
    console.log("Data to update in DB (final):", dbData)
    
    const { data, error } = await (supabase.from('employees') as any)
      .update(dbData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error("Supabase update error:", error)
      throw error
    }
    
    console.log("Raw data from database:", data)
    
    // Map back to status for response
    const responseData = {
      ...data,
      status: data.is_active ? 'active' : 'inactive'
    }
    
    console.log("Updated employee data (with status mapped):", responseData)
    console.log("Updated status:", responseData.status)
    console.log("Updated is_active:", data.is_active)
    
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("PUT error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    return NextResponse.json({ message: 'Employee deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
