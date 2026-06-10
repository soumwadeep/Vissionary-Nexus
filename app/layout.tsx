import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import GoogleAnalytics from '@/components/web/GoogleAnalytics'
import { Web3Provider } from '@/components/web3/web3-provider'
import { AuthProvider } from '@/components/auth-provider'
import { Suspense } from 'react'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Vissionary Nexus | AI-Powered Innovation Ecosystem',
  description: 'An autonomous AI-powered innovation ecosystem for hackathons, startups, collaboration, and future technologies.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <AuthProvider>
          <Web3Provider>
            <Suspense fallback={null}>{children}</Suspense>
          </Web3Provider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
