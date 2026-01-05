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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GoogleLocationSearch } from "@/components/pins/google-location-search"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Clock, Phone, Globe, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TimePicker } from "@/components/ui/time-picker"
import { IconPicker } from "@/components/ui/icon-picker"

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
}

interface PinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: {
    name: string
    description?: string
    categoryId?: string
    latitude: number
    longitude: number
    day?: number
    time?: string
    placeId?: string
    placeData?: any
    icon?: string | null
  }) => void
  categories: Category[]
  initialLocation: { lat: number; lng: number } | null
  initialName?: string
  tripStartDate?: string | null
  tripEndDate?: string | null
}

export function PinDialog({
  open,
  onOpenChange,
  onSave,
  categories,
  initialLocation,
  initialName,
  tripStartDate,
  tripEndDate,
}: PinDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [day, setDay] = useState<string>("none")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [placeId, setPlaceId] = useState<string | undefined>(undefined)
  const [placeData, setPlaceData] = useState<any | undefined>(undefined)
  const [icon, setIcon] = useState<string | null>(null)
  
  // Calculate available days based on trip dates
  const availableDays = (() => {
    if (!tripStartDate || !tripEndDate) return []
    const start = new Date(tripStartDate)
    const end = new Date(tripEndDate)
    const days: { value: number; label: string }[] = []
    let currentDate = new Date(start)
    let dayNum = 1
    
    while (currentDate <= end) {
      const dateStr = currentDate.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short' 
      })
      days.push({ value: dayNum, label: `Day ${dayNum} - ${dateStr}` })
      currentDate.setDate(currentDate.getDate() + 1)
      dayNum++
    }
    return days
  })()

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation)
    }
  }, [initialLocation])

  const handleLocationSelect = (selectedLocation: {
    name: string
    lat: number
    lng: number
    placeId?: string
    placeDetails?: any
  }) => {
    setLocation({ lat: selectedLocation.lat, lng: selectedLocation.lng })
    setPlaceId(selectedLocation.placeId)
    setPlaceData(selectedLocation.placeDetails)
    if (!name) {
      setName(selectedLocation.name)
    }
    // Debug: Log place data
    if (selectedLocation.placeDetails) {
      console.log("Place data received:", selectedLocation.placeDetails)
    }
  }

  useEffect(() => {
    if (initialName) {
      setName(initialName)
    }
  }, [initialName])

  useEffect(() => {
    if (!open) {
      setName("")
      setDescription("")
      setCategoryId("")
      setDay("none")
      setTime("")
      setLocation(null)
      setPlaceId(undefined)
      setPlaceData(undefined)
      setIcon(null)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location) return

    onSave({
      name,
      description: description || undefined,
      categoryId: categoryId && categoryId !== "none" ? categoryId : undefined,
      latitude: location.lat,
      longitude: location.lng,
      day: day && day !== "none" ? parseInt(day) : undefined,
      time: time || undefined,
      placeId: placeId,
      placeData: placeData,
      icon: icon,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Pin</DialogTitle>
          <DialogDescription>
            Add a location to your trip map
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Location name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this location..."
                rows={3}
              />
            </div>
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId || undefined} onValueChange={(value) => setCategoryId(value === "none" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <IconPicker
              value={icon}
              onChange={setIcon}
              label="Icon (optional)"
            />
            {availableDays.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day</Label>
                  <Select 
                    value={day} 
                    onValueChange={(value) => {
                      setDay(value)
                      if (value === "none") setTime("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {availableDays.map((d) => (
                        <SelectItem key={d.value} value={d.value.toString()}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <TimePicker
                    value={time}
                    onChange={setTime}
                    disabled={!day || day === "none"}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <GoogleLocationSearch
                onLocationSelect={handleLocationSelect}
              />
              {location && (
                <div className="text-xs text-muted-foreground">
                  Selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              )}
            </div>

            {/* Place Data Preview */}
            {placeData && (
              <>
                <Separator className="my-4" />
                <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
                  <h4 className="text-sm font-semibold">Location Details</h4>
                  
                  {placeData.rating && (
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

                  {placeData.formatted_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{placeData.formatted_address}</p>
                    </div>
                  )}

                  {placeData.opening_hours && (
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

                  {(placeData.formatted_phone_number || placeData.international_phone_number || placeData.phone_number) && (
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

                  {placeData.website && (
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

                  {placeData.price_level !== undefined && (
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

                  {placeData.types && placeData.types.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {placeData.types.slice(0, 3).map((type: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {placeData.reviews && placeData.reviews.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium">Top Review</h5>
                      <div className="text-xs space-y-1 border-l-2 border-border pl-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{placeData.reviews[0].rating}</span>
                          <span className="text-muted-foreground">· {placeData.reviews[0].author_name}</span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{placeData.reviews[0].text}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <DialogFooter className="mt-4 shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!location || !name}>
              Add Pin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
