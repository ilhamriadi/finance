'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ReceiptForm from '@/components/ReceiptForm'
import Toast from '@/components/Toast'
import { Receipt } from '@/lib/types'
import { Camera, FileText } from 'lucide-react'

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string>('')
  const [extractedData, setExtractedData] = useState<Partial<Receipt> | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const handleImageSelect = (file: File, preview: string) => {
    setImagePreview(preview)
    extractReceiptData(file)
  }

  const handleClearImage = () => {
    setImagePreview('')
    setExtractedData(null)
  }

  const extractReceiptData = async (file: File) => {
    setIsExtracting(true)
    setToast({ message: 'Sedang mengekstrak data dari struk...', type: 'success' })

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setExtractedData(result.data)
        showToast('Data berhasil diekstrak! Silakan periksa dan edit jika perlu.', 'success')
      } else {
        showToast(result.error || 'Gagal mengekstrak data dari struk', 'error')
      }
    } catch (error) {
      console.error('Error extracting receipt:', error)
      showToast('Terjadi kesalahan saat mengekstrak data struk', 'error')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleFormSubmit = async (data: Receipt) => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        showToast('Transaksi berhasil disimpan!', 'success')
        // Reset form
        handleClearImage()
        setExtractedData(null)
      } else {
        showToast(result.error || 'Gagal menyimpan transaksi', 'error')
      }
    } catch (error) {
      console.error('Error saving receipt:', error)
      showToast('Terjadi kesalahan saat menyimpan transaksi', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Aplikasi Pencatatan Keuangan
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload struk belanja dan AI akan otomatis mengekstrak informasinya
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Struk Belanja
                </h2>
              </div>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onClear={handleClearImage}
                preview={imagePreview}
                isProcessing={isExtracting}
              />
              {isExtracting && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      AI sedang menganalisis struk belanja...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Cara Penggunaan:
              </h3>
              <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">1</span>
                  <span>Upload foto struk belanja (JPG/PNG)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">2</span>
                  <span>AI akan otomatis mengekstrak informasi dari struk</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
                  <span>Periksa dan edit data jika diperlukan</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">4</span>
                  <span>Klik &quot;Simpan Transaksi&quot; untuk menyimpan ke database</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Detail Transaksi
                </h2>
              </div>

              {extractedData || imagePreview ? (
                <ReceiptForm
                  initialData={extractedData || {}}
                  onSubmit={handleFormSubmit}
                  isLoading={isSaving}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Upload struk belanja untuk memulai
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}