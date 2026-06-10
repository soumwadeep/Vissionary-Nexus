import { useSession, signIn, signOut } from 'next-auth/react'
import { useCallback } from 'react'

export function useAuth() {
  const { data: session, status, update } = useSession()

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      return result
    },
    []
  )

  const loginWithGoogle = useCallback(async () => {
    await signIn('google', {
      redirect: true,
      callbackUrl: `${window.location.origin}/dashboard`,
    })
  }, [])

  const loginWithGithub = useCallback(async () => {
    await signIn('github', {
      redirect: true,
      callbackUrl: `${window.location.origin}/dashboard`,
    })
  }, [])

  const logout = useCallback(async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }, [])

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    updateSession: update,
  }
}

export { useSession } from 'next-auth/react'
