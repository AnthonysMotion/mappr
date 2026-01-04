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
import { PinViewDialog } from "@/components/pins/pin-view-dialog"
import { LocationSearch } from "@/components/pins/location-search"
import { CategoryManager } from "@/components/categories/category-manager"
import { Calendar } from "lucide-react"

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

interface TripViewProps {
  trip: Trip
  pins: Pin[]
  categories: Category[]
  userRole: "owner" | "editor" | "viewer"
  currentUserId: string
}

export function TripView({
  trip,
  pins: initialPins,
  categories: initialCategories,
  userRole,
  currentUserId,
}: TripViewProps) {
  const [pins, setPins] = useState<Pin[]>(initialPins)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false)
  const [isPinViewDialogOpen, setIsPinViewDialogOpen] = useState(false)
  const [viewingPin, setViewingPin] = useState<Pin | null>(null)
  const [mapClickLocation, setMapClickLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [pinDialogInitialName, setPinDialogInitialName] = useState<string | undefined>(undefined)
  const [flyToLocation, setFlyToLocation] = useState<[number, number] | null>(null)
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
    setFlyToLocation([location.lng, location.lat])
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
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
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
              const isSelected = selectedPin?.id === pin.id
              return (
                <MapMarker
                  key={pin.id}
                  longitude={Number(pin.longitude)}
                  latitude={Number(pin.latitude)}
                >
                  <MarkerContent>
                    <div
                      className={`h-4 w-4 rounded-full border-2 border-background cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-primary" : ""
                      }`}
                      style={{
                        backgroundColor: category?.color || "#3b82f6",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setViewingPin(pin)
                        setIsPinViewDialogOpen(true)
                      }}
                    />
                  </MarkerContent>
                  <MarkerPopup>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{pin.name}</CardTitle>
                        {pin.description && (
                          <CardDescription className="line-clamp-2">
                            {pin.description}
                          </CardDescription>
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
                      </CardHeader>
                    </Card>
                  </MarkerPopup>
                </MapMarker>
              )
            })}
          </ClickableMap>
          {canEdit && (
            <div className="absolute top-4 left-4 z-10 w-96 max-w-[calc(100%-2rem)]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Search for a location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LocationSearch
                    onLocationSelect={handleLocationSearch}
                    disabled={!canEdit}
                  />
                  <p className="text-xs text-muted-foreground">
                    Or click on the map to add a pin
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="w-96 border-l bg-card overflow-y-auto">
          <Tabs defaultValue="pins" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="pins" className="flex-1">
                Pins ({pins.length})
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1">
                <Calendar className="h-4 w-4 mr-1.5" />
                Timeline
              </TabsTrigger>
              {canEdit && (
                <TabsTrigger value="categories" className="flex-1">
                  Categories
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="pins" className="flex-1 overflow-y-auto p-4 space-y-2 m-0">
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
                      className="cursor-pointer transition-colors hover:bg-accent/5"
                      onClick={() => setSelectedPin(pin)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
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
            <TabsContent value="timeline" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
              {pins.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No pins yet. {canEdit && "Click on the map to add one!"}
                  </CardContent>
                </Card>
              ) : (
                <>
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      const categoryPins = pins.filter((pin) => pin.category_id === category.id)
                      if (categoryPins.length === 0) return null

                      return (
                        <Card key={category.id}>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name} ({categoryPins.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {categoryPins.map((pin) => {
                              const isSelected = selectedPin?.id === pin.id
                              return (
                                <Card
                                  key={pin.id}
                                  className={`cursor-pointer transition-colors ${
                                    isSelected ? "ring-2 ring-primary" : "hover:bg-accent/5"
                                  }`}
                                  onClick={() => setSelectedPin(isSelected ? null : pin)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-start gap-2">
                                      <div
                                        className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-0.5 border border-border"
                                        style={{ backgroundColor: category.color }}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm leading-tight line-clamp-1">
                                          {pin.name}
                                        </h4>
                                        {pin.description && (
                                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {pin.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          All Pins ({pins.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {pins.map((pin) => {
                          const category = pin.categories
                          const isSelected = selectedPin?.id === pin.id
                          return (
                            <Card
                              key={pin.id}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "ring-2 ring-primary" : "hover:bg-accent/5"
                              }`}
                              onClick={() => setSelectedPin(isSelected ? null : pin)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <div
                                    className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-0.5 border border-border"
                                    style={{ backgroundColor: category?.color || "#3b82f6" }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm leading-tight line-clamp-1">
                                      {pin.name}
                                    </h4>
                                    {pin.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                        {pin.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
            {canEdit && (
              <TabsContent value="categories" className="flex-1 overflow-y-auto p-4 m-0">
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
      <PinViewDialog
        open={isPinViewDialogOpen}
        onOpenChange={setIsPinViewDialogOpen}
        pin={viewingPin}
        onDelete={handlePinDelete}
        canEdit={canEdit}
      />
    </div>
  )
}
