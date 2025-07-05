import React from 'react'

interface AuthLayoutProps{
    children: React.ReactNode  
}

export default function AuthLayout({children}:AuthLayoutProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>{children}</div>
  )
}
