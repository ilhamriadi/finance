export interface ReceiptItem {
  nama: string
  harga: string
}

export interface Receipt {
  id?: string
  tanggal: string
  toko: string
  total: string
  items: ReceiptItem[]
  image_url?: string
  created_at?: string
  updated_at?: string
}