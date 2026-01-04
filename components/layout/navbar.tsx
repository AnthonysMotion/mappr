"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, Menu, X } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-8">
      {/* Brand Name */}
      <Link href="/" className="text-xl font-light tracking-[0.2em] text-white uppercase hover:opacity-80 transition-opacity">
        MAPPR
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-10">
        <Link 
          href="/#features" 
          className={`text-sm font-light transition-colors ${
            pathname === "/" ? "text-white" : "text-white/70 hover:text-white"
          }`}
        >
          Features
        </Link>
        <Link 
          href="/#how-it-works" 
          className={`text-sm font-light transition-colors ${
            pathname === "/" ? "text-white/70 hover:text-white" : "text-white/70 hover:text-white"
          }`}
        >
          How It Works
        </Link>
        {user ? (
          <>
            <Link 
              href="/trips" 
              className={`text-sm font-light transition-colors ${
                isActive("/trips") ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              My Trips
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 text-white px-4 h-9">
                  <Avatar className="h-7 w-7 mr-2">
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {user.email?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-md border-white/10">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="text-white/70 hover:text-white hover:bg-white/10">
                  <Link href="/trips">My Trips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-white/70 hover:text-white hover:bg-white/10">
                  <Link href="/trips/new">Create Trip</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleSignOut} className="text-white/70 hover:text-white hover:bg-white/10">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/auth/login">
            <Button variant="outline" className="rounded-full bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 text-white px-6">
              Get Started
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 p-6 space-y-4 md:hidden">
          <Link href="/#features" className="block text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link href="/#how-it-works" className="block text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </Link>
          {user ? (
            <>
              <Link href="/trips" className="block text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                My Trips
              </Link>
              <Link href="/trips/new" className="block text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                Create Trip
              </Link>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 mb-2">{user.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/5 border-white/10 text-white"
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
              <Button className="w-full bg-white/10 border-white/20 text-white">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
