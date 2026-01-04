"use client"

import { useEffect, useRef } from "react"
import { useMap } from "@/components/ui/map"

interface MapFlyToProps {
  center: [number, number] | null
  zoom?: number
  onComplete?: () => void
}

export function MapFlyTo({ center, zoom, onComplete }: MapFlyToProps) {
  const { map, isLoaded } = useMap()
  const previousCenterRef = useRef<[number, number] | null>(null)

  useEffect(() => {
    if (!map || !isLoaded || !center) return
    
    // Only fly if the center has changed
    if (
      previousCenterRef.current &&
      previousCenterRef.current[0] === center[0] &&
      previousCenterRef.current[1] === center[1]
    ) {
      return
    }

    previousCenterRef.current = center

    map.flyTo({
      center: [center[0], center[1]],
      zoom: zoom || 14,
      duration: 1000,
    })

    // Call onComplete after animation duration
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [map, isLoaded, center, zoom, onComplete])

  return null
}

