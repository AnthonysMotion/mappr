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

  // Fetch place data if pin has place_id but no place_data
  useEffect(() => {
    if (pin && pin.place_id && !pin.place_data && open) {
      setIsLoadingPlaceData(true)
      fetch(`/api/places/details?placeId=${encodeURIComponent(pin.place_id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setPlaceData(data)
          }
        })
        .catch((error) => {
          console.error("Error fetching place details:", error)
        })
        .finally(() => {
          setIsLoadingPlaceData(false)
        })
    } else if (pin?.place_data) {
      setPlaceData(pin.place_data)
    } else {
      setPlaceData(null)
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pin.name}</DialogTitle>
            <DialogDescription>
              Pin details and location information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                <Separator />
                <div className="space-y-3">
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
                              {placeData.opening_hours.weekday_text.slice(0, 3).map((day: string, idx: number) => (
                                <p key={idx} className="text-xs text-muted-foreground">{day}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {placeData?.phone_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${placeData.phone_number}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {placeData.phone_number}
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
                          <h4 className="text-sm font-medium">Recent Reviews</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {placeData.reviews.slice(0, 2).map((review: any, idx: number) => (
                              <div key={idx} className="text-xs space-y-1 border-l-2 border-border pl-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{review.rating}</span>
                                  <span className="text-muted-foreground">· {review.author_name}</span>
                                </div>
                                <p className="text-muted-foreground line-clamp-2">{review.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            {!placeData && !isLoadingPlaceData && (
              <div className="text-sm text-muted-foreground">
                <p>Latitude: {Number(pin.latitude).toFixed(6)}</p>
                <p>Longitude: {Number(pin.longitude).toFixed(6)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
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

