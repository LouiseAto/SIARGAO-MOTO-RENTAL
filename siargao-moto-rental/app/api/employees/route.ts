import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { employeeSchema } from '@/lib/utils/validators'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    console.log("GET /api/employees - Raw data from DB:", data.map(e => ({ 
      name: e.full_name, 
      is_active: e.is_active,
      has_status_column: 'status' in e
    })))
    
    // Map is_active to status (database uses is_active boolean)
    const mappedData = data.map(employee => ({
      ...employee,
      status: employee.is_active ? 'active' : 'inactive'
    }))
    
    console.log("GET /api/employees - Mapped data:", mappedData.map(e => ({ 
      name: e.full_name, 
      status: e.status,
      is_active: e.is_active
    })))
    
    return NextResponse.json(mappedData)
  } catch (error: any) {
    console.error("GET /api/employees error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    console.log("POST /api/employees - Request body:", body)
    
    // Validate input
    const validatedData = employeeSchema.parse(body)
    
    // Try to insert with status first (if column exists)
    let dbData: any = { ...validatedData }
    
    // Also set is_active for backward compatibility
    if (validatedData.status) {
      dbData.is_active = validatedData.status === 'active'
    }
    
    console.log("POST /api/employees - Inserting:", dbData)
    
    const { data, error } = await (supabase.from('employees') as any)
      .insert(dbData)
      .select()
      .single()
    
    if (error) {
      // If status column doesn't exist, try without it
      if (error.message?.includes('status')) {
        delete dbData.status
        const { data: retryData, error: retryError } = await (supabase.from('employees') as any)
          .insert(dbData)
          .select()
          .single()
        
        if (retryError) throw retryError
        
        // Map back to status for response
        const responseData = {
          ...retryData,
          status: retryData.is_active ? 'active' : 'inactive'
        }
        
        console.log("POST /api/employees - Created (retry):", responseData)
        return NextResponse.json(responseData, { status: 201 })
      }
      throw error
    }
    
    // Ensure response has status field
    const responseData = {
      ...data,
      status: data.status || (data.is_active ? 'active' : 'inactive')
    }
    
    console.log("POST /api/employees - Created:", responseData)
    
    return NextResponse.json(responseData, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/employees error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
