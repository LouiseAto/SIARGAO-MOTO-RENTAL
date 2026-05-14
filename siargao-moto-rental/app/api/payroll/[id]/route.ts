import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id } = params

    // Validate input - ensure non-negative values
    if (body.hours_worked !== undefined && body.hours_worked < 0) {
      return NextResponse.json(
        { error: 'Hours worked must be non-negative' },
        { status: 400 }
      )
    }
    if (body.hourly_rate !== undefined && body.hourly_rate < 0) {
      return NextResponse.json(
        { error: 'Hourly rate must be non-negative' },
        { status: 400 }
      )
    }
    if (body.base_amount !== undefined && body.base_amount < 0) {
      return NextResponse.json(
        { error: 'Base amount must be non-negative' },
        { status: 400 }
      )
    }
    if (body.bonuses !== undefined && body.bonuses < 0) {
      return NextResponse.json(
        { error: 'Bonuses must be non-negative' },
        { status: 400 }
      )
    }
    if (body.deductions !== undefined && body.deductions < 0) {
      return NextResponse.json(
        { error: 'Deductions must be non-negative' },
        { status: 400 }
      )
    }
    if (body.total_amount !== undefined && body.total_amount < 0) {
      return NextResponse.json(
        { error: 'Total amount must be non-negative' },
        { status: 400 }
      )
    }

    // Validate date range if both dates are provided
    if (body.period_start && body.period_end) {
      const startDate = new Date(body.period_start)
      const endDate = new Date(body.period_end)
      if (endDate < startDate) {
        return NextResponse.json(
          { error: 'Period end must be after or equal to period start' },
          { status: 400 }
        )
      }
    }

    // Validate status if provided
    if (body.status && !['paid', 'pending'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Status must be either "paid" or "pending"' },
        { status: 400 }
      )
    }

    // Update the payroll record
    const { data, error } = await (supabase
      .from('payroll') as any)
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Payroll record not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating payroll record:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update payroll record' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { id } = params

    // Delete the payroll record
    const { error } = await (supabase
      .from('payroll') as any)
      .delete()
      .eq('id', id)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Payroll record not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Payroll record deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting payroll record:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete payroll record' },
      { status: 500 }
    )
  }
}
