import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { payrollSchema } from '@/lib/utils/validators'
import { calculatePayrollTotal } from '@/lib/utils/calculations'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('payroll')
      .select(`
        *,
        employees (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error: any) {
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
    
    // Calculate total amount if not provided
    if (!body.total_amount && body.base_amount) {
      body.total_amount = calculatePayrollTotal(
        body.base_amount,
        body.bonuses || 0,
        body.deductions || 0
      )
    }
    
    // Validate input
    const validatedData = payrollSchema.parse(body)
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error} = await (supabase.from('payroll') as any)
      .insert({
        ...validatedData,
        created_by: user?.id,
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
