import { useState } from 'react'
import { uploadImage } from '../lib/supabase'

interface ImageUploaderProps {
  bucket: 'avatars' | 'media'
  path: string
  onUpload: (url: string) => void
}

export function ImageUploader({ bucket, path, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const url = await uploadImage(file, bucket, path)
      onUpload(url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label 
        htmlFor="image-upload" 
        className="cursor-pointer inline-flex items-center justify-center"
      >
        {uploading ? (
          <span className="text-sm text-blue-600">Uploading...</span>
        ) : (
          <img 
            src="https://bptsaimcgsnzsuwperoi.supabase.co/storage/v1/object/sign/media/logo/Black%20&%20White%20Icon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sb2dvL0JsYWNrICYgV2hpdGUgSWNvbi5wbmciLCJpYXQiOjE3NDI2ODMyMzMsImV4cCI6MjA1ODA0MzIzM30.5i3J0RG62lJsgDKtaHRTpxdn_5HkxkgcD-Gk2RwPe90"
            alt="Upload"
            className="w-6 h-6"
          />
        )}
      </label>
    </div>
  )
}