'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider 
      refetchOnWindowFocus={true}
      refetchInterval={5 * 60} // 5 minutes
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}
