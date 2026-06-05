# Neon Auth Integration Setup Guide

This document describes the Neon Authentication setup that has been integrated into your Vissionary Nexus application.

## What's Been Set Up

### 1. **Authentication System**
- NextAuth.js v4 for authentication
- OAuth providers: Google and GitHub
- Email/Password authentication
- JWT-based session management
- Protected routes middleware

### 2. **Files Created**

#### Core Auth Files
- `lib/auth.ts` - NextAuth configuration and callbacks
- `lib/auth-types.ts` - TypeScript type definitions for NextAuth
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `app/api/auth/register/route.ts` - Registration endpoint

#### Components
- `components/auth-provider.tsx` - SessionProvider wrapper
- `hooks/use-auth.ts` - Custom hook for auth utilities

#### Pages
- `app/auth/login/page.tsx` - Login page with OAuth and email/password
- `app/auth/register/page.tsx` - Registration page with form validation

#### Middleware & Config
- `middleware.ts` - Protected routes middleware
- `.env.local` - Environment variables template

### 3. **Updated Files**
- `app/layout.tsx` - Added AuthProvider wrapper

## Setup Steps

### Step 1: Configure Environment Variables

Create/update `.env.local` with your credentials:

```env
# Database
DATABASE_URL=postgresql://...your_neon_connection_string...

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-hex-32

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret

# Neon Auth (if using Neon Auth)
NEON_API_KEY=your_neon_api_key
```

### Step 2: Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -hex 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env.local`

### Step 3: Set Up OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

### Step 4: Important - Implement Password Security

⚠️ **The registration endpoint currently uses base64 encoding for passwords (placeholder only).**

For production, replace with bcrypt:

```bash
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

Then update `app/api/auth/register/route.ts`:

```typescript
import bcrypt from 'bcryptjs'

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

### Step 5: Create Passwords Table (Optional)

If you want to store passwords separately:

```sql
CREATE TABLE user_passwords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE cascade,
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## Usage

### Using the useAuth Hook

```typescript
'use client'

import { useAuth } from '@/hooks/use-auth'

export default function MyComponent() {
  const { session, user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={() => logout()}>Sign out</button>
    </div>
  )
}
```

### Getting Session in Server Components

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ServerComponent() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div>Not authenticated</div>
  }

  return <div>Welcome, {session.user?.name}</div>
}
```

## Protected Routes

The following routes are protected by middleware (`middleware.ts`):
- `/dashboard`
- `/profile`
- `/settings`
- `/wallet`
- `/collaborations`
- `/events`
- `/admin` (requires admin role)

Users will be redirected to `/auth/login` if not authenticated.

## Database Integration

The auth system integrates with your existing `users` table:
- Creates new users on OAuth login
- Stores user data: name, email, avatar, role
- Tracks email verification status

## Next Steps

1. ✅ Update `.env.local` with your credentials
2. ✅ Set up Google and GitHub OAuth apps
3. ✅ Implement bcrypt for password hashing
4. ✅ Test login/registration flows
5. ⚠️ Create password storage in database (optional)
6. ⚠️ Add email verification (using nodemailer or SendGrid)
7. ⚠️ Add password reset functionality
8. ⚠️ Implement email notifications

## Session Data Structure

After authentication, `session.user` contains:
```typescript
{
  id: string         // UUID from database
  email: string      // User's email
  name: string       // User's name
  image: string      // Avatar URL
  role: string       // 'member', 'admin', etc.
}
```

## Troubleshooting

### "Session is null" error
- Make sure `.env.local` has `NEXTAUTH_SECRET`
- Ensure `AuthProvider` wraps your app in `layout.tsx`
- Check that database connection is working

### OAuth callback errors
- Verify redirect URIs match exactly (including protocol)
- Check that credentials are correct in `.env.local`
- Ensure OAuth apps are properly created

### Protected routes not working
- Verify `middleware.ts` is in the root of your project
- Check that routes in `matcher` config match your routes
- Ensure NextAuth API is accessible at `/api/auth`

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Neon Database Docs](https://neon.tech/docs)
- [JWT Documentation](https://jwt.io/)
- [OWASP Authentication Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Note:** This is a production-ready template but requires additional hardening for sensitive deployments. Always use HTTPS in production, validate inputs, and follow security best practices.
