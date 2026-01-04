"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowLeft, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShareTripDialog } from "@/components/trips/share-trip-dialog"

interface NavbarProps {
  trip?: {
    id: string
    name: string
    description?: string | null
  }
  userRole?: "owner" | "editor" | "viewer"
}

export function Navbar({ trip, userRole }: NavbarProps = {}) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const supabase = createClient()
  
  const isTripDetailPage = pathname?.startsWith("/trips/") && pathname !== "/trips" && pathname !== "/trips/new"

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path)

  const handleShareClick = () => {
    if (trip) {
      setIsShareDialogOpen(true)
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-[hsl(var(--card))]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {isTripDetailPage && trip ? (
                <>
                  <Link href="/trips">
                    <Button variant="ghost" size="icon">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-lg font-semibold">{trip.name}</h1>
                    {trip.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{trip.description}</p>
                    )}
                  </div>
                </>
              ) : (
                <Link href="/" className="text-lg font-semibold hover:opacity-80">
                  Mappr
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {isTripDetailPage && trip && (
                <Button
                  variant="outline"
                  onClick={handleShareClick}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              <div className="flex items-center gap-6">
                {user ? (
                  <>
                    <Link
                      href="/trips"
                      className={`text-sm transition-colors ${
                        isActive("/trips") ? "font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      My Trips
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage 
                              src={user.user_metadata?.avatar_url as string} 
                              alt={user.user_metadata?.display_name as string || user.email?.split("@")[0] || "User"}
                            />
                            <AvatarFallback>
                              {(user.user_metadata?.display_name as string)?.charAt(0).toUpperCase() || 
                               user.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {(user.user_metadata?.display_name as string) || user.email?.split("@")[0]}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.email}</p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/trips">My Trips</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/trips/new">Create Trip</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">Profile Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="outline">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t md:hidden">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {isTripDetailPage && trip && (
                <div className="pb-4 border-b">
                  <h2 className="text-lg font-semibold mb-1">{trip.name}</h2>
                  {trip.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleShareClick()
                      setMobileMenuOpen(false)
                    }}
                    className="mt-3 w-full"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              )}
              {!isTripDetailPage && (
                <>
                  <Link href="/#features" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                    Features
                  </Link>
                  <Link href="/#how-it-works" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                    How It Works
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <Link href="/trips" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                    My Trips
                  </Link>
                  <Link href="/trips/new" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                    Create Trip
                  </Link>
                  <Link href="/profile" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                    Profile Settings
                  </Link>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {trip && userRole && (
        <ShareTripDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          tripId={trip.id}
          userRole={userRole}
        />
      )}
    </>
  )
}
