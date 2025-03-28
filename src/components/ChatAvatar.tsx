import React from 'react'

interface ChatAvatarProps {
  imageUrl: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12'
}

export function ChatAvatar({ imageUrl, alt = 'Avatar', size = 'md' }: ChatAvatarProps) {
  return (
    <div className={`avatar flex items-center justify-center bg-white rounded-full overflow-hidden ${sizeClasses[size]}`}>
      <img 
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  )
}