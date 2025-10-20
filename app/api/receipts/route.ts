import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Receipt } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Receipt

    // Validate required fields
    if (!body.tanggal || !body.toko || !body.total) {
      return NextResponse.json(
        { error: 'Missing required fields: tanggal, toko, total' },
        { status: 400 }
      )
    }

    // Prepare data for Supabase
    const receiptData = {
      tanggal: body.tanggal,
      toko: body.toko,
      total: parseFloat(body.total.toString()) || 0,
      items: body.items || [],
      image_url: body.image_url || null
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('receipts')
      .insert(receiptData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save receipt', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('Error in receipts API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Fetch all receipts ordered by created_at desc
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch receipts', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Error in receipts API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}