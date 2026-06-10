import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { db } from './db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcryptjs from 'bcryptjs'

function requiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: requiredEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requiredEnv('GOOGLE_CLIENT_SECRET'),
    }),
    GithubProvider({
      clientId: requiredEnv('GITHUB_ID'),
      clientSecret: requiredEnv('GITHUB_SECRET'),
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user by email
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1)

        // Check if user exists and has a password
        if (user.length === 0 || !user[0].password) {
          return null
        }

        // Verify password
        const passwordMatch = await bcryptjs.compare(
          credentials.password,
          user[0].password
        )

        if (!passwordMatch) {
          return null
        }

        // Return user data if password matches
        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name || '',
          image: user[0].avatar || '',
          role: user[0].role || 'member',
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      try {
        // Check if user exists, if not create them
        const existingUser = await db
          .select({
            id: users.id,
            role: users.role,
          })
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1)

        if (existingUser.length === 0) {
          // Create new user from OAuth provider
          await db.insert(users).values({
            email: user.email,
            name: user.name || '',
            avatar: user.image || '',
            emailVerified: true, // OAuth providers verify email
            role: 'member',
          })
        }

        return true
      } catch (error) {
        console.error('OAuth sign-in database sync failed:', error)
        return false
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      if (token.email) {
        try {
          const existingUser = await db
            .select({
              id: users.id,
              role: users.role,
              name: users.name,
              avatar: users.avatar,
            })
            .from(users)
            .where(eq(users.email, token.email))
            .limit(1)

          if (existingUser.length > 0) {
            token.id = existingUser[0].id
            token.role = existingUser[0].role || 'member'
            token.name = existingUser[0].name || token.name
            token.picture = existingUser[0].avatar || token.picture
          }
        } catch (error) {
          console.error('Failed to load user for session token:', error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}
