import React, { useState } from 'react'
import { uploadImage } from '../lib/supabase'
import { ChatAvatar } from './ChatAvatar'

interface EditableAvatarProps {
  imageUrl: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  onUpdate?: (url: string) => void
}

export function EditableAvatar({ imageUrl, alt = 'Avatar', size = 'md', onUpdate }: EditableAvatarProps) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const url = await uploadImage(file, 'avatars', 'user-avatars')
      onUpdate?.(url)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error uploading avatar: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative group">
      <ChatAvatar imageUrl={imageUrl} alt={alt} size={size} />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="avatar-upload"
        />
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </div>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}