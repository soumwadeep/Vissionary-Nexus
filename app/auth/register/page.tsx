'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Github, Chrome, ArrowRight, Loader2 } from 'lucide-react'
import { AnimatedNetworkBackground } from '@/components/animated-network-background'
import { useAuth } from '@/hooks/use-auth'

export default function RegisterPage() {
  const router = useRouter()
  const { loginWithGoogle, loginWithGithub, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Redirect if already authenticated (using useEffect to avoid render-time state updates)
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields')
        setIsLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        setIsLoading(false)
        return
      }

      if (!agreeToTerms) {
        setError('You must agree to the terms and conditions')
        setIsLoading(false)
        return
      }

      // Call registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Failed to register')
        setIsLoading(false)
        return
      }

      // Redirect to onboarding
      router.push('/onboarding/welcome')
    } catch (err) {
      setError('Failed to register. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError('Failed to sign up with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithGithub()
    } catch (err) {
      setError('Failed to sign up with GitHub')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedNetworkBackground />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[96px]" />

      <div className="container relative z-10 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <img src="/apple-icon.png" alt="Vissionary Nexus" className="w-20 h-20 rounded-2xl glow-border" />
          </Link>

          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Join the Innovation</h1>
              <p className="text-muted-foreground">Create your account and start building</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                className="h-12 border-border hover:border-primary/50 hover:bg-primary/5"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5 mr-2" />
                )}
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleGithubLogin}
                className="h-12 border-border hover:border-primary/50 hover:bg-primary/5"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Github className="w-5 h-5 mr-2" />
                )}
                GitHub
              </Button>
            </div>

            <div className="relative my-6">
              <Separator className="bg-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-xs text-muted-foreground">
                or register with email
              </span>
            </div>

            {/* Register Form */}
            <form onSubmit={handleEmailRegister} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  className="h-10 bg-secondary border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  className="h-10 bg-secondary border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  className="h-10 bg-secondary border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  className="h-10 bg-secondary border-border focus:border-primary"
                />
              </div>

              <div className="flex items-start gap-2 mt-4">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={isLoading}
                  className="mt-1 rounded"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    terms and conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    privacy policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-base glow-border mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
