"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MoreVertical, Edit, Trash2, Search, X } from "lucide-react"
import { format, parseISO } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Trip {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  label: string | null
  created_at: string
  updated_at: string
}

interface TripsListProps {
  trips: Trip[]
}

export function TripsList({ trips: initialTrips }: TripsListProps) {
  const [trips, setTrips] = useState(initialTrips)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // Filter trips based on search query
  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) {
      return trips
    }

    const query = searchQuery.toLowerCase()
    return trips.filter((trip) => {
      const nameMatch = trip.name.toLowerCase().includes(query)
      const descriptionMatch = trip.description?.toLowerCase().includes(query) || false
      const labelMatch = trip.label?.toLowerCase().includes(query) || false
      
      // Also search in formatted dates
      let dateMatch = false
      if (trip.start_date) {
        const startDateStr = format(parseISO(trip.start_date), "MMMM d, yyyy").toLowerCase()
        dateMatch = startDateStr.includes(query)
      }
      if (trip.end_date) {
        const endDateStr = format(parseISO(trip.end_date), "MMMM d, yyyy").toLowerCase()
        dateMatch = dateMatch || endDateStr.includes(query)
      }

      return nameMatch || descriptionMatch || labelMatch || dateMatch
    })
  }, [trips, searchQuery])

  const handleDelete = async () => {
    if (!tripToDelete) return

    const { error } = await supabase.from("trips").delete().eq("id", tripToDelete.id)

    if (!error) {
      setTrips(trips.filter((t) => t.id !== tripToDelete.id))
      setDeleteDialogOpen(false)
      setTripToDelete(null)
    }
  }

  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground mb-4">No trips yet</p>
          <Link href="/trips/new">
            <button className="text-primary hover:underline">Create your first trip</button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search trips by name, description, label, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            {filteredTrips.length} {filteredTrips.length === 1 ? "trip" : "trips"} found
          </p>
        )}
      </div>

      {/* Results */}
      {filteredTrips.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">No trips found matching "{searchQuery}"</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:bg-accent/5 transition-colors h-full relative">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <Link href={`/trips/${trip.id}`} className="flex-1">
                  <CardTitle>{trip.name}</CardTitle>
                  {trip.description && (
                    <CardDescription className="line-clamp-2 mt-1">
                      {trip.description}
                    </CardDescription>
                  )}
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  {trip.label && (
                    <Badge variant="outline" className="shrink-0">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/trips/${trip.id}/edit`)
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Trip
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setTripToDelete(trip)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Trip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/trips/${trip.id}`}>
                <div className="space-y-2">
                  {(trip.start_date || trip.end_date) && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {trip.start_date && format(parseISO(trip.start_date), "MMM d, yyyy")}
                        {trip.start_date && trip.end_date && " to "}
                        {trip.end_date && format(parseISO(trip.end_date), "MMM d, yyyy")}
                        {trip.start_date && !trip.end_date && " onwards"}
                        {!trip.start_date && trip.end_date && `Until ${format(parseISO(trip.end_date), "MMM d, yyyy")}`}
                      </span>
                    </div>
                  )}
                  {!trip.start_date && !trip.end_date && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {format(new Date(trip.created_at), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </Link>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tripToDelete?.name}"? This action cannot be undone and will delete all pins, categories, and lists associated with this trip.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTripToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
