"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map"
import { ClickableMap } from "@/components/trips/clickable-map"
import { MapFlyTo } from "@/components/trips/map-fly-to"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PinDialog } from "@/components/pins/pin-dialog"
import { LocationSearch } from "@/components/pins/location-search"
import { CategoryManager } from "@/components/categories/category-manager"
import { TripLists } from "@/components/lists/trip-lists"
import { ShareTripDialog } from "@/components/trips/share-trip-dialog"
import { ArrowLeft, Share2, Settings } from "lucide-react"
import Link from "next/link"

interface Trip {
  id: string
  name: string
  description: string | null
  created_at: string
}

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
  created_by: string
  categories: Category | null
}

interface ListItem {
  id: string
  list_type: "stores" | "things_to_do" | "things_to_see"
  name: string
  description: string | null
  pin_id: string | null
  completed: boolean
  pins: { id: string; name: string } | null
}

interface TripViewProps {
  trip: Trip
  pins: Pin[]
  categories: Category[]
  listItems: ListItem[]
  userRole: "owner" | "editor" | "viewer"
  currentUserId: string
}

export function TripView({
  trip,
  pins: initialPins,
  categories: initialCategories,
  listItems: initialListItems,
  userRole,
  currentUserId,
}: TripViewProps) {
  const [pins, setPins] = useState<Pin[]>(initialPins)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [listItems, setListItems] = useState<ListItem[]>(initialListItems)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false)
  const [mapClickLocation, setMapClickLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [pinDialogInitialName, setPinDialogInitialName] = useState<string | undefined>(undefined)
  const [flyToLocation, setFlyToLocation] = useState<[number, number] | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const supabase = createClient()

  const canEdit = userRole === "owner" || userRole === "editor"

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel(`trip-${trip.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pins",
          filter: `trip_id=eq.${trip.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("pins")
            .select(`
              *,
              categories(*)
            `)
            .eq("trip_id", trip.id)
            .order("created_at", { ascending: false })
          if (data) setPins(data as Pin[])
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
          filter: `trip_id=eq.${trip.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("categories")
            .select("*")
            .eq("trip_id", trip.id)
            .order("created_at", { ascending: true })
          if (data) setCategories(data as Category[])
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "list_items",
          filter: `trip_id=eq.${trip.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("list_items")
            .select(`
              *,
              pins(id, name)
            `)
            .eq("trip_id", trip.id)
            .order("created_at", { ascending: false })
          if (data) setListItems(data as ListItem[])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [trip.id, supabase])

  const handleMapClick = (e: { lngLat: { lng: number; lat: number } }) => {
    if (!canEdit) return
    setMapClickLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    setPinDialogInitialName(undefined)
    setIsPinDialogOpen(true)
  }

  const handlePinSave = async (pinData: {
    name: string
    description?: string
    categoryId?: string
    latitude: number
    longitude: number
  }) => {
    const { data, error } = (await supabase
      .from("pins")
      .insert({
        trip_id: trip.id,
        name: pinData.name,
        description: pinData.description || null,
        latitude: pinData.latitude,
        longitude: pinData.longitude,
        category_id: pinData.categoryId || null,
        created_by: currentUserId,
      } as any)
      .select(`
        *,
        categories(*)
      `)
      .single()) as any

    if (!error && data) {
      setPins([data as Pin, ...pins])
      setIsPinDialogOpen(false)
      setMapClickLocation(null)
      setPinDialogInitialName(undefined)
    }
  }

  const handleLocationSearch = (location: { name: string; lat: number; lng: number }) => {
    if (!canEdit) return
    // Fly to the location on the map
    setFlyToLocation([location.lng, location.lat])
    // Set the location and open the pin dialog with the location name pre-filled
    setMapClickLocation({ lat: location.lat, lng: location.lng })
    setPinDialogInitialName(location.name)
    setIsPinDialogOpen(true)
  }

  const handlePinDelete = async (pinId: string) => {
    const { error } = await supabase.from("pins").delete().eq("id", pinId)
    if (!error) {
      setPins(pins.filter((p) => p.id !== pinId))
    }
  }

  // Calculate map center from pins
  const mapCenter: [number, number] =
    pins.length > 0
      ? [
          pins.reduce((sum, p) => sum + Number(p.longitude), 0) / pins.length,
          pins.reduce((sum, p) => sum + Number(p.latitude), 0) / pins.length,
        ]
      : [0, 0]

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/trips">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{trip.name}</h1>
              {trip.description && (
                <p className="text-sm text-muted-foreground">{trip.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <ClickableMap
            center={[mapCenter[0] || 0, mapCenter[1] || 0]}
            zoom={pins.length > 0 ? 10 : 2}
            onMapClick={canEdit ? handleMapClick : undefined}
          >
            <MapFlyTo
              center={flyToLocation}
              zoom={14}
              onComplete={() => setFlyToLocation(null)}
            />
            <MapControls showZoom showLocate />
            {pins.map((pin) => {
              const category = pin.categories
              return (
                <MapMarker
                  key={pin.id}
                  longitude={Number(pin.longitude)}
                  latitude={Number(pin.latitude)}
                >
                  <MarkerContent>
                    <div
                      className="h-4 w-4 rounded-full border-2 border-white shadow-lg cursor-pointer"
                      style={{
                        backgroundColor: category?.color || "#3b82f6",
                      }}
                    />
                  </MarkerContent>
                  <MarkerPopup>
                    <div className="space-y-2 min-w-[200px]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{pin.name}</h3>
                          {pin.description && (
                            <p className="text-sm text-muted-foreground mt-1">{pin.description}</p>
                          )}
                          {category && (
                            <Badge
                              className="mt-2"
                              style={{
                                backgroundColor: category.color,
                                color: "white",
                              }}
                            >
                              {category.name}
                            </Badge>
                          )}
                        </div>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePinDelete(pin.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              )
            })}
          </ClickableMap>
          {canEdit && (
            <div className="absolute top-4 left-4 z-10 w-96 max-w-[calc(100%-2rem)]">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm mb-3">Search for a location</CardTitle>
                  <LocationSearch
                    onLocationSelect={handleLocationSearch}
                    disabled={!canEdit}
                  />
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    Or click on the map to add a pin
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-96 border-l bg-background overflow-y-auto">
          <Tabs defaultValue="pins" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="pins" className="flex-1">
                Pins ({pins.length})
              </TabsTrigger>
              <TabsTrigger value="lists" className="flex-1">
                Lists
              </TabsTrigger>
              {canEdit && (
                <TabsTrigger value="categories" className="flex-1">
                  Categories
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="pins" className="flex-1 overflow-y-auto p-4 space-y-2">
              {pins.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No pins yet. {canEdit && "Click on the map to add one!"}
                  </CardContent>
                </Card>
              ) : (
                pins.map((pin) => {
                  const category = pin.categories
                  return (
                    <Card
                      key={pin.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedPin(pin)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{pin.name}</CardTitle>
                          {category && (
                            <Badge
                              style={{
                                backgroundColor: category.color,
                                color: "white",
                              }}
                            >
                              {category.name}
                            </Badge>
                          )}
                        </div>
                        {pin.description && (
                          <CardDescription className="line-clamp-2">
                            {pin.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  )
                })
              )}
            </TabsContent>
            <TabsContent value="lists" className="flex-1 overflow-y-auto p-4">
              <TripLists
                tripId={trip.id}
                listItems={listItems}
                pins={pins}
                canEdit={canEdit}
                currentUserId={currentUserId}
              />
            </TabsContent>
            {canEdit && (
              <TabsContent value="categories" className="flex-1 overflow-y-auto p-4">
                <CategoryManager
                  tripId={trip.id}
                  categories={categories}
                  currentUserId={currentUserId}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <PinDialog
        open={isPinDialogOpen}
        onOpenChange={(open) => {
          setIsPinDialogOpen(open)
          if (!open) {
            setMapClickLocation(null)
            setPinDialogInitialName(undefined)
          }
        }}
        onSave={handlePinSave}
        categories={categories}
        initialLocation={mapClickLocation}
        initialName={pinDialogInitialName}
      />
      <ShareTripDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        tripId={trip.id}
        userRole={userRole}
      />
    </div>
  )
}
