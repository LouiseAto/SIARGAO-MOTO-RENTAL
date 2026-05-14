import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rentalSchema } from '@/lib/utils/validators'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        motorbikes (*),
        customers (*)
      `)
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
    
    // Validate input
    const validatedData = rentalSchema.partial().parse(body)
    
    // Get current rental
    const { data: currentRental } = await supabase
      .from('rentals')
      .select('motorbike_id, status')
      .eq('id', params.id)
      .single() as any
    
    const { data, error } = await (supabase.from('rentals') as any)
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    // If rental is completed, update motorbike status to available
    if (validatedData.status === 'completed' && currentRental) {
      await (supabase.from('motorbikes') as any)
        .update({ status: 'available' })
        .eq('id', currentRental.motorbike_id)
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
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
    
    // Get rental info before deleting
    const { data: rental } = await supabase
      .from('rentals')
      .select('motorbike_id')
      .eq('id', params.id)
      .single() as any
    
    const { error } = await supabase
      .from('rentals')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error
    
    // Update motorbike status to available
    if (rental) {
      await (supabase.from('motorbikes') as any)
        .update({ status: 'available' })
        .eq('id', rental.motorbike_id)
    }
    
    return NextResponse.json({ message: 'Rental deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
