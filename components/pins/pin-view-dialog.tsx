"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Star, MapPin, Clock, Phone, Globe, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
}

interface Pin {
  id: string
  name: string
  description: string | null
  latitude: number
  longitude: number
  category_id: string | null
  place_id: string | null
  place_data: any | null
  categories: Category | null
}

interface PinViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pin: Pin | null
  onDelete: (pinId: string) => void
  canEdit: boolean
}

export function PinViewDialog({
  open,
  onOpenChange,
  pin,
  onDelete,
  canEdit,
}: PinViewDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [placeData, setPlaceData] = useState<any | null>(pin?.place_data || null)
  const [isLoadingPlaceData, setIsLoadingPlaceData] = useState(false)

  // Fetch place data if pin has place_id but no place_data, or try to find nearby places
  useEffect(() => {
    if (!pin || !open) {
      setPlaceData(null)
      return
    }

    // If pin has place_data, use it
    if (pin.place_data) {
      setPlaceData(pin.place_data)
      return
    }

    // If pin has place_id but no place_data, fetch it
    if (pin.place_id && !pin.place_data) {
      setIsLoadingPlaceData(true)
      fetch(`/api/places/details?placeId=${encodeURIComponent(pin.place_id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error && !data.status) {
            // Successfully got place details
            setPlaceData(data)
          } else if (data && data.status === "INVALID_REQUEST") {
            // Place ID might be from geocoding, not Places API
            // Try to get address via reverse geocoding instead
            if (pin.latitude && pin.longitude) {
              fetch(`/api/places/nearby?lat=${pin.latitude}&lng=${pin.longitude}`)
                .then((res) => res.json())
                .then((geocodeData) => {
                  if (geocodeData && !geocodeData.error && geocodeData.length > 0) {
                    setPlaceData({
                      formatted_address: geocodeData[0].formatted_address,
                      geometry: geocodeData[0].geometry,
                      types: geocodeData[0].types,
                    })
                  }
                })
                .catch((error) => {
                  console.error("Error fetching geocoding data:", error)
                })
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching place details:", error)
        })
        .finally(() => {
          setIsLoadingPlaceData(false)
        })
      return
    }

    // If no place_id, try to find nearby place using coordinates
    if (!pin.place_id && pin.latitude && pin.longitude) {
      setIsLoadingPlaceData(true)
      // Use reverse geocoding to get address information
      fetch(`/api/places/nearby?lat=${pin.latitude}&lng=${pin.longitude}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error && data.length > 0) {
            const geocodeResult = data[0]
            
            // Try to get place details, but if it fails (INVALID_REQUEST), use geocoding data
            if (geocodeResult.place_id) {
              return fetch(`/api/places/details?placeId=${encodeURIComponent(geocodeResult.place_id)}`)
                .then((res) => res.json())
                .then((details) => {
                  if (details && !details.error && !details.status) {
                    // Successfully got place details
                    setPlaceData(details)
                  } else if (details.status === "INVALID_REQUEST") {
                    // Place ID from geocoding doesn't work with Places Details API
                    // Use geocoding data instead (at least we have address)
                    setPlaceData({
                      formatted_address: geocodeResult.formatted_address,
                      geometry: geocodeResult.geometry,
                      types: geocodeResult.types,
                    })
                  }
                })
                .catch((error) => {
                  // Fallback to geocoding data
                  setPlaceData({
                    formatted_address: geocodeResult.formatted_address,
                    geometry: geocodeResult.geometry,
                    types: geocodeResult.types,
                  })
                })
            } else {
              // No place_id, just use geocoding data
              setPlaceData({
                formatted_address: geocodeResult.formatted_address,
                geometry: geocodeResult.geometry,
                types: geocodeResult.types,
              })
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching nearby place:", error)
        })
        .finally(() => {
          setIsLoadingPlaceData(false)
        })
    }
  }, [pin, open])

  const handleDelete = () => {
    if (pin) {
      onDelete(pin.id)
      setShowDeleteConfirm(false)
      onOpenChange(false)
    }
  }

  if (!pin) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{pin.name}</DialogTitle>
            <DialogDescription>
              Pin details and location information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            {pin.description && (
              <div>
                <p className="text-sm text-muted-foreground">{pin.description}</p>
              </div>
            )}
            {pin.categories && (
              <div>
                <Badge
                  style={{
                    backgroundColor: pin.categories.color,
                    color: "white",
                  }}
                >
                  {pin.categories.name}
                </Badge>
              </div>
            )}

            {(placeData || isLoadingPlaceData) && (
              <>
                <Separator className="my-4" />
                <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
                  {isLoadingPlaceData ? (
                    <div className="text-sm text-muted-foreground">Loading place details...</div>
                  ) : (
                    <>
                      {placeData?.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{placeData.rating}</span>
                          {placeData.user_ratings_total && (
                            <span className="text-xs text-muted-foreground">
                              ({placeData.user_ratings_total.toLocaleString()} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {placeData?.formatted_address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground">{placeData.formatted_address}</p>
                        </div>
                      )}

                      {placeData?.opening_hours && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {placeData.opening_hours.open_now ? (
                                <span className="text-green-600">Open now</span>
                              ) : (
                                <span className="text-red-600">Closed now</span>
                              )}
                            </span>
                          </div>
                          {placeData.opening_hours.weekday_text && (
                            <div className="pl-6 space-y-0.5">
                              {placeData.opening_hours.weekday_text.map((day: string, idx: number) => (
                                <p key={idx} className="text-xs text-muted-foreground">{day}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {placeData?.price_level !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Price:</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4].map((level) => (
                              <span
                                key={level}
                                className={`text-sm ${
                                  level <= placeData.price_level
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                $
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {placeData?.types && placeData.types.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {placeData.types.slice(0, 5).map((type: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {(placeData?.formatted_phone_number || placeData?.international_phone_number || placeData?.phone_number) && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${placeData.formatted_phone_number || placeData.international_phone_number || placeData.phone_number}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {placeData.formatted_phone_number || placeData.international_phone_number || placeData.phone_number}
                          </a>
                        </div>
                      )}

                      {placeData?.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={placeData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {placeData?.reviews && placeData.reviews.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Reviews ({placeData.reviews.length})</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {placeData.reviews.slice(0, 5).map((review: any, idx: number) => (
                              <div key={idx} className="text-xs space-y-1 border-l-2 border-border pl-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{review.rating}</span>
                                  <span className="text-muted-foreground">· {review.author_name}</span>
                                  {review.time && (
                                    <span className="text-muted-foreground">
                                      · {new Date(review.time * 1000).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted-foreground">{review.text}</p>
                              </div>
                            ))}
                            {placeData.reviews.length > 5 && (
                              <p className="text-xs text-muted-foreground text-center pt-2">
                                Showing 5 of {placeData.reviews.length} reviews
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            {!placeData && !isLoadingPlaceData && (
              <>
                <Separator className="my-4" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p>Latitude: {Number(pin.latitude).toFixed(6)}</p>
                      <p>Longitude: {Number(pin.longitude).toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="mt-4 shrink-0">
            {canEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Pin
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pin?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{pin.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

