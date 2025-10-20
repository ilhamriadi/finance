'use client'

import { useState } from 'react'
import { Receipt, ReceiptItem } from '@/lib/types'
import { Calendar, Store, DollarSign, Plus, Trash2, Save } from 'lucide-react'

interface ReceiptFormProps {
  initialData?: Partial<Receipt>
  onSubmit: (data: Receipt) => Promise<void>
  isLoading?: boolean
}

export default function ReceiptForm({ initialData, onSubmit, isLoading = false }: ReceiptFormProps) {
  const [formData, setFormData] = useState<Receipt>({
    tanggal: initialData?.tanggal || '',
    toko: initialData?.toko || '',
    total: initialData?.total || '',
    items: initialData?.items || [],
    image_url: initialData?.image_url || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi'
    }

    if (!formData.toko.trim()) {
      newErrors.toko = 'Nama toko wajib diisi'
    }

    if (!formData.total) {
      newErrors.total = 'Total belanja wajib diisi'
    } else if (isNaN(Number(formData.total)) || Number(formData.total) <= 0) {
      newErrors.total = 'Total belanja harus berupa angka positif'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { nama: '', harga: '' }]
    }))
  }

  const updateItem = (index: number, field: keyof ReceiptItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '')
    return number ? parseInt(number).toLocaleString('id-ID') : ''
  }

  const handleTotalChange = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '')
    setFormData(prev => ({ ...prev, total: cleanValue }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tanggal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Calendar className="inline w-4 h-4 mr-2" />
          Tanggal Transaksi
        </label>
        <input
          type="date"
          value={formData.tanggal}
          onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
            errors.tanggal ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.tanggal && (
          <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
        )}
      </div>

      {/* Nama Toko */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Store className="inline w-4 h-4 mr-2" />
          Nama Toko
        </label>
        <input
          type="text"
          value={formData.toko}
          onChange={(e) => setFormData(prev => ({ ...prev, toko: e.target.value }))}
          placeholder="Contoh: Indomaret, Alfamart, Supermarket"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
            errors.toko ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.toko && (
          <p className="mt-1 text-sm text-red-600">{errors.toko}</p>
        )}
      </div>

      {/* Total Belanja */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <DollarSign className="inline w-4 h-4 mr-2" />
          Total Belanja (Rp)
        </label>
        <input
          type="text"
          value={formatCurrency(formData.total)}
          onChange={(e) => handleTotalChange(e.target.value)}
          placeholder="0"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
            errors.total ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.total && (
          <p className="mt-1 text-sm text-red-600">{errors.total}</p>
        )}
      </div>

      {/* Daftar Item */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Daftar Item (Opsional)
          </label>
          <button
            type="button"
            onClick={addItem}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {formData.items.map((item, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={item.nama}
                onChange={(e) => updateItem(index, 'nama', e.target.value)}
                placeholder="Nama item"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              />
              <input
                type="text"
                value={item.harga ? formatCurrency(item.harga) : ''}
                onChange={(e) => updateItem(index, 'harga', e.target.value.replace(/[^\d]/g, ''))}
                placeholder="Harga"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={isLoading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {formData.items.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Belum ada item yang ditambahkan. Klik &quot;Tambah Item&quot; untuk menambahkan daftar belanja.
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}</span>
        </button>
      </div>
    </form>
  )
}