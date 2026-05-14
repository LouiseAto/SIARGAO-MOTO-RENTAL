import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rentalSchema } from '@/lib/utils/validators'
import { calculateRentalCost } from '@/lib/utils/calculations'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        motorbikes (*),
        customers (*)
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
    
    // Calculate total cost if not provided
    if (!body.total_cost && body.start_date && body.end_date && body.daily_rate) {
      body.total_cost = calculateRentalCost(body.start_date, body.end_date, body.daily_rate)
    }
    
    // Validate input
    const validatedData = rentalSchema.parse(body)
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Insert rental
    const { data, error } = await (supabase.from('rentals') as any)
      .insert({
        ...validatedData,
        created_by: user?.id,
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update motorbike status to rented
    await (supabase.from('motorbikes') as any)
      .update({ status: 'rented' })
      .eq('id', validatedData.motorbike_id)
    
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
