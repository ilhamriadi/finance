-- Create receipts table
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

-- Create index for better performance
CREATE INDEX idx_receipts_tanggal ON receipts(tanggal);
CREATE INDEX idx_receipts_toko ON receipts(toko);
CREATE INDEX idx_receipts_created_at ON receipts(created_at);

-- Enable Row Level Security (optional, for multi-tenant apps)
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (adjust as needed for your use case)
-- This allows anyone to read and write receipts (for demo purposes)
-- In production, you might want to add user authentication
CREATE POLICY "Allow public access to receipts" ON receipts
  FOR ALL USING (true)
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();