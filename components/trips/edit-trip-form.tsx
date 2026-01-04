"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "lucide-react"

const TRIP_LABELS = [
  { value: "none", label: "None" },
  { value: "business", label: "Business Trip" },
  { value: "vacation", label: "Vacation" },
  { value: "family", label: "Family Trip" },
  { value: "adventure", label: "Adventure" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "backpacking", label: "Backpacking" },
  { value: "road-trip", label: "Road Trip" },
  { value: "solo", label: "Solo Travel" },
  { value: "group", label: "Group Trip" },
]

interface Trip {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  label: string | null
}

interface EditTripFormProps {
  trip: Trip
}

export function EditTripForm({ trip }: EditTripFormProps) {
  const [name, setName] = useState(trip.name)
  const [description, setDescription] = useState(trip.description || "")
  const [startDate, setStartDate] = useState(trip.start_date ? trip.start_date.split('T')[0] : "")
  const [endDate, setEndDate] = useState(trip.end_date ? trip.end_date.split('T')[0] : "")
  const [label, setLabel] = useState(trip.label || "none")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setName(trip.name)
    setDescription(trip.description || "")
    setStartDate(trip.start_date ? trip.start_date.split('T')[0] : "")
    setEndDate(trip.end_date ? trip.end_date.split('T')[0] : "")
    setLabel(trip.label || "none")
  }, [trip])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in to edit a trip")
      setIsLoading(false)
      return
    }

    // Validate dates
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError("End date must be after start date")
      setIsLoading(false)
      return
    }

    const { error: tripError } = (await supabase
      .from("trips")
      .update({
        name,
        description: description || null,
        start_date: startDate || null,
        end_date: endDate || null,
        label: label === "none" ? null : label,
      } as any)
      .eq("id", trip.id)) as any

    if (tripError) {
      setError(tripError.message)
      setIsLoading(false)
      return
    }

    router.push(`/trips/${trip.id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Trip</CardTitle>
        <CardDescription>Update your trip details</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Trip Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Vacation 2024"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your trip..."
              rows={4}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                <Calendar className="inline h-4 w-4 mr-1.5" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                <Calendar className="inline h-4 w-4 mr-1.5" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Trip Label</Label>
            <Select value={label} onValueChange={setLabel} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a label (optional)" />
              </SelectTrigger>
              <SelectContent>
                {TRIP_LABELS.map((tripLabel) => (
                  <SelectItem key={tripLabel.value} value={tripLabel.value}>
                    {tripLabel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

