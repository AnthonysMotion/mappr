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
  day: number | null
  time: string | null
  categories: Category | null
}

interface PinEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pin: Pin | null
  categories: Category[]
  onSave: (data: {
    id: string
    name: string
    description?: string
    categoryId?: string
    latitude: number
    longitude: number
    day?: number
    time?: string
    placeId?: string
    placeData?: any
  }) => void
  tripStartDate?: string | null
  tripEndDate?: string | null
}

export function PinEditDialog({
  open,
  onOpenChange,
  pin,
  categories,
  onSave,
  tripStartDate,
  tripEndDate,
}: PinEditDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [day, setDay] = useState<string>("none")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [placeId, setPlaceId] = useState<string | undefined>(undefined)
  const [placeData, setPlaceData] = useState<any | undefined>(undefined)

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
    if (pin) {
      setName(pin.name)
      setDescription(pin.description || "")
      setCategoryId(pin.category_id || "")
      setDay(pin.day?.toString() || "none")
      setTime(pin.time || "")
      setLocation({ lat: pin.latitude, lng: pin.longitude })
      setPlaceId(pin.place_id || undefined)
      setPlaceData(pin.place_data || undefined)
    }
  }, [pin, open])

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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin || !location) return

    onSave({
      id: pin.id,
      name,
      description: description || undefined,
      categoryId: categoryId && categoryId !== "none" ? categoryId : undefined,
      latitude: location.lat,
      longitude: location.lng,
      day: day && day !== "none" ? parseInt(day) : undefined,
      time: time || undefined,
      placeId: placeId,
      placeData: placeData,
    })
  }

  if (!pin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pin</DialogTitle>
          <DialogDescription>
            Update pin details and location
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Location name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this location..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              {categories.length > 0 ? (
                <Select value={categoryId || "none"} onValueChange={(value) => setCategoryId(value === "none" ? "" : value)}>
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
              ) : (
                <div className="text-sm text-muted-foreground py-2 px-3 border border-border rounded-none">
                  No categories available. Create one in the Categories tab.
                </div>
              )}
            </div>
            {availableDays.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-day">Day</Label>
                  <Select 
                    value={day || "none"} 
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
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={!day || day === "none"}
                    placeholder={day ? "Select time" : "Select day first"}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <GoogleLocationSearch
                onLocationSelect={handleLocationSelect}
              />
              {location && (
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!location || !name}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

