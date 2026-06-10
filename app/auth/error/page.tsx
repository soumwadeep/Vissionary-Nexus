import Link from "next/link"
import { AlertCircle, ArrowLeft, Home, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

const errorMessages: Record<string, string> = {
  AccessDenied: "We could not complete sign in for this account.",
  Configuration: "Authentication is not configured correctly yet.",
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Try the method you used before.",
  OAuthCallback: "The OAuth provider returned an error during sign in.",
  OAuthSignin: "We could not start the OAuth sign-in flow.",
  SessionRequired: "Please sign in to continue.",
}

interface AuthErrorPageProps {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams
  const error = params?.error || "AccessDenied"
  const message =
    errorMessages[error] ||
    "Something went wrong while signing you in. Please try again or create a new account."

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <section className="w-full max-w-md glass-card p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Sign in failed</h1>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        <div className="grid gap-3">
          <Button asChild>
            <Link href="/auth/register">
              <UserPlus className="mr-2 h-4 w-4" />
              Create account
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Homepage
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
