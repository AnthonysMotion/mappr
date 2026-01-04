"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowLeft, Share2, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
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
    start_date?: string | null
    end_date?: string | null
    label?: string | null
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md">
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-lg font-semibold">{trip.name}</h1>
                      {trip.label && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {trip.label === "business" && "Business Trip"}
                          {trip.label === "vacation" && "Vacation"}
                          {trip.label === "family" && "Family Trip"}
                          {trip.label === "adventure" && "Adventure"}
                          {trip.label === "honeymoon" && "Honeymoon"}
                          {trip.label === "backpacking" && "Backpacking"}
                          {trip.label === "road-trip" && "Road Trip"}
                          {trip.label === "solo" && "Solo Travel"}
                          {trip.label === "group" && "Group Trip"}
                          {!["business", "vacation", "family", "adventure", "honeymoon", "backpacking", "road-trip", "solo", "group"].includes(trip.label) && trip.label}
                        </Badge>
                      )}
                    </div>
                    {trip.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{trip.description}</p>
                    )}
                    {(trip.start_date || trip.end_date) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {trip.start_date && format(parseISO(trip.start_date), "MMM d, yyyy")}
                          {trip.start_date && trip.end_date && " to "}
                          {trip.end_date && format(parseISO(trip.end_date), "MMM d, yyyy")}
                          {trip.start_date && !trip.end_date && " onwards"}
                          {!trip.start_date && trip.end_date && `Until ${format(parseISO(trip.end_date), "MMM d, yyyy")}`}
                        </span>
                      </div>
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
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h2 className="text-lg font-semibold flex-1">{trip.name}</h2>
                    {trip.label && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {trip.label === "business" && "Business Trip"}
                        {trip.label === "vacation" && "Vacation"}
                        {trip.label === "family" && "Family Trip"}
                        {trip.label === "adventure" && "Adventure"}
                        {trip.label === "honeymoon" && "Honeymoon"}
                        {trip.label === "backpacking" && "Backpacking"}
                        {trip.label === "road-trip" && "Road Trip"}
                        {trip.label === "solo" && "Solo Travel"}
                        {trip.label === "group" && "Group Trip"}
                        {!["business", "vacation", "family", "adventure", "honeymoon", "backpacking", "road-trip", "solo", "group"].includes(trip.label) && trip.label}
                      </Badge>
                    )}
                  </div>
                  {trip.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{trip.description}</p>
                  )}
                  {(trip.start_date || trip.end_date) && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {trip.start_date && format(parseISO(trip.start_date), "MMM d, yyyy")}
                        {trip.start_date && trip.end_date && " to "}
                        {trip.end_date && format(parseISO(trip.end_date), "MMM d, yyyy")}
                        {trip.start_date && !trip.end_date && " onwards"}
                        {!trip.start_date && trip.end_date && `Until ${format(parseISO(trip.end_date), "MMM d, yyyy")}`}
                      </span>
                    </div>
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
