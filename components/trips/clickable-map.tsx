"use client"

import { useEffect } from "react"
import { Map, useMap } from "@/components/ui/map"

interface ClickableMapProps {
  children: React.ReactNode
  onMapClick?: (e: { lngLat: { lng: number; lat: number } }) => void
  center: [number, number]
  zoom: number
}

function MapClickHandler({ onMapClick }: { onMapClick?: (e: { lngLat: { lng: number; lat: number } }) => void }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!map || !isLoaded || !onMapClick) return

    const handleClick = (e: any) => {
      onMapClick({
        lngLat: {
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
        },
      })
    }

    map.on("click", handleClick)

    return () => {
      map.off("click", handleClick)
    }
  }, [map, isLoaded, onMapClick])

  return null
}

export function ClickableMap({ children, onMapClick, center, zoom }: ClickableMapProps) {
  return (
    <Map center={center} zoom={zoom}>
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      {children}
    </Map>
  )
}
