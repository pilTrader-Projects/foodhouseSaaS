'use client';

import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ name, size = 'md', className = '' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-blue-600 rounded-xl flex-center font-black text-white shadow-lg ${className}`}>
      {name.charAt(0)}
    </div>
  );
}
