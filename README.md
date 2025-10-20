# Aplikasi Pencatatan Keuangan dengan AI Vision

Aplikasi web berbasis Next.js untuk mencatat transaksi belanja dari struk menggunakan AI Vision (Google Gemini) dan database Supabase.

## 🚀 Fitur Utama

- **📸 Upload Struk** - Upload foto struk belanja (JPG/PNG)
- **🤖 AI Extraction** - AI otomatis mengekstrak informasi dari struk:
  - Tanggal transaksi
  - Nama toko
  - Total belanja
  - Daftar item dan harga (jika tersedia)
- **✏️ Edit Manual** - Hasil ekstraksi bisa diedit manual
- **💾 Database** - Data disimpan ke database Supabase real-time
- **📱 Responsive** - Desain modern dan responsif untuk mobile
- **🌙 Dark Mode** - Dukungan dark mode

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: API Routes Next.js
- **AI Vision**: Google Gemini Pro Vision API
- **Database**: Supabase
- **UI Components**: Lucide React Icons, React Dropzone

## 📋 Prerequisites

- Node.js 18+
- Akun Google Cloud dengan Gemini Vision API
- Akun Supabase

## 🚀 Setup & Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd finance-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy file `.env.local` dan sesuaikan konfigurasinya:

```env
# Gemini Vision API
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Mendapatkan API Keys:

**Gemini Vision API:**
1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Buat API key baru
3. Copy API key ke `GEMINI_API_KEY`

**Supabase:**
1. Buat project baru di [Supabase](https://supabase.com)
2. Buka Settings → API
3. Copy URL dan Anon Key ke environment variables

### 4. Setup Database Supabase

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Buat tabel receipts
CREATE TABLE receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE,
  toko TEXT,
  total DECIMAL(12, 2),
  items JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX idx_receipts_tanggal ON receipts(tanggal);
CREATE INDEX idx_receipts_toko ON receipts(toko);
CREATE INDEX idx_receipts_created_at ON receipts(created_at);

-- Enable Row Level Security
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Policy untuk public access (sesuaikan untuk production)
CREATE POLICY "Allow public access to receipts" ON receipts
  FOR ALL USING (true)
  WITH CHECK (true);

-- Trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📱 Cara Penggunaan

1. **Upload Struk** - Klik area upload atau drag & drop foto struk
2. **AI Processing** - AI akan otomatis menganalisis dan mengekstrak data
3. **Review & Edit** - Periksa hasil ekstraksi dan edit jika perlu
4. **Simpan** - Klik "Simpan Transaksi" untuk menyimpan ke database

## 📁 Struktur Proyek

```
finance-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── extract/       # Endpoint untuk ekstraksi struk
│   │   └── receipts/      # Endpoint CRUD receipts
│   └── page.tsx           # Halaman utama
├── components/            # React Components
│   ├── ImageUpload.tsx    # Komponen upload gambar
│   ├── ReceiptForm.tsx    # Form input transaksi
│   └── Toast.tsx          # Notifikasi
├── lib/                   # Utility functions
│   ├── gemini.ts          # Koneksi Gemini Vision API
│   ├── supabase.ts        # Koneksi Supabase
│   └── types.ts           # TypeScript types
├── supabase/              # Supabase migrations
│   └── migrations/
├── .env.local             # Environment variables
└── README.md              # Dokumentasi
```

## 🔧 API Endpoints

### POST `/api/extract`
Mengekstrak data dari gambar struk menggunakan Gemini Vision API.

**Request:**
- `FormData` dengan file `image` (JPG/PNG)

**Response:**
```json
{
  "success": true,
  "data": {
    "tanggal": "2025-10-21",
    "toko": "Indomaret Cibodas",
    "total": "125000",
    "items": [
      {"nama": "Mie Goreng", "harga": "3000"},
      {"nama": "Air Mineral", "harga": "5000"}
    ]
  }
}
```

### POST `/api/receipts`
Menyimpan data transaksi ke Supabase.

**Request:**
```json
{
  "tanggal": "2025-10-21",
  "toko": "Indomaret Cibodas",
  "total": "125000",
  "items": [
    {"nama": "Mie Goreng", "harga": "3000"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tanggal": "2025-10-21",
    "toko": "Indomaret Cibodas",
    "total": 125000.00,
    "items": [...],
    "created_at": "2025-10-21T10:00:00Z"
  }
}
```

## 🚀 Deploy ke Vercel

1. Push code ke GitHub
2. Hubungkan repository dengan [Vercel](https://vercel.com)
3. Setup environment variables di Vercel dashboard
4. Deploy

**Environment Variables di Vercel:**
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔒 Security Notes

- Untuk production, tambahkan authentication system
- Validasi file upload (size, type)
- Rate limiting untuk API endpoints
- HTTPS wajib untuk production

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🆘 Troubleshooting

### Error: "GEMINI_API_KEY is not configured"
- Pastikan API key sudah di-set di `.env.local`
- Restart development server

### Error: "Supabase connection failed"
- Periksa URL dan anon key di environment variables
- Pastikan tabel `receipts` sudah dibuat di Supabase

### Error: "Image upload failed"
- Pastikan file berformat JPG/PNG
- Check file size (maks 10MB)

## 📞 Support

Jika ada pertanyaan atau issues, silakan:
- Buat issue di GitHub repository
- Contact development team# finance
