"use client";
import { ClerkProvider } from '@clerk/nextjs';
import React from 'react'

interface ClientProviderProps{
    children: React.ReactNode  
}

const ClientProvider = ({children}:ClientProviderProps  ) => {
  return (
    <ClerkProvider>{children}</ClerkProvider>
  )
}

export default ClientProvider