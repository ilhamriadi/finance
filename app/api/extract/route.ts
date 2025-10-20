import { NextRequest, NextResponse } from 'next/server'
import { extractReceiptFromImage } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // Extract receipt data using Gemini
    const receiptData = await extractReceiptFromImage(base64)

    return NextResponse.json({
      success: true,
      data: receiptData
    })

  } catch (error) {
    console.error('Error in extract API:', error)
    return NextResponse.json(
      {
        error: 'Failed to extract receipt data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}