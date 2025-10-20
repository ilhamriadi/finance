'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Camera } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  onClear: () => void
  preview?: string
  isProcessing?: boolean
}

export default function ImageUpload({ onImageSelect, onClear, preview, isProcessing = false }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string
        onImageSelect(file, previewUrl)
      }
      reader.readAsDataURL(file)
    }
    setDragActive(false)
  }, [onImageSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: isProcessing,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  if (preview) {
    return (
      <div className="relative w-full">
        <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview struk"
            className="w-full h-64 object-contain"
          />
          <button
            onClick={onClear}
            disabled={isProcessing}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
        ${dragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
        }
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <div className={`
          p-4 rounded-full
          ${dragActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}
        `}>
          {isProcessing ? (
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          ) : (
            <Camera className={`w-8 h-8 ${dragActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} />
          )}
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {isProcessing ? 'Memproses gambar...' : 'Upload struk belanja'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isProcessing
              ? 'AI sedang mengekstrak informasi dari struk'
              : 'Drag & drop atau klik untuk memilih file (JPG/PNG)'
            }
          </p>
        </div>
        {!isProcessing && (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Pilih File</span>
          </button>
        )}
      </div>
    </div>
  )
}