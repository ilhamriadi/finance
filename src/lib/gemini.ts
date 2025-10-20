export interface ReceiptData {
  tanggal: string
  toko: string
  total: string
  items: Array<{
    nama: string
    harga: string
  }>
}

export async function extractReceiptFromImage(imageBase64: string): Promise<ReceiptData> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const prompt = `Ekstrak informasi dari gambar struk belanja berikut secara akurat dan terstruktur.
Ambil data berikut:
- Tanggal transaksi
- Nama toko
- Total belanja
- Daftar item dan harga (jika tersedia)

Format hasil dalam JSON seperti ini:
{
  "tanggal": "2025-10-21",
  "toko": "Indomaret Cibodas",
  "total": "125000",
  "items": [
    { "nama": "Mie Goreng", "harga": "3000" },
    { "nama": "Air Mineral", "harga": "5000" }
  ]
}

Ketentuan:
- Jika informasi tidak tersedia, isi dengan string kosong ("")
- Jangan gunakan null, undefined, atau komentar tambahan
- Pastikan format JSON valid dan bisa langsung diparsing
- Gunakan bahasa Indonesia untuk nama toko dan item
- Jangan tambahkan penjelasan di luar JSON`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('No response from Gemini API')
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response')
    }

    const result = JSON.parse(jsonMatch[0])

    // Validate and clean the result
    return {
      tanggal: result.tanggal || '',
      toko: result.toko || '',
      total: result.total || '',
      items: Array.isArray(result.items) ? result.items : []
    }
  } catch (error) {
    console.error('Error extracting receipt:', error)
    throw error
  }
}