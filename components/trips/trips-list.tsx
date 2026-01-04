"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Users } from "lucide-react"
import { format } from "date-fns"

interface Trip {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

interface TripsListProps {
  trips: Trip[]
}

export function TripsList({ trips }: TripsListProps) {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Link key={trip.id} href={`/trips/${trip.id}`}>
          <Card className="hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>{trip.name}</CardTitle>
              {trip.description && (
                <CardDescription className="line-clamp-2">
                  {trip.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(trip.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
