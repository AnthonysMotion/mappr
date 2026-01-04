/**
 * Get the base URL for the application
 * Uses NEXT_PUBLIC_SITE_URL if available (for production), otherwise falls back to window.location.origin
 */
export function getBaseUrl(): string {
  // Client-side: always use window.location.origin (most reliable)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side: use environment variable or default
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  return 'http://localhost:3000'
}

/**
 * Get the OAuth callback URL
 */
export function getCallbackUrl(): string {
  return `${getBaseUrl()}/auth/callback`
}

