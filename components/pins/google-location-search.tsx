"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, Loader2, MapPin, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface GooglePlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface GooglePlaceDetails {
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  opening_hours?: {
    weekday_text: string[]
    open_now?: boolean
  }
  phone_number?: string
  website?: string
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types?: string[]
  price_level?: number
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }>
}

interface GoogleLocationSearchProps {
  onLocationSelect: (location: {
    name: string
    lat: number
    lng: number
    placeId?: string
    placeDetails?: GooglePlaceDetails
  }) => void
  disabled?: boolean
  className?: string
}

export function GoogleLocationSearch({
  onLocationSelect,
  disabled,
  className,
}: GoogleLocationSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GooglePlacePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search for locations using Google Places API
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`)

        if (response.ok) {
          const data = await response.json()
          setResults(data)
          setIsOpen(data.length > 0)
        } else {
          setResults([])
          setIsOpen(false)
        }
      } catch (error) {
        console.error("Error searching locations:", error)
        setResults([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleSelect = async (result: GooglePlacePrediction) => {
    try {
      // Fetch place details
      const detailsResponse = await fetch(`/api/places/details?placeId=${result.place_id}`)
      
      if (detailsResponse.ok) {
        const placeDetails: GooglePlaceDetails = await detailsResponse.json()
        
        onLocationSelect({
          name: placeDetails.name || result.structured_formatting.main_text,
          lat: placeDetails.geometry.location.lat,
          lng: placeDetails.geometry.location.lng,
          placeId: result.place_id,
          placeDetails,
        })
      } else {
        // Fallback if details fetch fails
        onLocationSelect({
          name: result.structured_formatting.main_text,
          lat: 0, // Will need to be fetched separately
          lng: 0,
          placeId: result.place_id,
        })
      }
    } catch (error) {
      console.error("Error fetching place details:", error)
      // Fallback
      onLocationSelect({
        name: result.structured_formatting.main_text,
        lat: 0,
        lng: 0,
        placeId: result.place_id,
      })
    }

    setQuery("")
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex])
        } else if (results.length > 0) {
          handleSelect(results[0])
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for an address or location..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          disabled={disabled}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-none max-h-60 overflow-auto">
          {results.map((result, index) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelect(result)}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-start gap-3",
                index === selectedIndex && "bg-accent"
              )}
            >
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{result.structured_formatting.main_text}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {result.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && !isLoading && query.trim() && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-none p-4 text-sm text-muted-foreground text-center">
          No locations found
        </div>
      )}
    </div>
  )
}

