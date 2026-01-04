"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Chrome } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      window.location.href = "/trips"
    }

    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setError("Check your email to confirm your account!")
    }

    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
    // Note: If successful, user will be redirected to Google, so we don't set loading to false here
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-muted-foreground">
          {isSignUp
            ? "Start planning your trips with Mappr"
            : "Sign in to continue to Mappr"}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/15 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
              className="h-10"
            />
          </div>
          <Button type="submit" className="w-full h-10" disabled={isLoading}>
            {isLoading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-10"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span className="font-medium text-foreground">Sign in</span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span className="font-medium text-foreground">Sign up</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>
          By continuing, you agree to our{" "}
          <Link href="/terms" className="hover:text-foreground transition-colors underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:text-foreground transition-colors underline underline-offset-4">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
